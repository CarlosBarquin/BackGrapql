
import { ObjectId } from "mongo";
import { Car, User } from "../types.ts";
import { UsersCollection, carsCollection } from "../db/dbconnection.ts";
import { CarSchema, UserSchema } from "../db/schema.ts";
import { calculateObjectSize } from "https://deno.land/x/web_bson@v0.2.5/mod.ts";
import { verifyJWT } from "../libs/jwt.ts";


const CarResolver = {
    id : (parent : CarSchema | Car) =>{
         const p = parent as CarSchema
         return p._id.toString()

    },
    driver : async (parent : CarSchema | Car)   =>{
        const p = parent as CarSchema
        const user = await UsersCollection.findOne({_id : p.driver})
        if(!user){
            throw new Error("no hay conductor")
        }
        return user
    }
}

export default CarResolver