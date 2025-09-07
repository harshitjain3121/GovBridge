const HttpError=require('../models/errorModel')
const UserModel=require('../models/userModel')

const bcrypt=require('bcryptjs')
const jwt=require('jsonwebtoken')



const registerUser= async(req,res,next)=>{
    try {
        const {name, email, phone, password, confirmPassword}=req.body;
        if(!name || !email || !phone || !password || !confirmPassword){
            return next(new HttpError("Fill all details", 422));
        }
        const lowerCaseEmail=email.toLowerCase();
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(lowerCaseEmail)) {
            return next(new HttpError("Enter a valid email address", 422));
        }
        const emailExists=await UserModel.findOne({email: lowerCaseEmail})
        if(emailExists){
            return next(new HttpError("Email already exists", 422))
        }
        const phoneRegex=/^\d{10}$/;
        if(!phoneRegex.test(phone)){
            return next(new HttpError("Phone number must be exactly 10 digits", 422));
        }
        const phoneExist=await UserModel.findOne({phone: phone});
        if(phoneExist){
            return next(new HttpError("Phone number already exists", 422));
        }
        if(password != confirmPassword){
            return next(new HttpError("Password do not match",422))
        }
        if(password.length<6){
            return next(new HttpError("Password should be at least 6 characters", 422));
        }
        const salt=await bcrypt.genSalt(10);
        const hashPassword=await bcrypt.hash(password,salt);
        const newUser=await UserModel.create({name, email: lowerCaseEmail, phone, password: hashPassword})
        res.json(newUser).status(201);
    } catch (error) {
        return next(new HttpError(error))
    }
}



const loginUser= async(req,res,next)=>{
    try {
        const {identifier, password}=req.body;
        if(!identifier || !password){
            return next(new HttpError("Identifier and password are required", 422))
        }
        const isEmail=/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(identifier);
        const isPhone=/^\d{10}$/.test(identifier);
        let user;
        if(isEmail){
            user=await UserModel.findOne({email: identifier.toLowerCase()})
        }
        else if(isPhone){
            user=await UserModel.findOne({phone: identifier})
        }
        else{
            return next(new HttpError("Enter a valid email or 10-digit phone number",422));
        }
        if(!user){
            return next(new HttpError("Invalid Credential",422));
        }
        const comparePassword=await bcrypt.compare(password, user?.password);
        if(!comparePassword){
            return next(new HttpError("Invalid Credential",422))
        }
        const token= await jwt.sign({id: user?._id},process.env.JWT_SECRET, {expiresIn: "1d"});
        res.json({token, id:user?._id}).status(200);
    } catch (error) {
        return next(new HttpError(error))
    }
}



const getUser= async(req,res,next)=>{
    try {
        const {id}=req.params;
        const user=await UserModel.findById(id).select("-password");
        if(!user){
            return next(new HttpError("User not found", 404));
        }
        res.json({user}).status(200);
    } catch (error) {
        return next(new HttpError(error))
    }
}


module.exports={registerUser, loginUser, getUser};