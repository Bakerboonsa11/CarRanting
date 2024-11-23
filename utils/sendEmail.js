const nodemailer = require("nodemailer");


// before everything we have setup a transporter a service that provide an email
const sendEmail=async (options)=>{
   
    const transporter = nodemailer.createTransport({
      host:process.env.EMAILHOST,
     port:process.env.ENAILPORT,
    
     auth:{
        user:process.env.EMAIL_USER,
        pass:process.env.EMAILPASSWORD
     }

})

const option={
    from:'bonsa baker <bakerbonsa@gmail.com>',
    to:options.email,
    subjec:options.subjec,
    text:options.message
}
await transporter.sendMail(option)
}

module.exports=sendEmail
