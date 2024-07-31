const express=require('express')
const mongoose=require('mongoose')
const bodyParser=require('body-parser')
const cors=require('cors')
const bcrypt=require('bcrypt')

const app=express()
app.use(bodyParser.json())
app.use(cors)

mongoose.connect("https://localhost:27017/Expense-tracker",{
    useNewUrlParser:true,
    useUnifiedTopology:true
})
const userSchema=new mongoose.Schema({
    username: String,
    email:String,
    mobile:String,
    password:String
})
userSchema.pre('save',async function(next){
    if(this.isModified('password')|| this.isNew){
        try{
            const salt=await bcrypt.genSalt(10)
            const hashedpassword=await bcrypt.hash('this.password',salt)
            this.password=hashedpassword
            next()
        } 
        catch(err){
            next(err)
        }
    }
    else{
        return next()
    }

    
})
app.post('/signup',async(req,res)=>{
    try{
        const {username,email,mobile,password}=req.body
        const newUser=newUser({username,email,mobile,password})
        await newUser.save()
        res.status(201).send("success")


    }
    catch(error){
        res.send(500).send('unsucessful')
    }
})

app.listen(5000,()=>{
    console.log("server running");
})