const router = require("express").Router()
const auth = require("../middleware/auth")
const category = require("../models/categories")
const product = require("../models/product")





// ********** VIEW CATEGORY AND PRODUCT IN INDEX PAGE *********

router.get("/", async (req,resp)=>{
  const data = await category.find()
  const prod = await product.find()
  console.log("product and category");
  resp.render("index",{catdata:data,proddata:prod})
})

router.get("/shop",(req,resp)=>{
  resp.render("shop")
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
        resp.redirect("/")

       }
       else{
        resp.render("login",{err: "invalid credentials"})
       } 

  } catch (error) {
    resp.render("login",{err: "invalid credentials !!!"})
  }

})

 
//                  ***************  C A R T ****************
  
const Cart = require("../models/cart")

  router.get("/cart", auth,async(req,resp)=>{  
  
    
      const user = req.user
      try {
        const cartdata = await Cart.aggregate([{$match:{uid:user._id}},{$lookup:{from:"products",localField:"pid",foreignField:"_id",as:"product"}}])


          var sum = 0;
        for(var i=0; i<cartdata.length; i++)
        {
          // console.log(cartdata[i].total,"total data");
           sum = sum + cartdata[i].total
        }
        console.log(sum);

        resp.render("cart",{currentuser:user.uname, cartdata:cartdata, sum :sum})
      } catch (error) {
        
      }
   
      
  })

 // ***************** A D D__C A R T ****************


  router.get("/add_cart", auth,async(req,resp)=>
  {
    const pid = req.query.pid  // product id and data
    // console.log(pid,"product data ");
    const uid  = req.user._id  // user id and data
    console.log(pid,uid,"add cart na data");


    try {


      const pdata = await product.findOne({_id:pid})    // product data 
      const cartdata = await Cart.findOne({$and:[{pid:pid},{uid,uid}]})    //  cart data and find product id and data

      // jo cart ma biji vaar koi add to cart kare to , qty +1 thavi joie and price pan update thavi joie 
      if(cartdata)
      {
        var qty = cartdata.qty    //  quantity
        qty++;                     // encrease qty

        var price = qty * pdata.price  // price  ,  product data mathi Aveli price * current qty
        await Cart.findByIdAndUpdate(cartdata._id,{qty:qty,total:price}) 
        resp.send("product added into cart !") // then update qty and price

      }
      
      
      // jo user pelli var product add karse to else ni method call thase
      else{

        // const pdata = await product.findOne({_id:pid}) // product data
        // const pdata = await product.findOne({_id:pid}) 
        const cart = new Cart({ // cart scema na data 
          uid:uid,
          pid:pid,
          qty: 1,  //  quantity by default 1 levi
          price : pdata.price,  // product data ma je price hse te Avse
          total : pdata.price 

        })
        await cart.save()
        resp.send("product added into cart !") 
       }
  
      } catch (error) {
        console.log(error,"add cart error");
      }
     
    })




    //   *****************  remove cart *****************

router.get("/removecart", async (req,resp)=>{
    try {
       const _id = req.query.cid
       await Cart.findByIdAndDelete(_id)
       resp.redirect("cart")
   } catch (error) {
    console.log(error,"remove cart error");
   }
    })



    router.get("/changeqty",async(req,resp)=>{
      try {
        
           const cartid =req.query.cartid
           const value = req.query.value

           const cartdata = await Cart.findOne({_id:cartid})
           const pdata = await product.findOne({_id:cartdata.pid})
           var qty = cartdata.qty + Number(value)

           if(qty==0)
           {

              await Cart.findByIdAndDelete(cartid)

           }else{
              var total = qty * pdata.price
              await Cart.findByIdAndUpdate(cartid,{qty:qty,total:total})
              resp.send("updated data ")
             }

           
      } catch (error) {
        console.log(error,"changeqty error");
      }
    })
      

     
    
    
   
   

  













module.exports = router