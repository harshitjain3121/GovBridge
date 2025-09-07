const HttpError=require('../models/errorModel')
const IssueModel=require('../models/issueModel');
const OfficialResponseModel = require('../models/officialResponseModel');

const createOfficialResponse= async(req,res,next)=>{
    try {
        const { issueId } = req.params;
        const { response, statusUpdate } = req.body;
        if (!issueId.match(/^[0-9a-fA-F]{24}$/)) {
            return next(new HttpError("Invalid issue ID format", 400));
        }
        if (!response || response.trim() === "") {
            return next(new HttpError("Response text cannot be empty", 422));
        }
        const issue = await IssueModel.findById(issueId);
        if (!issue) {
            return next(new HttpError("Issue not found", 404));
        }
        const newResponse = await OfficialResponseModel.create({
            issue: issueId,
            responseBy: req.user.id,
            response,
            statusUpdate
        });
        issue.officialResponse.push(newResponse._id);
        if (statusUpdate) issue.status = statusUpdate;
        await issue.save();
        await newResponse.populate("responseBy", "name email role");
        res.status(201).json({
            message: "Official response added successfully",
            officialResponse: newResponse
        });
    } catch (error) {
        return next(new HttpError(error))
    }
}


const getOfficialResponse= async(req,res,next)=>{
    try {
        const { issueId } = req.params;
        if (!issueId.match(/^[0-9a-fA-F]{24}$/)) {
            return next(new HttpError("Invalid issue ID format", 400));
        }
        const responses = await OfficialResponseModel.find({ issue: issueId })
            .populate("responseBy", "name email role")
            .sort({ createdAt: -1 });
        res.status(200).json({
            count: responses.length,
            responses
        });
    } catch (error) {
        return next(new HttpError(error))
    }
}



module.exports={createOfficialResponse, getOfficialResponse};