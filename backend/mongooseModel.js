import mongoose from "mongoose";
import { string } from "zod";

const userSchema = new mongoose.Schema
({
    name : String,
    email : String,
    role : { type: String, default: 'user' },
    password : { type: String, default: null }
})

export const userModel = mongoose.model('Users',userSchema)

const music={
    musicId : String,
    addedBy : String,
    addedAt : Date,
    lastModifiedAt : Date,
    title : String,
    thumbnail : String,
    score : Number,//upvotes-downvotes
}

const spaceSchema = new mongoose.Schema
({
    name : String,
    createdBy : String,
    currentlyPlaying : String,
    musicQueue : [music],
})

export const spaceModel = mongoose.model('Spaces',spaceSchema)

