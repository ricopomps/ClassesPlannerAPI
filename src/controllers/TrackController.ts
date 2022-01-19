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
}

export default new TrackController();
