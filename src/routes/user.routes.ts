import { verifyJWT } from '../middlewares/auth.middleware';
import {
  registerUser,
  userLogin,
  getUser,
  logoutUser,
} from '../controllers/user.controllers';
import { Router } from 'express';

const router = Router();

router.route('/register').post(registerUser);

router.route('/login').post(userLogin);

router.route('/user').get(verifyJWT, getUser);

router.route('/logout').post(verifyJWT, logoutUser);

export default router;
