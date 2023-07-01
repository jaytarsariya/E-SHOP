const express = require("express")
const app = express();
require("dotenv").config()
const mongoose = require("mongoose")
const path = require("path")
const hbs = require("hbs")
const bodyparser = require("body-parser")
var cookieParser = require('cookie-parser')

const port = process.env.PORT
const url = process.env.URL
mongoose.connect(url).then(()=>{
  console.log("db connected");
})

app.use(cookieParser())
app.use(bodyparser.urlencoded({extended:false})) // body- parser
const publicpath = path.join(__dirname,"../public")
const viewpath = path.join(__dirname,"../templates/views")
const partialspath = path.join(__dirname,"../templates/partials")


app.set("view engine", "hbs")
app.set("views",viewpath)
hbs.registerPartials(partialspath)// partials path
app.use(express.static(publicpath))


app.use("/",require("../router/userRouter"))
app.use("/",require("../router/admin"))






app.listen(port, ()=>{
  console.log(`server running on port no ${port}`);
})








// vid 8 , product ni detail add thai gai che , payment thi baaki che.
// vid 8,  multer image add karvani che practice saru che .
// vid no 9 saru karvano che category nu name project ma add thai gyu che, kai rite thyu te jovanu che
// vid no 9 puro thai gayo che , view detail ma name and image thai gyu che , hve product cart ma add karvani che ,  

// vid no 10   ,    10 min thi baaki che , add to cart ni method karvani che 

// vid no 10 pro thai gayo che , 11 thisaru karvanu che , cart ma product add thai gai che have ajx and quantity +  -  karvani che.
//  11 mo vid. 49 min  ,  cart ma data add thai jay chge hve aagal ni process karvani che
// vid no 11 puro thai gayo che ,  cart na data + - thi page reload thai che have payment nu baaki che 


  