import { Request, Response } from 'express';

import TrackService from '../services/TrackService';

class TrackController {
  public async index (req: Request, res: Response): Promise<Response> {
    const tracks = await TrackService.index(req.query.page);
    return res.json(tracks);
  }

  public async store (req: Request, res: Response): Promise<Response> {
    const track = await TrackService.store({ ...req.body, creator: req.user._id });

    return res.json(track);
  }

  public async findById (req: Request, res: Response): Promise<Response> {
    const { id: _id } = req.params;
    const track = await TrackService.findById(_id);

    return res.json(track);
  }

  public async update (req: Request, res: Response): Promise<Response> {
    const updatedTrack = await TrackService.update(req.body._id, req.body);

    return res.json(updatedTrack);
  }

  public async findByUser (req: Request, res: Response): Promise<Response> {
    const { id: _id } = req.params;
    const tracks = await TrackService.findByUser(_id);

    return res.json(tracks);
  }

  public async findFiltered (req: Request, res: Response): Promise<Response> {
    try {
      const { _id, disciplinas, turmas } = req.user;
      const tracks = await TrackService.findFiltered(_id, disciplinas, turmas, null, null);

      return res.json(tracks);
    } catch (error) {
      return res.send(error.message);
    }
  }

  public async returnHome (req: Request, res: Response): Promise<Response> {
    const { _id, disciplina, segmento, profile } = req.user;
    const resp = await TrackService.returnHome(_id, disciplina, segmento, profile, req.query.page);
    return res.json(resp);
  }

  public async returnPastTracks (req: Request, res: Response): Promise<Response> {
    const { _id, disciplina, segmento } = req.user;
    const resp = await TrackService.returnPastTracks(_id, disciplina, segmento);
    return res.json(resp);
  }
}

export default new TrackController();
