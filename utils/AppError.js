class AppError extends  Error{

    constructor(message,statusCode){
         super(message)
         this.statusCode=this.status
         this.message=this.message
         this.status=`${statusCode}`.startsWith('4')?"fail":"error"
         this.isOperational=true
         Error.captureStackTrace(this)
    }
}

module.exports=AppError