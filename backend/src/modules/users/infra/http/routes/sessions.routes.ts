import { Router } from 'express';
import SessionController from '../controllers/SessionsController';

const sessionsRouter = Router();
const sesssionController = new SessionController();

sessionsRouter.post('/', sesssionController.create);

export default sessionsRouter;
