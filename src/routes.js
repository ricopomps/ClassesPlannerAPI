import { Router } from 'express';

import UserController from './controllers/UserController';
import TrackController from './controllers/TrackController';

const routes = Router();

routes.get('/users', UserController.index);
routes.post('/users', UserController.store);
routes.put('/users', UserController.update);
routes.get('/tracks', TrackController.index);
routes.post('/tracks', TrackController.store);

export default routes;
