import mongoose,{Connection} from 'mongoose'
// declare on the global namespace 
declare global {   
      var mongoose: {
        connection: Connection | null;
        promise: Promise<Connection> | null;
        }
  }
// Cache the  connections to avoid maxing my Concurrent limit.
const connectionUrl = process.env.MONGO_URL;
let cached = global.mongoose;
if(!cached){
    global.mongoose = {connection:null, promise: null};
    cached = global.mongoose
}
const connectDb: () => Promise<mongoose.Connection | undefined> = async () => 
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
           cached.promise   =  await mongoose.connect(connectionUrl,{bufferCommands: false}) as unknown as  Promise<Connection>;
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