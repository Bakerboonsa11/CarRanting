const express=require('express');

const App =express()

App.get('/',(req,res)=>{
  res.status(200).json({
    meassage:"app is avaliable"
  })
})

const port =3000

App.listen(port,()=>{
    console.log(`server is running at port ${port}`)
}
)




