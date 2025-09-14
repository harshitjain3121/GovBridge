const router=require("express").Router()
const {createIssue, getIssues, getIssue, deleteIssue, upvoteIssue, getUpvotedIssues, updateIssueStatus}=require('../../controllers/issueControllers')
const authMiddleware = require("../../middleware/authMiddleware");
const governMiddleware = require("../../middleware/governMiddleware");


router.post('/', authMiddleware, createIssue)
router.get('/',getIssues)
router.get('/upvoted', authMiddleware, getUpvotedIssues)
router.get('/:id',getIssue)
router.delete('/:id', authMiddleware, governMiddleware, deleteIssue)
router.get('/:id/upvote', authMiddleware, upvoteIssue)
router.patch('/:id/status', authMiddleware, governMiddleware, updateIssueStatus)



module.exports=router;