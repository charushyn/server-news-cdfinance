import mongoose, {Schema} from "mongoose"

const User = new Schema({
    name: String,
    email: String,
    password: String,
}, {collection: 'user-data'})

const model = mongoose.model('UserData', User)

export default model;