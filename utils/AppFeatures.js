class AppFeatures{

    constructor(databaseQuery,queryString){
            this.databaseQuery=databaseQuery
            this.queryString=queryString
    }

   filter(){
    const queryObject={...this.queryString};
    const ExcludeObject=["page","limit","sort","field"]

    ExcludeObject.forEach((el)=>{
        delete queryObject[el]
    })
    let queryString=JSON.stringify(queryObject)
    queryString=queryString.replace(/\b(gte|gt|lte|lt)\b/g,match=>`$${match}`)
    this.databaseQuery.find(JSON.parse(queryString))
    return this
   }

  sort(){
    if(!this.queryString.sort){
    //   sort by name or do onother general idea
    }


  }
}


module.exports=AppFeatures