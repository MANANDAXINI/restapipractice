const mongoose = require("moongose")

async function connectmongodb(url){
    
   return  mongoose.connect(url)

}


module.exports={
    connectmongodb
}