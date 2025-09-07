const HttpError=require('../models/errorModel')
const IssueModel=require('../models/issueModel')
const CommentModel=require('../models/commentModel')


const createComment= async(req,res,next)=>{
    try {
        const { issueId } = req.params;
        const { comment } = req.body;
        if (!issueId.match(/^[0-9a-fA-F]{24}$/)) {
            return next(new HttpError("Invalid issue ID format", 400));
        }
        if (!comment || comment.trim() === "") {
            return next(new HttpError("Comment cannot be empty", 422));
        }
        const issue = await IssueModel.findById(issueId);
        if (!issue) {
            return next(new HttpError("Issue not found", 404));
        }
        const newComment = await CommentModel.create({
            creator: req.user.id,
            issue: issueId,
            comment
        });
        issue.comments.push(newComment._id);
        await issue.save();
        await newComment.populate("creator", "name email role");
        res.status(201).json({
            message: "Comment added successfully",
            comment: newComment
        });
    } catch (error) {
        return next(new HttpError(error))
    }
}


const getIssueComments= async(req,res,next)=>{
    try {
        const { issueId } = req.params;
        if (!issueId.match(/^[0-9a-fA-F]{24}$/)) {
            return next(new HttpError("Invalid issue ID format", 400));
        }
        const comments = await CommentModel.find({ issue: issueId })
            .populate("creator", "name email role")
            .sort({ createdAt: -1 });
        res.status(200).json({
            count: comments.length,
            comments,
        });
    } catch (error) {
        return next(new HttpError(error))
    }
}


const updateComment= async(req,res,next)=>{
    try {
        const { commentId } = req.params;
        const { comment } = req.body;
        if (!commentId.match(/^[0-9a-fA-F]{24}$/)) {
            return next(new HttpError("Invalid comment ID format", 400));
        }
        if (!comment || comment.trim() === "") {
            return next(new HttpError("Comment cannot be empty", 422));
        }
        const existingComment = await CommentModel.findById(commentId);
        if (!existingComment) {
            return next(new HttpError("Comment not found", 404));
        }
        if (existingComment.creator.toString() !== req.user.id) {
            return next(new HttpError("You can only update your own comments", 403));
        }
        existingComment.comment = comment;
        await existingComment.save();
        await existingComment.populate("creator", "name email role");
        res.status(200).json({
            message: "Comment updated successfully",
            comment: existingComment
        });
    } catch (error) {
        return next(new HttpError(error))
    }
}


const deleteComment= async(req,res,next)=>{
    try {
        const { commentId } = req.params;
        if (!commentId.match(/^[0-9a-fA-F]{24}$/)) {
            return next(new HttpError("Invalid comment ID format", 400));
        }
        const comment = await CommentModel.findById(commentId);
        if (!comment) {
            return next(new HttpError("Comment not found", 404));
        }
        if (comment.creator.toString() !== req.user.id && req.user.role !== "government") {
            return next(new HttpError("Unauthorized to delete this comment", 403));
        }
        await IssueModel.findByIdAndUpdate(comment.issue, {
            $pull: { comments: comment._id }
        });
        await CommentModel.findByIdAndDelete(commentId);
        res.status(200).json({ message: "Comment deleted successfully" });
    } catch (error) {
        return next(new HttpError(error))
    }
}



module.exports={createComment, getIssueComments, updateComment, deleteComment};
