import { PolymerElement } from '@polymer/polymer/polymer-element.js';
import auth0 from 'auth0-js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';

class Auth0Delegate extends PolymerElement {
  static get template() {
    return html`

`;
  }

  static get is() { return 'auth0-delegate'; }
  static get properties() {
    return {
      idToken: {
        type: String
      },
      options: {
        type: Object
      },
      clientId: {
        type: String
      },
      delegateToken: {
        type: String,
        readOnly: true,
        notify: true,
        value: ''
      }
    }
  }
  static get observers() {
    return [
      '_getDelegateToken(domain, clientId, idToken, options)'
    ]
  }

  _getDelegateToken(domain, clientId, idToken, options) {
    if(clientId !== undefined && domain !== undefined && options !== undefined && idToken !== undefined) {
      var auth = new auth0.Authentication({
        domain:       this.domain,
        clientID:     this.clientId
      });
      var options = {
        id_token: this.idToken,
        apiType: this.options.api,
        scope: this.options.scope,
        target: this.clientId,
        grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer'
      };
      // Make a call to the Auth0 '/delegate'
      auth.delegation(options, function(err, result) {
        if(!err) {
          this._setDelegateToken(result.idToken);
        }
      }.bind(this));
    }
  }
}

customElements.define(Auth0Delegate.is, Auth0Delegate);
