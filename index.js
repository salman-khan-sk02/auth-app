const express =  require("express");
const axios = require("axios");
const cors = require("cors");

const cookieParser = require("cookie-parser");
const googleRepo = require("./repository/googleRepo.js");
const google = require("./auth/google.js");
const facebook = require("./auth/facebook.js");

const {
    SERVER_ROOT_URI,
    GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET,
    FACEBOOK_APP_ID,
    FACEBOOK_SECRET,
  } = require("./config");
const facebookRepo = require("./repository/facebookRepo.js");
const swaggerUi = require("swagger-ui-express"),
swaggerDocument = require("./swagger.json");

  const port = 4000;

const app = express();


const corsOptions ={
   origin:'*', 
   credentials:true,            //access-control-allow-credentials:true
   optionSuccessStatus:200,
}

app.use(cors(corsOptions)) // Use this after the variable declaration


app.use(cookieParser());

const googleRedirectURI = "auth/google";
const facebookRedirectURI = "auth/facebook"

// Getting login URL
app.get("/auth/google/url", (req, res) => {
    return res.redirect(google.getGoogleAuthURL(SERVER_ROOT_URI, googleRedirectURI, GOOGLE_CLIENT_ID));
  });
  app.get("/auth/facebook/url", (req, res) => {
    return res.redirect(facebook.getFacebookAuthURL(SERVER_ROOT_URI, facebookRedirectURI, FACEBOOK_APP_ID));
  });
  

  
  // Getting the user from Google with the code
app.get(`/${googleRedirectURI}`, async (req, res) => {
    const code = req.query.code;
  
    const { id_token, access_token } = await google.getTokens( code, GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, `${SERVER_ROOT_URI}/${googleRedirectURI}`);
  
    // Fetch the user's profile with the access token and bearer
    const googleUser = await axios
      .get(
        `https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${access_token}`,
        {
          headers: {
            Authorization: `Bearer ${id_token}`,
          },
        }
      )
      .then((res) => res.data)
      .catch((error) => {
        console.error(`Failed to fetch user`);
        throw new Error(error.message);
      });
  
    
    console.log (googleUser);
    await  googleRepo.saveorupdate(googleUser);
    
  res.send("logged in successfuly")
    
    
  });

  app.get(`/${facebookRedirectURI}`, async (req, res) => {
    const code = req.query.code;

    const  access_token  = await facebook.getTokens(code, FACEBOOK_APP_ID, FACEBOOK_SECRET, `${SERVER_ROOT_URI}/${facebookRedirectURI}`);
    
    const facebookUser = await facebook.getUser(access_token);
    
    await  facebookRepo.saveorupdate(facebookUser);
    res.send("logged in successfuly")
  });


  app.use(
    '/api-docs',
    swaggerUi.serve, 
    swaggerUi.setup(swaggerDocument)
  );
  app.listen(port, async () => {

    console.log(`App is listening at port ${port}`);
    
  });

  