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
routes.post('/tracks/filter', TrackController.findFiltered);
routes.get('/tracks/filter/:id', TrackController.findByUser);
routes.put('/tracks', TrackController.findById);
routes.post('/home/tracks', TrackController.returnHome);

export default routes;
