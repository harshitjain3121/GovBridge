const {Schema, model}= require("mongoose");

const userSchema=new Schema({
    name: {type: String, required: true},
    email: {type: String, required: true},
    phone: {type: String, required: true},
    password: {type: String, required: true},
    role: {type: String, enum: ["citizen", "government"], default: "citizen"}
},{timestamps: true})

module.exports=model("User", userSchema);