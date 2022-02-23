import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';

import UserService from '../services/UserService';

class UserController {
  public async authenticate (req: Request, res: Response, next): Promise<Response> {
    console.log('autnera');
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];
    if (token == null) return res.sendStatus(401);
    jwt.verify(token, process.env.ACESS_TOKEN_SECRET, (err, { user }) => {
      console.log('autnera', user);
      if (err) return res.sendStatus(403);
      req.user = user;
      console.log('dsad');
      next();
    });
  }

  public async login (req: Request, res: Response): Promise<Response> {
    const loged = await UserService.login(req.body);
    if (loged) return res.json(loged);

    return res.sendStatus(400);
  }

  public async index (req: Request, res: Response): Promise<Response> {
    const users = await UserService.index();

    return res.json(users);
  }

  public async store (req: Request, res: Response): Promise<Response> {
    const status = await UserService.store(req.body);
    return res.sendStatus(status);
  }

  public async update (req: Request, res: Response): Promise<Response> {
    const updatedUser = await UserService.update(req.body);

    return res.json(updatedUser);
  }

  public async findWithTracks (req: Request, res: Response): Promise<Response> {
    const { id: _id } = req.params;
    const userWithTracks = await UserService.findWithTracks(_id);

    return res.json(userWithTracks);
  }

  public async returnDefaults (req: Request, res: Response): Promise<Response> {
    const defaults = await UserService.returnDefaults();
    return res.send(defaults);
  }
}

export default new UserController();
