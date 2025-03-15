import { validate } from '../../middleware/validate.middleware';
import { register, logOut, login } from '../../controllers/auth.controllers'
import { RequestHandler, Router } from 'express';
import { registerValidation } from './validation';


const router = Router();

router.post('/signup', validate(registerValidation) as RequestHandler, register);
router.post('/login', login);

router.get('/logout', logOut);




export default router;