const  mongoose=require("mongoose");
mongoose.connect("mongodb+srv://srinu:saitarra@cluster0.1lguwvd.mongodb.net/?retryWrites=true&w=majority",{
    useNewUrlParser: true,useUnifiedTopology: true,

}).then(()=>{
    console.log("mongodb is connected");
}).catch(()=>{
    console.log("not connected");
});
