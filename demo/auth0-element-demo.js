import '@polymer/polymer/polymer-legacy.js';
import '../auth0-auth.js';
import '../auth0-delegate.js';
import '@polymer/paper-button/paper-button.js';
import { Polymer } from '@polymer/polymer/lib/legacy/polymer-fn.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
Polymer({
  _template: html`
    <style>
      :host {
        display: block;
      }
    </style>

    <app-location id="route" route="{{route}}"></app-location>
    <app-route route="{{route}}" pattern="/:page" query-params="{{params}}"></app-route>

    <auth0-auth id="auth0" client-id="LP1BxaYQm2NQTZG64MQqHmI2xxDiRMaf" domain="johnlim.au.auth0.com" options="{{auth0Options}}" logout-redirect-to="{{auth0Options.redirectUri}}" user-profile="{{user}}" id-token="{{idToken}}" query-params="{{params}}" jwt-manager="">
    </auth0-auth>

    <auth0-delegate client-id="LP1BxaYQm2NQTZG64MQqHmI2xxDiRMaf" domain="johnlim.au.auth0.com" options="{{firebaseDelegate}}" id-token="[[idToken]]" delegate-token="{{firebaseDelegateToken}}">
    </auth0-delegate>

    <firebase-app auth-domain="auth0-element-demo.firebaseio.com" database-url="https://auth0-element-demo.firebaseio.com/" api-key="AIzaSyAT3zy3a4hz0sXr3dNGVK6NKVC7tTMys6c" name="auth0-element-demo">
    </firebase-app>

    <firebase-auth id="firebase" user="{{firebaseUser}}" on-error="_handleError" app-name="auth0-element-demo">
    </firebase-auth>
    <paper-button id="signout" raised="" on-tap="signout">Sign out</paper-button>
    <h3>Firebase UID: {{firebaseUser.uid}}</h3>
`,

  is: 'auth0-element-demo',

  properties: {
    user: {
      type: Object,
      value: function(){return{};}
    },
    idToken: {
      type: String,
    },
    firebaseDelegate: {
      value: function() {
        var firebase = {
          api : 'firebase',
          scope : 'openid name email displayName'
        };
        return firebase;
      }
    },

    firebaseDelegateToken: {
      type: String,
      value: '',
      observer: 'signIntoFirebase'
    },
    firebaseUser: {
      value: null
    },
    auth0Options: {
      type: Object,
      value: function () {
        return {
          auth: {
            scope: 'openid email',
            redirectUri: window.location.origin + '/auth0-element/components/auth0-element/demo/',
            responseType: 'token',
            connection: 'Username-Password-Authentication',

          },
          allowedConnections: ['Username-Password-Authentication'],
          closable: false
        }
      }
    },
    route: {
      type: Object
    },
    params: {
      type: Object
    }
  },

  signIntoFirebase: function(token) {
    if(token) {
      this.$.firebase.signInWithCustomToken(token).catch(function(error) {
        console.log(error);
      });
    }
  },

  signout: function() {
    this.$.firebase.signOut();
    this.$.auth0.signOut('LP1BxaYQm2NQTZG64MQqHmI2xxDiRMaf');
  }
});