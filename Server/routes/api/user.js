const router=require("express").Router()
const {registerUser, loginUser, getUser}=require('../../controllers/userControllers')
const authMiddleware = require("../../middleware/authMiddleware");


router.post('/register',registerUser)
router.post('/login', loginUser)
router.get('/:id', authMiddleware, getUser)



module.exports=router;