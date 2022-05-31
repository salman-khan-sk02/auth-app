const querystring = require("querystring");
const axios = require("axios");
module.exports={
    getFacebookAuthURL: function(SERVER_ROOT_URI, redirectURI, FACEBOOK_APP_ID ) {
        const stringifiedParams = querystring.stringify({
            client_id: FACEBOOK_APP_ID,
            redirect_uri: `${SERVER_ROOT_URI}/${redirectURI}`,
            scope: ['email', 'user_friends'].join(','), // comma seperated string
            response_type: 'code',
            auth_type: 'rerequest',
            display: 'popup',
          });
          
          const facebookLoginUrl = `https://www.facebook.com/v4.0/dialog/oauth?${stringifiedParams}`;
          return facebookLoginUrl;
    },

    getTokens: async function( code,client_id,client_secret,redirect_uri){

        const { data } = await axios({
            url: 'https://graph.facebook.com/v4.0/oauth/access_token',
            method: 'get',
            params: {
              client_id: client_id,
              client_secret: client_secret,
              redirect_uri: redirect_uri,
              code,
            },
          });
          console.log(data); // { access_token, token_type, expires_in }
          return data.access_token;
    },

    getUser: async function(access_token){
        const { data } = await axios({
            url: 'https://graph.facebook.com/me',
            method: 'get',
            params: {
              fields: ['id', 'email', 'first_name', 'last_name'].join(','),
              access_token: access_token,
            },
          });
          console.log(data); // { id, email, first_name, last_name }
          return data;
    }
}