const jwt=require('jsonwebtoken');

const authenticate=(req,res,next)=>{
    try {
        const token=req.cookies.token;
        if(!token){
            return res.send('unauthorized user!');
        } 
        const decode=jwt.verify(token,process.env.JWT_SECRET);
        if(!decode){
            return res.send('unauthorized user');
        }
        req.id=decode.id;
        next();
    } catch (error) {
        console.log(error);
    res.status(401).send("unauthorized User");
    }
}

module.exports=authenticate;