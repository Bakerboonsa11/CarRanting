require('dotenv').config({ path: './config.env' }); // Ensure correct .env file is loaded

process.on('uncaughtException',(err)=>{
      console.log('uncauth error is',err.name,err.message)
     process.exit(1)
})
const mongoose = require('mongoose');
const App = require('./App');

// Port from .env or fallback to 3000
const port = process.env.PORT || 8000;



// Validate environment variables
// if (!process.env.DATABASEPASSWORDSTRING || !process.env.DATABASEPASSWORDSTRING) {
//   throw new Error('Missing DATABASESTRING or DATABASEPASSWORD in .env file');
// }


// const DB = process.env.DATABASESTRING.replace(
//   '<PASSWORD>',
//   process.env.DATABASEPASSWORD
// );

const DB=process.env.LASTDATABASE


// Connect to MongoDB
mongoose
  .connect(DB,{
  })
  .then(() => console.log('Database connected successfully'))
  .catch((err) => console.error('Database connection failed:', err.message));

// Start the server
App.listen(port, () => {
  console.log(`Server is running at port ${port}`);
});
  


process.on('unhandledRejection',(err)=>{
      console.log(err.name,err.message)
      server.close(()=>{
        process.exit(1)
      })
})