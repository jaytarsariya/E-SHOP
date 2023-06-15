const router = require("express").Router()
const auth = require("../middleware/auth")
const category = require("../models/categories")
const product = require("../models/product")





// ********** VIEW CATEGORY AND PRODUCT IN INDEX PAGE *********

router.get("/", async (req,resp)=>{
  const data = await category.find()
  const prod = await product.find()
  resp.render("index",{catdata:data,proddata:prod})
})

router.get("/shop",(req,resp)=>{
  resp.render("shop")
})

router.get("/cart", auth, (req,resp)=>{  //  auth banavyu che adguru che vid 45 min..
  resp.render("cart")
})

router.get("/contact",(req,resp)=>{
  resp.render("contact")
})

router.get("/detail",(req,resp)=>{
  resp.render("detail")
})

router.get("/registration",(req,resp)=>{
  resp.render("registration")
})
router.get("/login",(req,resp)=>{
  resp.render("login")
})


// ******************* index page par thi aveli req.***********
router.get("/details",async (req,resp)=>{
  const id = req.query.pid
  try {
    const prod = await product.findOne({_id:id})
    console.log("detail na data",prod);
    resp.render("detail",{productdata:prod})
  } catch (error) {
    console.log(error,"detail");
  }
  
})


//*************************user registration****************** */
const user = require("../models/user")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")


router.post("/do_register",async(req,resp)=>{
    try {
        const data = new user(req.body)
        console.log(data);
        await data.save();
        resp.render("login",{msg:"Registration successfully done !!!"})
    } catch (error) {
        console.log(error);
    }
})

//  **********do login *****************

router.post("/login", async (req,resp)=>{

  try {
    
 
    const data = await user.findOne({email:req.body.email})
    const ismatch = await bcrypt.compare(req.body.pass,data.pass)
     
       if(ismatch){
        const token = await jwt.sign({_id:data._id}, process.env.S_KEY)//  token genration
        console.log("token:=>",token);     
        resp.cookie("jwt",token)//  Add coockie
        resp.render("index",{currentuser:data.uname})
       }
       else{
        resp.render("login",{err: "invalid credentials"})
       } 

  } catch (error) {
    resp.render("login",{err: "invalid credentials !!!"})
  }

})











module.exports = router