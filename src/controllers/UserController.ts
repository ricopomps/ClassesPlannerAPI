import { Request, Response } from 'express';
import mongoose from 'mongoose';

import User from '../schemas/User';

class UserController {
  public async index (req: Request, res: Response): Promise<Response> {
    const users = await User.find();

    return res.json(users);
  }

  public async store (req: Request, res: Response): Promise<Response> {
    const user = await User.create(req.body);

    return res.json(user);
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
