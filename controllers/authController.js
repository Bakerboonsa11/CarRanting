const User = require('./../models/userModel')
const AppFeatures=require("./../utils/AppFeatures")
// const AppError=require("./../utils/AppError")
const AppError=require("./../utils/AppError")
const catchAsync=require("./../utils/asyncError")
const jwt=require("jsonwebtoken")
const sendEmail=require("./../utils/sendEmail")
const crypto=require("crypto")
const {promisify}=require('util')
const Email= require("../utils/sendEmail.js")

signtoken=(id)=>{
return jwt.sign({id},process.env.SEC_WORD,{expiresIn:process.env.EXPIRE_TIME})
}

createToken = (user, res) => {
  const token = signtoken(user.id);

 
res.cookie('jwt', token, {
  httpOnly: true,
  sameSite: 'None', // Allow cross-site requests
  secure: process.env.NODE_ENV === 'production'?true:false,
  maxAge: 24 * 60 * 60 * 1000 // Cookie expiration (1 day)
});



  res.status(200).json({
    status: "success",
    token,
    user
  });
};



exports.signUp=catchAsync(async(req,res,next)=>{
  console.log(req.body)
      const user=await User.create(
     
      {  name: req.body.name,
        email: req.body.email,
        photo: req.body.photo,
        password: req.body.password,
        confirmPassword:req.body.confirmPassword,
      }

      )

   const emailObject= await new Email(user,`${req.protocol}://${req.get('host')}/api/v1/car`).sendWellCome()
      
      console.log(emailObject)
  createToken(user,res)

})

exports.signIn=catchAsync(async(req,res,next)=>{
   const {email,password}=req.body
  
  if(!email||!password) {
    return next(new AppError("please provide the email or password",400))
  }
 const user=await User.findOne({email}).select("+password")

 if(!user || !await user.correctPassword(password,user.password)){
     return next(new AppError("incorrct password or email",400))
 }
  console.log(user, "is UserActivation")

 createToken(user,res)

})
exports.logOut=catchAsync(async(req,res,nex)=>{
console.log('Cookie:', req.cookies.jwt);

  res.cookie("jwt","removed",{
    httpOnly:true,
    expires:new Date(Date.now()+10*1000),
    sameSite:none
    
  })
 
  res.status(200).json({
    status:"success"
  })
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
    //   await sendEmail({
    //   email:user.email,
    //   subject:"the token will expire in a 10 min",
    //   message
    //  })
    
    await new Email(user,URL).sendPasswordReset()

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
    //  first get loged in user from the request
   
    
    const user=await User.findById(req.user.id).select("+password");
    if(!user){
      return next(new AppError("please log in first",400))
    }
     console.log(user,"update user")
     
     console.log(await user.correctPassword(req.body.password,user.password))
    if(! await user.correctPassword(req.body.password,user.password)){
      return next(new AppError("incorrect password",400))
    }
  
    user.password=req.body.currentPassword
    user.confirmPassword=req.body.confirmPassword
    user.changedPasswordAt=Date.now()
    await user.save()
    createToken(user,res)
    // find the user by the id 
    // change the password within data in the body
    // assign the date.now for the user 

})

exports.protect= catchAsync(async(req,res,next)=>{
   let token;
   // check if the header exist and start with bearer
 
   console.log('protect is wrunnung')
   console.log(req.headers.cookie)
   console.log(req.cookies.jwt)
if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
  token = req.headers.authorization.split(' ')[1];
  console.log("cookie is from header")
}
else if(req.cookies.jwt){
  console.log("jwt is from cookie")
   token=req.cookies.jwt
}

if (!token || token === 'null') {

  return next(new AppError('You are not logged in! Please log in to get access.', 401));
}
 
    console.log("the token is ",token)
   // verify the token 
   const decoded= await promisify(jwt.verify)(token,process.env.SEC_WORD)
   console.log(decoded)
   // check weather a user is still exist 
   const freshUser= await User.findById(decoded.id)
   console.log("the fresh user is ",freshUser)
   if(!freshUser){
      return next(new AppError("the user blonging to this token does not exist"),401)
   }
   console.log(decoded.iat)
   if(freshUser.ispasswordUpdated(decoded.iat)){
       return next(new AppError("user changed a password pleaselogin again"),401)
    };

    req.user=freshUser
   
   next()
});
exports.isLogedIn= async (req,res,next)=>{
      //  first check if there is cookies in the browser
      if(req.cookies.jwt ||req.headers.authorization.startsWith('Bearer') ){
         // if cookies exist verify weather it is correct 
         const decoded= await promisify(jwt.verify)(req.cookies.jwt,process.env.SEC_WORD)
      
         const user= await User.findById(decoded.id)
 
       if(!user){
         return next()
       }

       if(user.passwordChanged(decoded.iat)){
           return next()
       }
      
      res.locals.user=user
       return next()

      }
      next()
}

exports.strictTo = (...roles) => {
    console.log('Entered restrict middleware');
    return (req, res, next) => {
        console.log('User in strictTo:', req.user);
        if (!req.user || !roles.includes(req.user.roles)) {
            return next(new AppError('You do not have permission to perform this action', 403));
        }
        next();
    };
};


{{{{{{{{{}