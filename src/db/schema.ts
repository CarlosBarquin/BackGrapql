import { ObjectId } from "https://deno.land/x/web_bson@v0.2.5/mod.ts";
import { Car, User } from "../types.ts";

export type CarSchema = Omit<Car, "id" | "driver"> & {
  _id : ObjectId
  driver : ObjectId
}


export type UserSchema = Omit<User, "id" | "token" | "cars"> & {
  _id: ObjectId;
};