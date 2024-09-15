const AuthorizationFromToken =  (req,res,next)=>{
    const authHeader = req.header['Authorization']
    const token = authHeader&& authHeader.split('')[1]
    if(!token){
        return res.json({message:'invalid password'})
    }
    next()

}
module.exports = AuthorizationFromToken