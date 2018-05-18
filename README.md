
# \<auth0-element\>[![Published on webcomponents.org](https://img.shields.io/badge/webcomponents.org-published-blue.svg)](https://www.webcomponents.org/element/johnlim/auth0-element)  

A collection of Polymer V1.0 elements that makes it easy to declaratively use [Auth0](https://auth0.com).  
> For Polymer V2.0, please refer to the 2.0-preview branch.  
> For Polymer V3.0 and litElement, they are currently under active development and will be published shortly.  
  
\<auth0-element\> supports the following Auth0 features:   
* Authentication  
* [Auth0 Lock](https://auth0.com/lock)  
* [Hosted Pages](https://auth0.com/docs/hosted-pages)  
* [SSO](https://auth0.com/docs/sso/current)  
* [Account Linking](https://docs.auth0.com/link-accounts)  
* [Delegation Token](https://auth0.com/docs/tokens/delegation) used to call the API of an Application Addon, such as Firebase. (Please see deprecation [information](https://auth0.com/docs/api-auth/tutorials/adoption/delegation#third-party-apis-such-as-firebase-or-aws-) for Delegation Tokens)  
   
It also includes a JWT manager that handles expiry of ID tokens.   
  
### Demo  
A live demo of the element in action can be found [here](https://johnlim.github.io/auth0-element/components/auth0-element/demo/ ).
 
 ### API Doc 
The API documentation can be found [here](https://johnlim.github.io/auth0-element/components/auth0-element/).

### Example - Authentication
Enabling authentication which uses [Hosted Pages](https://auth0.com/docs/hosted-pages)  with JWT manager enabled by importing the \<auth0-auth\> element into your html and setting the properties accordingly.    
```html 
<auth0-auth  
	client-id="YOUR_CLIENT_ID"
	domain="YOUR_AUTH0_DOMAIN"
	options="AUTH0.JS_OPTIONS_OBJECT" 
	logout-redirect-to="LOGOUT_URL" 
	user-profile="{{userProfile}}" 
	id-token="{{idToken}}" 
	hosted-pages 
	jwt-manager>
</auth0-auth>  
```  
 [Auth0 Lock](https://auth0.com/lock)   will be used if `hosted-pages` is omitted from the properties. 
 ### Example - Obtaining a Delegation Token
 Import the \<auth0-delegate\> element and configure the properties accordingly. By binding the idToken property to the idToken received from Auth0, \<auth0-delegate\> will automatically request a delegate token from Auth0 when a valid ID Token is received. 
 ```html
 <auth0-delegate  
  client-id="YOUR_CLIENT_ID"  
  domain="YOUR_AUTH0_DOMAIN	"  
  options="OPTIONS"  
  id-token="[[idToken]]"  
  delegate-token="{{firebaseDelegateToken}}">  
</auth0-delegate>
 ``` 
 Obtaining a delegation token to authenticate with Firebase can be found in the accompanying [demo](https://johnlim.github.io/auth0-element/components/auth0-element/demo/ ). 
 ### Example - Account Linking
 To accomplish account linking,  you'll need an \<auth0-auth\>element included somewhere in your application that handles authentication. Import the \<auth0-link-account\> element and set the properties accordingly. To initiate the account linking process, set the `connection` property.
 ```html
 <auth0-link-account  
  client-id="YOUR_CLIENT_ID"  
  domain="YOUR_AUTH0_DOMAIN"  
  options="OPTIONS"  
  connection="google-oauth2">  
</auth0-link-account>
 ```
# Development
 ## Install the Polymer-CLI  
  
First, make sure you have the [Polymer CLI](https://www.npmjs.com/package/polymer-cli) installed. Then run `bower install` to install dependencies followed by `polymer serve` to serve your application locally.  
  
## Viewing the Demo and API docs   
  
``` 
$ bower install 
$ polymer serve  
```  
  
## Building the element
  
```  
$ bower install
$ polymer build  
```  
  
This will create a `build/` folder with `bundled/` and `unbundled/` sub-folders  
containing a bundled (Vulcanized) and unbundled builds, both run through HTML,  
CSS, and JS optimizers.  
  
You can serve the built versions by giving `polymer serve` a folder to serve  
from:  
  
```  
$ polymer serve build/bundled  
```  
  
## Running Tests  
  
```  
$ polymer test  
```  
  
Your application is already set up to be tested via [web-component-tester](https://github.com/Polymer/web-component-tester). Run `polymer test` to run your application's test suite locally.