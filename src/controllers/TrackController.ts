import { Request, Response } from 'express';
import xl from 'excel4node';
import moment from 'moment';
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

      const tracks = await TrackService.findFiltered(_id, disciplinas, turmas, null, null, null);

      return res.json(tracks);
    } catch (error) {
      return res.send(error.message);
    }
  }

  public async returnHome (req: Request, res: Response): Promise<Response> {
    const { _id, disciplinas, segmento, profile } = req.user;
    const resp = await TrackService.returnHome(_id, disciplinas, segmento, profile, req.query.page, req.query.keyword);
    return res.json(resp);
  }

  public async returnPastTracks (req: Request, res: Response): Promise<Response> {
    const { _id } = req.user;
    const resp = await TrackService.returnPastTracks(_id);
    return res.json(resp);
  }

  public async returnTrackReport (req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    try {
      const track = await TrackService.findById(id);

      const wb = new xl.Workbook({
        defaultFont: {
          size: 10
        }
      });

      const ws = wb.addWorksheet('Sheet 1');

      ws.column(1).setWidth(15);
      ws.column(2).setWidth(20);
      ws.column(4).setWidth(20);
      ws.column(5).setWidth(40);
      ws.column(6).setWidth(40);
      ws.column(7).setWidth(20);
      ws.column(9).setWidth(200);

      // header---------
      const isMerged = true;
      const headerStyle = { font: { bold: true }, alignment: { vertical: 'center' }, fill: { type: 'pattern', patternType: 'solid', fgColor: 'FFCC33' } };
      ws.cell(1, 1, 1, 11, isMerged)
        .string('Colégio Visão - Relatório da Trilha ')
        .style({ font: { bold: true, size: 12 } });
      ws.cell(2, 1, 2, 11, isMerged).string(`Extraido em ${moment(new Date()).format('DD/MM/YYYY HH:mm')}`);
      ws.cell(3, 1, 3, 1, isMerged).string('Nome').style(headerStyle);
      ws.cell(3, 2, 3, 2, isMerged).string('Segmento').style(headerStyle);
      ws.cell(3, 3, 3, 3, isMerged).string('Série/Ano').style(headerStyle);
      ws.cell(3, 4, 3, 4, isMerged).string('Disciplina').style(headerStyle);
      ws.cell(3, 5, 3, 5, isMerged).string('Objetivos').style(headerStyle);
      ws.cell(3, 6, 3, 6, isMerged).string('Habilidades Associadas').style(headerStyle);
      ws.cell(3, 7, 3, 7, isMerged).string('Criador').style(headerStyle);
      ws.cell(3, 8, 3, 8, isMerged).string('Data de Criação').style(headerStyle);
      ws.cell(3, 9, 3, 9, isMerged).string('Observação').style(headerStyle);

      // end header-------

      ws.cell(4, 1).string(track[0].name);
      ws.cell(4, 2).string(track[0].segmento ? track[0].segmento.toString() : '');
      ws.cell(4, 3).string(track[0].turma ? track[0].turma.toString() : '');
      ws.cell(4, 4).string(track[0].disciplina ? track[0].disciplina.toString() : '');
      ws.cell(4, 5).string(track[0].objectives);
      ws.cell(4, 6).string(track[0].associatedHabilities ? track[0].associatedHabilities.toString() : '');
      ws.cell(4, 7).string(track[0].creator.name);
      ws.cell(4, 8).string(track[0].createdAt ? `${moment(track[0].createdAt).format('DD/MM/YYYY HH:mm:ss')}` : '');
      ws.cell(4, 9).string(track[0].observation);

      console.log(wb.write('Excel.xlsx', res));
    } catch (e) {
      console.error(e);
      res.status(500).send('Erro no processamento do relatório');
    }
  }
}

export default new TrackController();
