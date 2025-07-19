import { Router } from 'express';
import { getUsersController } from '../controllers';

const router = Router();

router.get('/users', getUsersController);

export default router;
