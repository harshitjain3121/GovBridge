const HttpError=require('../models/errorModel')
const IssueModel=require('../models/issueModel')
const OfficialResponse = require("../models/officialResponseModel");

const {v4: uuid}=require("uuid")
const cloudinary=require('../utils/cloudinary')
const fs=require('fs')
const path=require('path')


const createIssue= async(req,res,next)=>{
    try {
        const { title, description, category, isUrgent, coordinates } = req.body;
        if (!title || !description || !coordinates) {
            return next(new HttpError("Please provide all required fields", 422));
        }
        if (!description || description.trim() === "") {
            return next(new HttpError("Description cannot be empty", 422));
        }

        // Parse coordinates if it's a string
        let parsedCoordinates = coordinates;
        if (typeof coordinates === 'string') {
            try {
                parsedCoordinates = JSON.parse(coordinates);
            } catch (error) {
                return next(new HttpError("Invalid coordinates format", 422));
            }
        }

        if (!Array.isArray(parsedCoordinates) || parsedCoordinates.length !== 2) {
            return next(new HttpError("Coordinates must be an array [longitude, latitude]", 422));
        }
        
        if (!req.files || !req.files.image) {
            return next(new HttpError("Image file is required", 422));
        }
        
        let imageUrl = "";

        if (req.files && req.files.image) {
            const { image } = req.files;

            if (image.size > 500000) {
                return next(new HttpError("Image is too big. Should be less than 500KB", 422));
            }

            const ext = path.extname(image.name);
            const filename = `${uuid()}${ext}`;
            const uploadPath = path.join(__dirname, "..", "uploads", filename);

            await image.mv(uploadPath);

            const result = await cloudinary.uploader.upload(uploadPath, {
                resource_type: "image",
                folder: "posts",
            });

            fs.unlink(uploadPath, (err) => {
                if (err) console.error("Failed to delete local post image:", err.message);
            });

            if (!result.secure_url) {
                return next(new HttpError("Failed to upload image to Cloudinary", 422));
            }

            imageUrl = result.secure_url;
        }
        const newIssue = await IssueModel.create({title,description,image: imageUrl || undefined,category,isUrgent,location: {type: "Point",coordinates: parsedCoordinates},upvotes: [],comments: [],officialResponse: []});
        res.status(201).json(newIssue);
    } catch (error) {
        return next(new HttpError(error))
    }
}

const getIssues= async(req,res,next)=>{
    try {
        const issues = await IssueModel.find().populate("upvotes", "name email").populate("comments").populate("officialResponse");
        res.status(200).json(issues);
    } catch (error) {
        return next(new HttpError(error))
    }
}

const getIssue= async(req,res,next)=>{
    try {
        const { id } = req.params;
        if (!id.match(/^[0-9a-fA-F]{24}$/)) {
            return next(new HttpError("Invalid issue ID format", 400));
        }
        const issue = await IssueModel.findById(id)
            .populate("upvotes", "name email role")
            .populate({
                path: "comments",
                populate: { path: "creator", select: "name email" }
            })
            .populate({
                path: "officialResponse",
                populate: { path: "responseBy", select: "name role email" }
            });

        if (!issue) {
            return next(new HttpError("Issue not found", 404));
        }

        res.status(200).json(issue);
    } catch (error) {
        return next(new HttpError(error))
    }
}

const deleteIssue= async(req,res,next)=>{
    try {
        const { id } = req.params;
        if (!id.match(/^[0-9a-fA-F]{24}$/)) {
            return next(new HttpError("Invalid issue ID format", 400));
        }
        const issue = await IssueModel.findById(id);
        if (!issue) {
            return next(new HttpError("Issue not found", 404));
        }
        const CommentModel = require('../models/commentModel');
        const OfficialResponseModel = require('../models/officialResponseModel');
        await CommentModel.deleteMany({ issue: id });
        await OfficialResponseModel.deleteMany({ issue: id });
        await IssueModel.findByIdAndDelete(id);
        res.status(200).json({ message: "Issue and related data deleted successfully" });
    } catch (error) {
        return next(new HttpError(error))
    }
}

const upvoteIssue= async(req,res,next)=>{
    try {
        const { id } = req.params;
        if (!id.match(/^[0-9a-fA-F]{24}$/)) {
            return next(new HttpError("Invalid issue ID format", 400));
        }
        const issue = await IssueModel.findById(id);
        if (!issue) {
            return next(new HttpError("Issue not found", 404));
        }
        const userId = req.user.id;
        const hasUpvoted = issue.upvotes.includes(userId);
        if (hasUpvoted) {
            issue.upvotes.pull(userId);
        } else {
            issue.upvotes.push(userId);
        }
        await issue.save();
        res.status(200).json({
            message: hasUpvoted ? "Upvote removed" : "Upvoted successfully",
            upvotesCount: issue.upvotes.length,
            issue,
        });
    } catch (error) {
        return next(new HttpError(error))
    }
}

const getUpvotedIssues= async(req,res,next)=>{
    try {
        const userId = req.user.id;
        const issues = await IssueModel.find({ upvotes: userId })
            .populate("comments")
            .populate("officialResponse");
        res.status(200).json({count: issues.length,issues});
    } catch (error) {
        return next(new HttpError(error))
    }
}




module.exports={createIssue, getIssues, getIssue, deleteIssue, upvoteIssue, getUpvotedIssues};