const jwt = require('jsonwebtoken')
const secretKey = 'Auth.Dev@123'
function setUser(userData){

    return jwt.sign(
        { userId: userData._id, email: userData.email },
        secretKey,
        // { expiresIn: '1h' } // Token expiration time (1 hour in this case)
      );
    
}
function getUser(token){
    return jwt.verify(token,secretKey)
}
module.exports = {setUser,getUser}