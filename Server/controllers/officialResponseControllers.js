const HttpError=require('../models/errorModel')
const IssueModel=require('../models/issueModel');
const OfficialResponseModel = require('../models/officialResponseModel');
const UserModel = require('../models/userModel');
const CommentModel = require('../models/commentModel');
const { io, getReceiverSocketId } = require('../socket/socket')

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
        const issue = await IssueModel.findById(issueId).populate({
            path: 'comments',
            populate: {
                path: 'creator',
                select: '_id'
            }
        });
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

        const userIdsToNotify = new Set();
        issue.upvotes.forEach(userId => userIdsToNotify.add(userId.toString()));
        issue.comments.forEach(comment => userIdsToNotify.add(comment.creator._id.toString()));
        userIdsToNotify.delete(req.user.id);
        const finalUserIds = [...userIdsToNotify];


        if (finalUserIds.length > 0) {
            const notification = {
                type: statusUpdate ? "STATUS_UPDATE" : "OFFICIAL_RESPONSE",
                message: `An official responded to '${issue.title}'${statusUpdate ? `. New status: ${statusUpdate}` : '.'}`,
                issue: issueId,
                isRead: false,
                createdAt: new Date()
            };
            

            await UserModel.updateMany(
                { _id: { $in: finalUserIds } },
                {
                    $push: {
                        notifications: {
                            $each: [notification],
                            $position: 0,
                            $slice: -50
                        }
                    }
                }
            );

            for (const userId of finalUserIds) {
                const receiverSocketId = getReceiverSocketId(userId);
                if (receiverSocketId) {
                    io.to(receiverSocketId).emit("newNotification", notification);
                }
            }
        }

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