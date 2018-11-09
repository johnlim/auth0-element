import { PolymerElement } from '@polymer/polymer/polymer-element.js';
import '@polymer/iron-ajax/iron-ajax.js';
import auth0 from 'auth0-js';
import Auth0Lock from 'auth0-lock';
import 'jwt-decode/build/jwt-decode.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';

class Auth0Auth extends PolymerElement {
  static get template() {
    return html`
    <iron-ajax id="ajax" method="DELETE">
    </iron-ajax>
`;
  }

  static get is() { return 'auth0-auth'; }
  static get properties() {
    return {
      clientId: {
        type: String
      },
      domain: {
        type: String
      },
      options: {
        type: Object
      },
      logoutRedirectTo: {
        type: String
      },
      userProfile: {
        readOnly: true,
        notify: true,
        type: Object
      },
      /**
       * A pointer to the auth0 instance being used by the element.
       */
      auth0: {
        type: Object,
        readOnly: true
      },
      localStorageKey: {
        type: String,
        readOnly: true,
        value: "auth0:authUser"
      },
      idToken: {
        type: String,
        readOnly: true,
        notify: true
      },
      hostedPages: {
        type: Boolean,
        value: false
      },
      jwtManager: {
        type: Boolean,
        value: false
      },
      _expirationMonitor: {
        type: Object
      },
      prop1: {
        type: String,
        value: 'auth0-element'
      },
      x: Object,
      y: Object,
      z: Object
    }
  }

  static get observers() {
    return [
      '_init(clientId, domain, options)',
      '_monitorExpiry(idToken, jwtManager)'
    ]
  }

  constructor() {
    super();
    this.x = auth0;
    this.y = Auth0Lock;
    this.z = Auth0Lock;
    console.log('calling constructor this.x', this.x)
    console.log('calling constructor this.y', this.y)
    console.log('calling constructor this.z', this.z)
  }
  _init(clientId, domain, options) {
    if(clientId !== undefined && domain !== undefined && options !== undefined) {
      // instantiate Lock
      this._setAuth0(new auth0.WebAuth({
            domain: domain,
            clientID: clientId,
            redirectUri:  options.auth.redirectUri,
            responseType: options.auth.responseType
          })
      );

      if (localStorage.getItem('auth0:link-account')) {
        localStorage.removeItem('auth0:link-account');
        this.auth0.parseHash(function(err, authResult) {
          if (authResult && authResult.idToken) {
            window.location.hash = '';
            this.linkAccount(authResult.idToken);
          }
        }.bind(this));
        return
      }

      this._parseHash();
    }
  }

  _parseHash() {
    if (this._tokenIsValid()) {
      var idToken = localStorage.getItem('auth0:authUser');
      var accessToken = localStorage.getItem('auth0:accessToken');
      this.auth0.client.userInfo(accessToken, function(err, user) {
        this._setUserProfile(user);
        this._setIdToken(idToken);
      }.bind(this));
      return
    }
    this.auth0.parseHash(function(err, authResult) {
      if (authResult && authResult.accessToken && authResult.idToken) {
        this.auth0.client.userInfo(authResult.accessToken, function(err, user) {
          localStorage.setItem('auth0:authUser', authResult.idToken);
          localStorage.setItem('auth0:accessToken', authResult.accessToken);
          this._setUserProfile(user);
          this._setIdToken(authResult.idToken);
        }.bind(this));
        window.location.hash = '';
        return
      } else {
        this.auth0.checkSession({
          scope: this.options.auth.scope
        }, function (err, result) {
          if (err || !result || !result.idToken || !result.accessToken) {
            // regular login
            if(this.hostedPages) {
              this.auth0.authorize(this.options.auth);
              return
            }
            //else
            var lock = new Auth0Auth.lock(this.clientId, this.domain, this.options);
            lock.show();
          } else {
            this.auth0.client.userInfo(result.accessToken, function(err, user) {
              localStorage.setItem('auth0:authUser', result.idToken);
              localStorage.setItem('auth0:accessToken', result.accessToken);
              this._setUserProfile(user);
              this._setIdToken(result.idToken);
            }.bind(this));
          }
        }.bind(this));
      }
    }.bind(this));
  }

  _handleTokenExpiration() {
    this.auth0.checkSession({
      scope: this.options.auth.scope
    }, function (err, result) {
      if (err || !result || !result.idToken || !result.accessToken) {
        // regular login
        if(this.hostedPages) {
          this.auth0.authorize(this.options.auth);
          return
        }
        //else
        var lock = new Auth0Lock(this.clientId, this.domain, this.options);
        lock.show();
      } else {
        this.auth0.client.userInfo(result.accessToken, function(err, user) {
          localStorage.setItem('auth0:authUser', result.idToken);
          localStorage.setItem('auth0:accessToken', result.accessToken);
          this._setUserProfile(user);
          this._setIdToken(result.idToken);
        }.bind(this));
      }
    }.bind(this));
  }

  _tokenIsValid() {
    var idToken = localStorage.getItem('auth0:authUser');
    var accessToken = localStorage.getItem('auth0:accessToken');
    if (idToken && accessToken) {
      var decoded = jwt_decode(idToken);
      var timeToExpiryInMilliseconds= decoded.exp * 1000 - Date.now();
      return timeToExpiryInMilliseconds > 0 ? true : false
    }
    return false
  }

  _monitorExpiry(idToken, jwtManager) {
    if (jwtManager === true && idToken) {
      if(typeof this._expirationMonitor === 'function') {
        this._expirationMonitor();
      }
      this._expirationMonitor = (function () {
        var decoded = jwt_decode(idToken);
        var interval = 60 * 1000; //60 secs
        var timerId = setInterval(function () {
          var timeToExpiryInMilliseconds = decoded.exp * 1000 - Date.now();
          if (timeToExpiryInMilliseconds <= 0) {
            clearInterval(timerId);
            timerId = null;
            this._handleTokenExpiration()
          }
        }.bind(this), interval);
        return function () {
          if (timerId) {
            clearInterval(timerId);
          }
        }
      }.bind(this)());
    }
  }

  signOut(clientId) {
    localStorage.removeItem(this.localStorageKey);
    this.auth0.logout({returnTo: this.logoutRedirectTo, client_id: clientId}, {version: 'v2'});
  }

  linkAccount(secondaryJwt) {
    var primaryJWT = localStorage.getItem('auth0:authUser');
    var primaryAccessToken = localStorage.getItem('auth0:accessToken');


    this.auth0.client.userInfo(primaryAccessToken, function (err, user) {
      var primaryUserId = user.user_id;
      var auth0Management = new auth0.Management({
        domain: this.domain,
        token: primaryJWT
      });
      auth0Management.linkUser(primaryUserId, secondaryJwt, function () {
        this.auth0.client.userInfo(primaryAccessToken, function (err, user) {
          this._setUserProfile(user);
        }.bind(this));
      }.bind(this))
    }.bind(this));
  }

  unlinkAccount(connection) {
    return new Promise(function (resolve, reject) {
      var primaryAccessToken = localStorage.getItem('auth0:accessToken');
      var idToken = localStorage.getItem('auth0:authUser');
      this.auth0.client.userInfo(primaryAccessToken, function (err, user) {
        var primaryUserId = user.user_id;
        var secondaryUserId = user.identities.filter(function (identity) {
          return identity.connection === connection
        })[0].user_id;
        this.$.ajax.url = 'https://' + this.domain + '/api/v2/users/' + primaryUserId + '/identities/' + connection + '/' + secondaryUserId;
        this.$.ajax.headers = {Authorization: "Bearer " + idToken};
        var request = this.$.ajax.generateRequest();
        request.completes.then(function () {
          var accessToken = localStorage.getItem('auth0:accessToken');
          this.auth0.client.userInfo(accessToken, function (err, user) {
            this._setUserProfile(user);
          }.bind(this));
          resolve()
        }.bind(this)).catch(function (error) {
          reject(error)
        })
      }.bind(this));
    }.bind(this));
  }
}
customElements.define(Auth0Auth.is, Auth0Auth);
Auth0Auth.lock = Auth0Lock;
