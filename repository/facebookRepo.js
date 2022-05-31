const FacebookUser = require('../models/fbUser')

module.exports={
    saveorupdate: function(profile) {

    

        // find the user in the database based on their google id
        FacebookUser.findOne({ 'id' : profile.id }, function(err, user) {

            // if there is an error, stop everything and return that
            // ie an error connecting to the database
            if (err)
                return (err);

            // if the user is found, then log them in
            if (user) {
                console.log("user found")
                console.log(user)
                return (user); // user found, return that user
            } else {
                // if there is no user found with that google id, create them
                var newUser = new FacebookUser();

                // set all of the google information in our user model
                newUser.uid    = profile.id; // set the users facebook id                              
                newUser.name  = profile.first_name + ' ' + profile.last_name; 
                newUser.email = profile.email
               
                

                newUser.save(function(err) {
                    if (err)
                        throw err;

                    // if successful, return the new user
                    return (newUser);
                });
            }

        });

 

}
}
