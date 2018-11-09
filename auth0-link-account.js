import '@polymer/polymer/polymer-element.js';
import auth0 from 'auth0-js';

class Auth0LinkAccount extends Polymer.Element {
  static get template() {
    return Polymer.html`

`;
  }

  static get is() {
    return 'auth0-link-account'
  }

  static get properties() {
    return {
      connection: {
        type: String,
        notify: true
      },
      clientId: {
        type: String
      },
      domain: {
        type: String
      },
      options: {
        type: Object
      }
    }
  }

  static get observers() {
    return [
      '_initAccountLinking(connection)'
    ]
  }

  _initAccountLinking(connection) {
    if (!connection) {
      return
    }
    localStorage.setItem('auth0:link-account', connection);

    var webAuth = new auth0.WebAuth({
      domain: this.domain,
      clientID: this.clientId
    });

    var options = Object.assign({}, this.options, {connection: this.connection});

    webAuth.authorize(options);
  }
}
customElements.define(Auth0LinkAccount.is, Auth0LinkAccount);
