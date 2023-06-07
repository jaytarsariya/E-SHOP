const router = require("express").Router()
const Admin = require("../models/admin")
const jwt = require("jsonwebtoken")
const aauth = require("../middleware/adminauth")


router.get("/dashboard",aauth,(req,resp)=>{
  resp.render("dashboard")
})
router.get("/Alogin",(req,resp)=>{
  resp.render("ad_login")
})


router.post("/do_adminlogin", async (req,resp)=>{
  try {
    const admin =await Admin.findOne({uname:req.body.uname})

    if(admin.pass === req.body.pass)
    {
      const gentoken = await jwt.sign({_id:admin._id},process.env.A_KEY) // genrate token
      resp.cookie("Ajwt",gentoken)
      resp.redirect("dashboard")
    } 
    else{
      resp.render("ad_login", {err:"invalid details !!!"})
    }
  } catch (error) {
    resp.render("ad_login", {err:"invalid details !!"})
  }
      
     
})

//  ****************** LOGOUT *******************************

router.get("/admin_logout",async(req,resp)=>{
  try {
    console.log("hello admin logout");
    resp.clearCookie("Ajwt") // delete cookies
    resp.render("ad_login")
  } catch (error) {
    console.log(error);
  }
})


module.exports = router