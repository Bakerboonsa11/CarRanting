const AppError = require("../utils/AppError")

const errorController=(error,req,res,next)=>{
     
      error.statusCode=error.statusCode||500
      error.status=error.status||"error"

const CastError=(error)=>{
    const message=`invalid${error.path} "" ${error.value}`
    return new AppError(message,400)
}
const ValidationError = (error) => {
  // console.log(error)
   if (!error.errors) {
      // console.error("The error object doesn't contain 'errors'");
      return new AppError("An unexpected validation error occurred", 400);
   }

   const errors = Object.values(error.errors).map((el) => el.message);
   const message = `Invalid input data: ${errors.join('. ')}`;
   return new AppError(message, 400);
};


const handledePlicateErrorDB=(error)=>{

  if(error.keyValue && typeof error.keyValue==="object"){
  
    const value =Object.values(error.keyValue)[0]
    const message=`a diplicated value is '${value}' please use onother value`

    return new AppError(message,400);
  }

  else{
    const message =`unknown deplicate key value please try again `
    return new AppError(message,400);
  }
}

const sendProductionError=(error)=>{
 
     res.status(error.statusCode).json({
        status:error.status,
        error:error.message
     })
}
const sendDevelopmentError=(error)=>{
   
    if(error.isOperational){
       
         res.status(error.statusCode).json({
            status:error.status,
            message:error.message,
            error:error
         })
    }
    else{
        res.status(500).json({
        error:"something wents very wrong"
        })
    }
   
}

const handleJwtError=(error)=>new AppError("invalid token please login again",401)
const hadleJwtexpired=()=> new AppError('the token is expired please log in again',401)

if(process.env.NODENV==="production"){


  sendProductionError(error)
}

else if (process.env.NODENV==="development"){
   console.log("error is ",error)
  if(error.name==="CastError") error=CastError(error)
  if(error.code===11000) error=handledePlicateErrorDB(error)
  if(error.name==="ValidationError") error=ValidationError(error)
  if(error.name==='JsonWebTokenError') error=handleJwtError(error)
  if(error.name==="TokenExpiredError") error=hadleJwtexpired(error)
  sendDevelopmentError(error)
 }
}

module.exports=errorController




//  if(error.code===11000) error=handledePlicateErrorDB(error) 
//       if(error.name==="ValidationError")  error=handleValidationErrorDB(error) 
//       if(error.name==='JsonWebTokenError') error=handleJwtError(error)
//       if(error.name==="TokenExpiredError") error=hadleJwtexpired(error)