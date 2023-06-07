const jwt = require("jsonwebtoken")
const user = require("../models/user")


const auth = async(req,resp,next)=>{

  try {
      const mytoken = req.cookies.jwt
      console.log("hooo",mytoken);
      const verifytoken = await jwt.verify(mytoken,process.env.S_KEY)

      console.log(verifytoken);
      if(verifytoken){
        const userdata = await user.findOne({_id:verifytoken._id})
        req.user = userdata
        req.token = mytoken 
        next();
      }
  } catch (error) { 
    resp.render("login",{err:"please login first !!"})
  }

}















module.exports = auth;