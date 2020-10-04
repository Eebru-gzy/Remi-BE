const { Router } = require('express');
const router = Router();
const User = require('../../controller/user');
const user = new User;
const Auth = require('../../utils/auths')
const auth = new Auth;
const valid_info = auth.regValidInfo
const log_valid_info = auth.loginValidInfo

router.post('/signup', valid_info, user.signup);
router.post('/login', log_valid_info, user.login);




module.exports = router