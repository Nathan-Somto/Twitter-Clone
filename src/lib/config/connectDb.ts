import mongoose from 'mongoose'
let connected = false;
const connectionUrl = process.env.MONGO_URL;

const connectDb = async () => 
{
    console.log('in connect db')
    console.log(connectionUrl)
    try{
        if(!connectionUrl){
            throw new Error('no provided connection url')
        }
        if(!connected){
            await mongoose.connect(connectionUrl)
            connected = true;
            console.log("Successfully connected to mongo db.")
        }
    }
    catch(err){
        connected = false;
        if(err instanceof Error){
            console.error(err.message)
        }
    }
}
export default connectDb;