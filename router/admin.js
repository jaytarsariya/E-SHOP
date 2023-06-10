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



router.get("/products", aauth, async(req,resp)=>{
  try {
    resp.render("products")
  } catch (error) {
    console.log(error);
  }
})


//**************************** Category ****************************
const category = require("../models/categories")


router.get("/category", aauth, async(req,resp)=>{
  try {
    const data = await category.find()
    resp.render("category",{catdata:data})
  } catch (error) 
  {
    console.log("admin.js category page ni error che",error);
  }
})


router.post("/add_category", aauth,async(req,resp)=>{
  try {
    const cat = await category(req.body)
     await cat.save();
     resp.redirect("category")
  } catch (error) {
    console.log(error);
  }
})

//  ***************** PRODUCT *****************************

router.get("/product", aauth,async(req,resp)=>{
  try {
    console.log("heloo product");
    const data = await category.find()
    console.log("123",data);
    resp.render("products",{catdata:data})
  } catch (error) {
    console.log(error);
  }
})

router.post("/add_product", aauth,async(req,resp)=>{
  try {
    const cat = await category(req.body)
     await cat.save();
     resp.redirect("category")
  } catch (error) {
    console.log("admin.js ma add category ni error",error);
  }
})
module.exports = router