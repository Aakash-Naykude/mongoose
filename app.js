const express = require("express")
const mongoose = require("mongoose")
const users = require("./MOCK_DATA.json")



const connect = ()=>{
    return mongoose.connect("mongodb://127.0.0.1:27017/test")
}


//user schema start 
//structure tp follow
const userSchema = new mongoose.Schema({
    first_name: {type: String, required:true},
    last_name:{type: String, required : false},
    email:{type: String, required:true, unique:true},
    gender:{type: String, required:true, default:"Male"},
    age:{type: Number, required:true},
}, {
    versionKey:false,
    timestamps:true
})
const User = mongoose.model("test1", userSchema);
//user schema end



//posts schema start 
const postSchema = new mongoose.Schema({
    title : {type:String, required:true},
    body:{type:String, required: true},
    user_id:{
        type: mongoose.Schema.Types.ObjectId,
        required:true,
        ref:"test1"
    },
    tag_id:[
        {
            type: mongoose.Schema.Types.ObjectId,
            ref:"tag",
            required:true
        },
     ]
    },
    {
    versionKey: false,
    timestamps:true
})

const Post = mongoose.model("post", postSchema)
//post schema end


//tag schema start
const tagSchema = new mongoose.Schema({
    name:{type:String, required:true}},
    {
        versionKey: false,
        timestamps:true
});
const Tag = mongoose.model("tag", tagSchema)
//tag schema end


//comment Schema start here 
const commentSchema = new mongoose.Schema({
    body:{type:String, required:true},
    user_id:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"test1",
        required:true
        },
    post_id:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"post",
        required:true
    }
    },{
        versionKey:false,
        timestamps:true
    }
)
const Comment = mongoose.model("comment", commentSchema)
//comment Schema end







const app = express()
app.use(express.json())




//----------------user CRUD start------------------
app.post("/users", async (req,res)=>{
    try{
        const user = await User.create(req.body);
        res.status(201).send(user)
    } catch (e){
        res.status(500).json({status:e.message})
    }
})

app.patch("/users/:id", async(req, res)=>{
    try{  
        const user = await User.findByIdAndUpdate(req.params.id, req.body, {new:true}).lean().exec()
        return res.status(201).send(user)
    } catch(e){
        return res.status(500).json({message:e.message, status:"Failed"})
    }
})

app.get("/users", async (req, res)=>{
    const users = await User.find().lean().exec()
    return res.status(201).send(users)
})
app.get("/users/:email", async (req, res)=>{
    const users = await User.find({}).lean().exec();
    return res.send({users})
})
app.delete("/users/:id", async (req, res)=>{
    try{
        const users = await User.findByIdAndDelete(req.params.id).lean().exec()
         return res.status(201).send(users)
    } catch (e){
        return res.status(500).json({message:e.message, status:"Failed"})
    }
    
});


//----------------------tag CRUD --------------------
app.post("/tag", async (req, res)=>{
    try{
        const user = await Tag.create(req.body)
        res.status(201).send(user)
    } catch(e){
        return res.status(500).json({message:e.message, status:"Failed"})
    }
})
app.get("/tag", async(req, res)=>{
    try{
        const user = await Tag.find().lean().exec()
        res.status(201).send(user)
    } catch(e){
        return res.status(500).json({message:e.message, status:"Failed"})
    }
})
app.get("/tag/:id", async (req, res)=>{
    try{
        const user = await Tag.findById(req.params.id).lean().exec()
        res.status(201).send(user)
    } catch(e){
        return res.status(500).json({message:e.message, status:"Failed"})
    }
})
app.patch("/tag/:id", async (req, res)=>{
    try{
        const user = await Tag.findByIdAndUpdate(req.params.id, req.body, {
            new:true
        }).lean().exec()
        res.status(201).send(user)
    } catch(e){
        return res.status(500).json({message:e.message, status:"Failed"})
    }
})
app.delete("/tag/:id", async (req, res)=>{
    try{
        const user = await Tag.findByIdAndDelete(req.params.id).lean().exec()
        res.status(201).send(user)
    } catch(e){
        return res.status(500).json({message:e.message, status:"Failed"})
    }
})
app.delete("/tag/:id/post", async (req, res)=>{
    try{
        const user = await Tag.findByIdAndDelete(req.params.id).lean().exec()
        const posts = await Post.find({tag_id : user._id}).lean().exec()
        res.status(201).send({posts, user})
    } catch(e){
        return res.status(500).json({message:e.message, status:"Failed"})
    }
})












//----------------post CRUD start------------------
app.post("/post", async (req, res)=>{
    try{
        const user = await Post.create(req.body)
        return res.status(201).send(user)
    } catch(e){
        return res.status(500).json({message:e.message, status:"Failed"})
    }
})

app.get("/post", async(req, res)=>{
    try{
        const user = await Post.find().populate({path:"user_id", select:"first_name"}).lean().exec()
        res.status(201).send(user)
    } catch(e){
        return res.status(500).json({message:e.message, status:"Failed"})
    }
})
app.get("/post/:id", async (req, res)=>{
    try{
        const user = await Post.findById(req.params.id).lean().exec()
        res.status(201).send(user)
    } catch(e){
        return res.status(500).json({message:e.message, status:"Failed"})
    }
})
app.patch("/post/:id", async (req, res)=>{
    try{
        const user = await Post.findByIdAndUpdate(req.params.id, req.body, {
            new:true
        }).lean().exec()
        res.status(201).send(user)
    } catch(e){
        return res.status(500).json({message:e.message, status:"Failed"})
    }
})
app.delete("/post/:id", async (req, res)=>{
    try{
        const user = await Post.findByIdAndDelete(req.params.id).lean().exec()
        res.status(201).send(user)
    } catch(e){
        return res.status(500).json({message:e.message, status:"Failed"})
    }
})



//-------------------------comment CRUD---------------------------
app.post("/comment", async (req, res)=>{
    try{
        const user = await Comment.create(req.body)
        return res.status(201).send(user)
    } catch(e){
        return res.status(500).json({message:e.message, status:"Failed"})
    }
})

app.get("/comment", async(req, res)=>{
    try{
        const user = await Comment.find().lean().exec()
        res.status(201).send(user)
    } catch(e){
        return res.status(500).json({message:e.message, status:"Failed"})
    }
})
app.get("/comment/:id", async (req, res)=>{
    try{
        const user = await Comment.findById(req.params.id).lean().exec()
        res.status(201).send(user)
    } catch(e){
        return res.status(500).json({message:e.message, status:"Failed"})
    }
})
app.patch("/comment/:id", async (req, res)=>{
    try{
        const user = await Comment.findByIdAndUpdate(req.params.id, req.body, {
            new:true
        }).lean().exec()
        res.status(201).send(user)
    } catch(e){
        return res.status(500).json({message:e.message, status:"Failed"})
    }
})
app.delete("/comment/:id", async (req, res)=>{
    try{
        const user = await Comment.findByIdAndDelete(req.params.id).lean().exec()
        res.status(201).send(user)
    } catch(e){
        return res.status(500).json({message:e.message, status:"Failed"})
    }
})











//----------------port session---------------------------
app.listen(2456, async function(){
    await connect()
    console.log("listnign to 2456")
})