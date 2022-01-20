import { Request, Response } from 'express';
import mongoose from 'mongoose';

import Track from '../schemas/Track';
import { ProfileEnum } from './../model/profileEnum';

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

  public async returnHome (req: Request, res: Response): Promise<Response> {
    const { id: _id, disciplina, segmento, profile } = req.body;
    switch (profile) {
      case ProfileEnum.professor:
        console.log('findByUsers', segmento, _id);
        return res.json('findByUsers');

      case ProfileEnum.coordenador:
        console.log('findFiltered', segmento);
        return res.json('findFiltered, segmento: ' + segmento);

      case ProfileEnum.coordenadorDeArea:
        console.log('findFiltered', disciplina);
        return res.json('findFiltered, disciplina: ' + disciplina);

      case ProfileEnum.adiministrador:
        console.log('index');
        return res.json('index');

      default:
        console.log('Perfil inválido');
        return res.json('Perfil inválido');
    }
  }
}

export default new TrackController();
