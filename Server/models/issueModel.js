const {Schema, model}= require("mongoose")

const issueSchema=new Schema({
    title: {type: String, required: true},
    description: {type: String, required: true},
    image: {type: String, required:true},
    location: {type: {type: String, enum: ["Point"], default: "Point"}, coordinates: [Number]},
    category: {type: String, enum: ["sanitation", "road", "lighting", "water", "safety", "other"], default: "other"},
    isUrgent: {type: Boolean, default:false}, 
    status: {type: String, enum:["rejected","pending", "in-progress", "resolved"], default:"pending"},
    upvotes: [{type: Schema.Types.ObjectId, ref: "User"}],
    comments: [{type: Schema.Types.ObjectId, ref: "Comment"}],
    officialResponse: [{type: Schema.Types.ObjectId, ref: "OfficialResponse"}]
},{timestamps: true})

module.exports=model('Issue', issueSchema);