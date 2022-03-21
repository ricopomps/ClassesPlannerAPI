import { Request, Response } from 'express';

import SubjectService from '../services/SubjectService';

class SubjectController {
  public async index (req: Request, res: Response): Promise<Response> {
    const Subjects = await SubjectService.index();
    return res.json(Subjects);
  }

  public async store (req: Request, res: Response): Promise<Response> {
    const Subjects = await SubjectService.store(req.body);
    return res.json(Subjects);
  }
}

export default new SubjectController();
