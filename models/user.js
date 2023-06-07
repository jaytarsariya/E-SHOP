const mongoose = require("mongoose")
const bcrypt = require("bcryptjs")

const userschema = new mongoose.Schema({
      
      uname:{
        type:String
      },
      email:{
        type:String
      },
      phone:{
        type:String
      },
      pass:{
        type:String
      }

})


userschema.pre("save", async function(){
try {
   
  if(this.isModified("pass")){
          this.pass = await bcrypt.hash(this.pass,10)
         }
} catch (error) {
  console.log(error);
}
})

module.exports = new mongoose.model("EshopUser",userschema)