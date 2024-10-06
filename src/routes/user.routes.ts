import { registerUser, userLogin } from '../controllers/user.controllers';
import { Router } from 'express';

const router = Router();

router.route('/register').post(registerUser);

router.route('/login').post(userLogin);

export default router;
