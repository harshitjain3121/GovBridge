const {Schema, model}=require("mongoose")

const commentSchema= new Schema({
    creator: {type: Schema.Types.ObjectId, ref: "User", required: true},
    issue: {type: Schema.Types.ObjectId, ref: "Issue", required: true}, 
    comment: {type: String, required: true}
}, {timestamps: true})

module.exports=model("Comment", commentSchema);