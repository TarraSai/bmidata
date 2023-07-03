

// const authorization=async (req,res,next)=>{
//    try{

      
//     const token=req.cookies.token;
//     console.log("the token is="+token);
//   const matchtoken=jwt.verify(token,"thismysceretecodegivenbysaikumartarra")
//   console.log(matchtoken);
//   const user=await userinfor.findOne({_id:matchtoken});
//   console.log(user.name);
// next();

//    }catch(err){
//     console.log(err);
//    }
// }
const jwt = require('jsonwebtoken');
const userinfor = require('../database/userdata');

const authorization = async (req, res, next) => {
  try {
    const token = req.cookies.usertoken;
    if (!token) {
      return res.status(401).send('Authentication required'); // No token provided
    }

    const decodedToken = jwt.verify(token, 'thismysceretecodegivenbysaikumartarra');
    const userId = decodedToken._id;
    const user = await userinfor.findOne({ _id: userId });

    if (!user) {
      return res.status(401).send('User not found'); // User not found
    }

    req.user = user; // Attach the user object to the request
    next();
  } catch (err) {
    console.log(err);
    res.status(401).send('Invalid token'); // Invalid token
  }
};

module.exports = authorization;

module.exports=authorization;