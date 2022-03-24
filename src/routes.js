import { Router } from 'express';

import UserController from './controllers/UserController';
import TrackController from './controllers/TrackController';

const routes = Router();

routes.get('/users', UserController.index);
routes.post('/login', UserController.login);
routes.post('/users', UserController.store);
routes.put('/users', UserController.authenticate, UserController.update);
routes.delete('/users/:id', UserController.authenticate, UserController.delete);
routes.get('/users/defaults', UserController.authenticate, UserController.returnDefaults);
routes.get('/users/:id', UserController.authenticate, UserController.findWithTracks);
routes.get('/tracks', UserController.authenticate, TrackController.index);
routes.post('/tracks', UserController.authenticate, TrackController.store);
routes.get('/tracks/filter', UserController.authenticate, TrackController.findFiltered);
routes.get('/tracks/:id', UserController.authenticate, TrackController.findById);
routes.get('/tracks/filter/:id', UserController.authenticate, TrackController.findByUser);
routes.put('/tracks', UserController.authenticate, TrackController.update);
routes.get('/home/tracks', UserController.authenticate, TrackController.returnHome);
routes.get('/past/tracks', UserController.authenticate, TrackController.returnPastTracks);
routes.get('/tracks/only/report/:id', UserController.authenticate, TrackController.returnTrackReport);

export default routes;
