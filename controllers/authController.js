const User = require('./../models/userModel')
const AppFeatures=require("./../utils/AppFeatures")
// const AppError=require("./../utils/AppError")
const AppError=require("./../utils/AppError")
const catchAsync=require("./../utils/asyncError")
const jwt=require("jsonwebtoken")
const sendEmail=require("./../utils/sendEmail")
const crypto=require("crypto")


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
  if(!token){
    return next(new AppError("plesase log in first",400))
  }
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
   next()
})

exports.ForgetPassword=catchAsync(async(req,res,next)=>{

  console.log("forgetpage")
  const email=req.body.email
  console.log(email)
  if(!email) next(new AppError("please provide email",400))

  const user=await User.findOne({email})
  
  if(!user) next(new AppError("there is no user with this email",400))
 
  // create new reset token
  const resetPassword=user.createResetPassword()
  const URL =`${req.protocol}://${req.get("host")}/api/v1/user/ForgetPassword/${resetPassword}`
  const message=`if you forget password please click ${URL}`;

  await user.save({validateBeforeSave:false})
  // send email

 try{
      await sendEmail({
      email:user.email,
      subject:"the token will expire in a 10 min",
      message
     })

     res.status(200).json({
      status:"sucess",
      message :"email sent"
     })
     }catch(error){
          user.resetPassword=undefined;
          user.expireResetPassword=undefined;

        await  user.save({validateBeforeSave:false})

        return next(new AppError("isuue with sending email please try leter",500))
     }
   
})


exports.restPassword=catchAsync(async(req,res,next)=>{
    
//  first take the reset token frim the request and 
  const reset_token = req.params.reset_password;
  if(!reset_token) { return next(new AppError("altering the link is forbidden please try again"))}

  const hashedResetToken=  this.resetPassword=crypto.createHash("sha256").update(reset_token).digest("hex")
  console.log(hashedResetToken)
   const user =await User.findOne({
    resetPassword:hashedResetToken,
    // expireResetPassword:{$gt:Date.now()}
    expireResetPassword: { $gt: Date.now() }

   })

    if(!user){
      return next(new AppError(" invalid token on some issue you are already logdin in"),500)
    }

   console.log(user)


  user.password=req.body.password
  user.confirmPassword= req.body.confirmPassword
  user.resetPassword=undefined
  user.expireResetPassword=undefined
  await user.save()

  console.log(user)
//  check wether the reset password is expired or not 

// r update the value

//  create a new token for the user
//  remove the uneccesry informations
// 
 const token=createToken(user,res)
 
})

exports.updatePassword=catchAsync(async(req,res,next)=>{
     
})