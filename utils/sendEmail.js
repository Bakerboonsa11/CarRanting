const nodemailer = require("nodemailer");
const pug =require('pug')
const htmlToText=require('html-to-text')
// // before everything we have setup a transporter a service that provide an email
// const sendEmail=async (options)=>{
// //     CREATE TRANSPORTER THAT TRANSPORT THE EMAIL FROM OUR APPLICATION TO THE EMAIL SERVICE PROVIDER
//     const transporter = nodemailer.createTransport({
//       host:process.env.EMAILHOST,
//      port:process.env.EMAILPORT,
    
//      auth:{
//         user:process.env.EMAIL_USER,
//         pass:process.env.EMAILPASSWORD
//      }

// })
// //  DEFINE THE OPTIONS THAT IS SEND TO THE EMAIL 

// const option={
//     from:'bonsa baker <bakerbonsa@gmail.com>',
//     to:options.email,
//     subjec:options.subjec,
//     text:options.message
// }
// // SEND THE EMAIL TO THE SERVICE PROVIDER  
// await transporter.sendMail(option)
// }

// module.exports=sendEmail


//  MORE PROFETIONAL OPTION 

module.exports=class Email {

 constructor(user,url){
    this.to=user.email
    this.from=process.env.FROM_EMAIL
    this.url=url
    this.firstName=user.name.split(' ')[0]
 }
  newTransporter() {
   //  if(process.env.NODENV==="production"){
   //      return 0
   //  }


    return nodemailer.createTransport({
            host: process.env.EMAILHOST,
            port: process.env.EMAILPORT,
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAILPASSWORD,
            },
        });
    }

 async send(templete,subject){
    // what this method do 

    // 1  create html from the templete rather than rendering it 
     const html=pug.renderFile(`${__dirname}/../views/${templete}.pug`,{
        subject,
        url:this.url,
        firstName:this.firstName
     })
    // 2 define the option 
    const mailOptions={
       to:this.to,
       from:this.from,
       subject,
       html,
       text: htmlToText.convert(html)


    }
    // send the email to the transport
   await this.newTransporter().sendMail(mailOptions)
 }

 async sendWellCome(){
    await this.send('welcomeEmail',"well come to our car ranting and other services provider site ")
 }
 async sendPasswordReset(){
    await this.send('resetPassword','reset password its valid only for 10 min ??$')
 }

}
