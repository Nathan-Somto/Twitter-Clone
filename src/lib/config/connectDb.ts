import mongoose from 'mongoose'

const connectionUrl = process.env.MONGO_URL;
let cached = global.mongoose;
if(!cached){
    global.mongoose = {connection:null, promise: null};
    cached = global.mongoose
}
const connectDb = async () => 
{
    console.log('in connect db')
    try{
        if(!connectionUrl){
            throw new Error('no provided connection url')
        }
        if(cached.connection){
            console.log("Cached mongodb")
            return cached.connection;
        }
        if(!cached.promise){
           cached.promise = await mongoose.connect(connectionUrl,{bufferCommands: false})
           console.log("Successfully connected to mongo db.")
        }
        cached.connection = await cached.promise;
    }
    catch(err){
        if(err instanceof Error){
            console.error(err.message)
        }
    }
}
export default connectDb;