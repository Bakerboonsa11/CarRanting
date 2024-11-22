const User = require('./../models/userModel')
const AppFeatures=require("./../utils/AppFeatures")
// const AppError=require("./../utils/AppError")
const AppError=require("./../utils/AppError")
const catchAsync=require("./../utils/asyncError")
const jwt=require("jsonwebtoken")

signtoken=(id)=>{
return jwt.sign({id},process.env.SEC_WORD,{expiresIn:process.env.EXPIRE_TIME})
}

createToken=(user,res)=>{
   const cookiesOptions={
    expires:new Date(Date.now()+process.env.COOKIES_EXPIRE)*24*60*60*1000
     ,
   httpOnly:true
   }
  
 if(process.env.NODE_ENV==="production") cookiesOptions.secure=true
  const token =signtoken(user.id)

  res.cookie("jwt",token, {
            httpOnly: true,         // Prevents JavaScript access to the cookie
            secure: process.env.NODE_ENV === 'production', // Sends only over HTTPS in production
            maxAge: 24 * 60 * 60 * 1000 // Cookie expiration time in milliseconds (1 day)
        })

  res.status(200).json({
    status:"succees",
    token
  })
}


exports.signUp=catchAsync(async(req,res,next)=>{
      const user=await User.create(
    
      {  name: req.body.name,
        email: req.body.email,
        photo: req.body.photo,
        password: req.body.password,
        confirmPassword:req.body.confirmPassword,
      }

      )

   
  createToken(user,res)

})

exports.signIn=catchAsync(async(req,res,next)=>{
   const {email,password}=req.body
   console.log(email,password)
  if(!email||!password) {
    return next(new AppError("please provide the email or password",400))
  }
 const user=await User.findOne({email})
  console.log(user)
 if(!user || !await user.correctPassword(password,user.password)){
     return next(new AppError("incorrct password or email",400))
 }

 createToken(user,res)

})

exports.IsLOggedIn=catchAsync(async(req,res,next)=>{
  // fist take the token from the requesat for both the cookies and the API test
  console.log("entered")
  let token;
  
  if(req.headers.authorization && req.headers.authorization.startsWith("Bearer") ){
    token=req.headers.authorization
  }
  else if(req.cookie && req.cookie.jwt){
    token =req.cookie.jwt
  }
  console.log(token)

  const decoded=jwt.verify(token.split(" ")[1],process.env.SEC_WORD)
  const user = await User.findById(decoded.id)
  if(!user){
    return next(new AppError("you are not logged in please login first",400))
  }
  console.log(user.ispasswordUpdated(decoded.iat))
  if(user.ispasswordUpdated(decoded.iat)){
    return next(new AppError("you changed password please login again",404))
  }
  console.log(decoded.id)
  
  req.user=user;
   res.status(200).json({
    status:"success",
    user:req.user
   })
})

