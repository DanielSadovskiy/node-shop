const localStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');

function initialize(passport,getUserByEmail, getUserById){
    const authenticateUser = async (email,password,done) => {
        const user = getUserByEmail(email);
        alert(user);
        if(user == null){
            alert(1);
            return done(null,false,{message: "No user with such email"})
        }
        try{
            if( await bcrypt.compare(password, user.password)) {
                alert(2,user);
                return done(null,user);
            } else{
                alert(3,user);
                return done(null,false, {message: "Password is incorrect"})
            }
        }catch(e){
            return done(e);
        }
    }
    passport.use(new localStrategy({ usernameField: "email"},
    authenticateUser));
    passport.serializeUser((user,done)=> {})
    passport.deserializeUser((id,done)=> {})
}
module.exports = initialize