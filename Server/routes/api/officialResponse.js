const router=require("express").Router()
const {createOfficialResponse, getOfficialResponse}=require('../../controllers/officialResponseControllers')
const authMiddleware = require("../../middleware/authMiddleware");
const governMiddleware = require("../../middleware/governMiddleware");

router.post('/:issueId', authMiddleware, governMiddleware, createOfficialResponse)
router.get('/:issueId', authMiddleware, governMiddleware, getOfficialResponse)


module.exports=router;