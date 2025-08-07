import mongoose from "mongoose";

const MONGODB_URI=process.env.MONGODB_URI;

if(!MONGODB_URI){
    throw new  Error("Please define the MONGODB_URL in .env.local");
}


interface MongooseCache{
    con:typeof mongoose|null;
    promise:Promise<typeof mongoose>|null;
}

declare global{
    var mongooseCache:MongooseCache|undefined;
}
const globalForMongoose=globalThis as typeof globalThis &{ //global this store and acces value
    mongooseCache:MongooseCache
};
const cached:MongooseCache=globalForMongoose.mongooseCache ??{
    con:null,
    promise:null,
};
globalForMongoose.mongooseCache=cached;


export async function connectToDatabase(): Promise<typeof mongoose> {
    if(cached.con)return cached.con
    if(!cached.promise){
        cached.promise=mongoose.connect(MONGODB_URI!,{
            bufferCommands:false,
        });
    }
    cached.con=await cached.promise;
    return cached.con;
}
export const mongooseCache = cached;


