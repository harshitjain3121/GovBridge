const {Schema, model} = require("mongoose")

const officialResponseSchema= new Schema({
    issue: {type: Schema.Types.ObjectId, ref: "Issue", required: true},
    responseBy: {type: Schema.Types.ObjectId, ref: "User", required: true},
    statusUpdate: {type: String, enum: ["pending", "in-progress", "resolved"], required: false},
    response: {type: String, required: true}
}, {timestamps: true})

module.exports=model('OfficialResponse', officialResponseSchema)