import { Request, Response } from 'express';
import mongoose from 'mongoose';

import Track from '../schemas/Track';

class TrackController {
  public async index (req: Request, res: Response): Promise<Response> {
    const tracks = await Track.find();

    return res.json(tracks);
  }

  public async store (req: Request, res: Response): Promise<Response> {
    const track = await Track.create(req.body);

    return res.json(track);
  }

  public async findById (req: Request, res: Response): Promise<Response> {
    const { id: _id } = req.params;
    const track = await Track.findById(_id);

    return res.json(track);
  }

  public async update (req: Request, res: Response): Promise<Response> {
    const updatedTrack = await Track.findByIdAndUpdate(req.body._id, req.body);

    return res.json(updatedTrack);
  }

  public async findByUser (req: Request, res: Response): Promise<Response> {
    const { id: _id } = req.params;
    const tracks = await Track.aggregate(
      [
        { $match: { creator: mongoose.Types.ObjectId(_id) } },
        {
          $lookup: {
            from: 'users',
            localField: 'creator',
            foreignField: '_id',
            as: 'creator'
          }
        }
      ]
    ).exec();
    return res.json(tracks);
  }

  public async findFiltered (req: Request, res: Response): Promise<Response> {
    const { id: _id, disciplina, turma } = req.body;
    let filter = {};
    if (_id) {
      filter = { ...filter, creator: mongoose.Types.ObjectId(_id) };
    }
    if (disciplina) {
      filter = { ...filter, disciplina: disciplina };
    }
    if (turma) {
      filter = { ...filter, turma: turma };
    }
    const tracks = await Track.aggregate(
      [
        { $match: filter },
        {
          $lookup: {
            from: 'users',
            localField: 'creator',
            foreignField: '_id',
            as: 'creator'
          }
        }
      ]
    ).exec();
    return res.json(tracks);
  }
}

export default new TrackController();
