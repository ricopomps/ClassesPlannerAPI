import { Request, Response } from 'express';

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
}

export default new TrackController();
