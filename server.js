let express=require("express");
let hbs=require('hbs');
let path=require('path');
let app=express();
let bcrypt=require('bcrypt');
let cookieParser=require('cookie-parser');
let authorization=require('./front/authorization');
const multer = require('multer');
require("./database/connection");
let userdata=require("./database/userdata");

//for data is saw in page
const upload = multer({ dest: 'uploads/' });
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({extended:false}));



const { Console } = require("console");
//static path
const staticpath=path.join(__dirname,"./public")

const fornt_view=path.join(__dirname,"./views/frontview");
const nav_path=path.join(__dirname,"./views/nav")
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.set('view engine', 'hbs');
app.set('views',fornt_view);
hbs.registerPartials(nav_path);

 app.use(express.static(staticpath));


app.get('/home',(req,res)=>{
    res.render('home');
});


app.get('/aboutus',(req,res)=>{
    res.render('aboutus');
});
app.get('/register',(req,res)=>{
    res.render('register');
});

app.post('/register',async(req,res)=>{
   try{
    let password=req.body.password;
    let cpassword=req.body.cpassword;
    if(password==cpassword){
const registerdata=new userdata({

    name:req.body.name,
    password:password,
    cpassword:cpassword,
    age:req.body.age,
    gender:req.body.gender,
    email:req.body.email,
    phonenumber:req.body.phonenumber,
}) ;

 let token= await registerdata.tokencreate();


res.cookie("usertoken",token,{
    expires:new Date(Date.now()+24 * 60 * 60 * 1000),
    httpOnly:true
});




const registered=await registerdata.save();


 
res.status(201).render("home");
    }
    else{
        // res.send("password is not marching..");
        return res.render('register',{error:"password is not marching.."})
    }


   } catch(error){
    res.status(400).send(error);
    console.log(error);

   }
});
app.get('/newpage',authorization ,(req,res)=>{
 
    res.render('newpage');
});
app.get('/login',(req,res)=>{
  
    res.render('login');
});


app.post('/login',async(req,res)=>{
    try{
        const email=req.body.email;
        const password=req.body.password;
      const useremail= await userdata.findOne({email})
    
 const passwordmatch=await bcrypt.compare(password,useremail.password);
 let token= await useremail.tokencreate();
 
 res.cookie("usertoken",token,{
    expires:new Date(Date.now()+24 * 60 * 60 * 1000),
    httpOnly:true
});
 
console.log( passwordmatch);
       if(passwordmatch) { 
        res.status(201).render("home");
      }
      else{

        // res.send("password is not matching..");
        return res.render('login',{error:"Invalid email or password"})
      }

    }
    catch(err){
        res.status(401).send(err);
        console.log(err);
    }
})
app.use(authorization); 
app.get('/profile', authorization, (req, res) => {
    const user = req.user; // Get the user object from the request
    res.render('profile', { user });
  });
  
app.get('/logout', authorization, async (req, res) => {
    try {
      res.clearCookie('usertoken'); // Clear the 'usertoken' cookie
      // Additional logout logic if needed
      res.render('login'); // Render the login page after logout
    } catch (err) {
      res.status(500).send(err);
    }
  });
  


app.get('*',(req,res)=>{
    res.render('error');
})






//for image uploading in the profile page
// Assuming you have a User model defined





app.post('/upload', upload.single('image'), (req, res) => {
  const file = req.file;
  const imagePath = `/uploads/${file.filename}`;

  // Update the user's profile data in your database
  const userId = req.user._id; // Assuming you have the user object available in req.user
  userdata.findOneAndUpdate({ _id: userId }, { $set: { imagePath: imagePath } }, { new: true })
    .then(updatedUser => {
      if (updatedUser) {
        res.status(200).render('profile');
      } else {
        res.status(404).send('User not found');
      }
    })
    .catch(err => {
      console.error('Error updating user image:', err);
      res.status(500).send('Error updating user image');
    });
});



  
    









app.listen(6555,()=>{
    console.log("server is running..");
});