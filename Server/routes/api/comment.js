const router=require("express").Router()
const {createComment, getIssueComments, updateComment, deleteComment}=require('../../controllers/commentControllers')
const authMiddleware = require("../../middleware/authMiddleware");


router.post('/:issueId', authMiddleware, createComment)
router.get('/:issueId', authMiddleware, getIssueComments)
router.put('/:commentId', authMiddleware, updateComment)
router.delete('/:commentId', authMiddleware, deleteComment)


module.exports=router;