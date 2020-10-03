const { Router } = require('express');
const router = Router();
const User = require('../../controller/user');
const user = new User;
const Auth = require('../../utils/auths')
const auth = new Auth;
const valid_info = auth.validInfo

router.post('/signup', valid_info, user.signup)




module.exports = router