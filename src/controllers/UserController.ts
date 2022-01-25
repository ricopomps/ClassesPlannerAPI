import { Request, Response } from 'express';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

import User from '../schemas/User';

class UserController {
  public async authenticate (req: Request, res: Response, next): Promise<Response> {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];
    if (token == null) return res.sendStatus(401);

    jwt.verify(token, process.env.ACESS_TOKEN_SECRET, (err, { user }) => {
      if (err) return res.sendStatus(403);
      req.user = user;
      next();
    });
  }

  public async login (req: Request, res: Response): Promise<Response> {
    const user = await User.findOne({ email: req.body.email });
    if (user == null || !bcrypt.compare(req.body.password, user.password)) return res.sendStatus(404);

    try {
      const acessToken = jwt.sign({ user }, process.env.ACESS_TOKEN_SECRET);

      return res.json({ acessToken });
    } catch (error) {
      return res.json({ error: error.message });
    }
  }

  public async index (req: Request, res: Response): Promise<Response> {
    const users = await User.find();

    return res.json(users);
  }

  public async store (req: Request, res: Response): Promise<Response> {
    try {
      const user = req.body;
      const hashedPassword = await bcrypt.hash(req.body.password, 10);
      const hashedUser = { ...user, password: hashedPassword };
      await User.create(hashedUser);
      res.sendStatus(201);
    } catch (error) {
      res.sendStatus(401);
    }
  }

  public async update (req: Request, res: Response): Promise<Response> {
    const updatedUser = await User.findByIdAndUpdate(req.body._id, req.body);

    return res.json(updatedUser);
  }

  public async findWithTracks (req: Request, res: Response): Promise<Response> {
    const { id: _id } = req.params;
    const userWithTracks = await User.aggregate(
      [
        { $match: { _id: mongoose.Types.ObjectId(_id) } },
        {
          $lookup: {
            from: 'tracks',
            localField: '_id',
            foreignField: 'creator',
            as: 'tracks'
          }
        }
      ]
    ).exec();
    return res.json(userWithTracks);
  }
}

export default new UserController();
