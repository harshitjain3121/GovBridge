const {Schema, model}= require("mongoose");

const userSchema=new Schema({
    name: {type: String, required: true},
    email: {type: String, required: true},
    phone: {type: String, required: true},
    password: {type: String, required: true},
    role: {type: String, enum: ["citizen", "government"], default: "citizen"},
    notifications: [{
        type: {
            type: String,
            enum: ["STATUS_UPDATE", "OFFICIAL_RESPONSE", "ISSUE_CLOSED"],
            required: true
        },
        message: { type: String, required: true },
        isRead: { type: Boolean, default: false },
        issue: {type: Schema.Types.ObjectId, ref: "Issue", required: true},
        createdAt: { type: Date, default: Date.now }
    }]
},{timestamps: true})

userSchema.index({ 'notifications.createdAt': -1 });

module.exports=model("User", userSchema);