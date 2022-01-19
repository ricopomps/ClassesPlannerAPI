import { Router } from 'express';

import UserController from './controllers/UserController';
import TrackController from './controllers/TrackController';

const routes = Router();

routes.get('/users', UserController.index);
routes.post('/users', UserController.store);
routes.put('/users', UserController.update);
routes.get('/users/:id', UserController.findWithTracks);
routes.get('/tracks', TrackController.index);
routes.post('/tracks', TrackController.store);
routes.get('/tracks/:id', TrackController.findById);
routes.put('/tracks', TrackController.findById);

export default routes;
