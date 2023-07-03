const mongoose=require("mongoose");
let bcrypt=require('bcrypt');
let jwt=require('jsonwebtoken');
const userschema=mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    cpassword:{
        type:String,
        required:true
    },
    age:{
        type:Number,
        required:true
        
    },
    gender:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    phonenumber:{
        type:String,
        required:true,
        unique:true
    },
    imagePath: {
        type: String
      },
    tokens:[{
        token:{
            type:String,
        required:true
        }
    }]

});

userschema.methods.tokencreate=async function(){
    try{
        const token =jwt.sign({_id:this._id},"thismysceretecodegivenbysaikumartarra");
        this.tokens=this.tokens.concat({token:token})
        await this.save();
        return token;
    }catch(err){
        
        console.log(err);
    }
}

userschema.pre("save", async function(next){
  
    if(this.isModified("password")){
    this.password= await bcrypt.hash(this.password,10);
    this.cpassword= await bcrypt.hash(this.cpassword,10);
    
    console.log("password"+this.password);
    console.log("cpassword"+this.cpassword);
    }
next();

   
    
})


const userdata=new mongoose.model("bmidata",userschema);
module.exports=userdata;