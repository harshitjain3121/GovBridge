const router=require("express").Router()

const userRoutes=require('./api/user');
const issueRoutes=require('./api/issue');
const commentRoutes=require('./api/comment');
const responseOfficailRoutes=require('./api/officialResponse');

router.use('/users',userRoutes);
router.use('/issues',issueRoutes);
router.use('/comments',commentRoutes);
router.use('/officialResponse',responseOfficailRoutes);

module.exports=router;