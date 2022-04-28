
import mongoose from 'mongoose';
import moment from 'moment';
import xl from 'excel4node';

import Track from '../schemas/Track';
import { ProfileEnum } from './../model/profileEnum';

class TrackService {
  public async index (page) {
    const limit = 12;
    const skip = page ? (page - 1) * 12 : 0;
    const tracks = await Track.aggregate(
      [
        {
          $lookup: {
            from: 'users',
            localField: 'creator',
            foreignField: '_id',
            as: 'creator'

          }
        }, { $unwind: { path: '$creator' } }, { $unset: 'creator.password' },
        { $skip: skip },
        { $limit: limit }
      ]
    ).exec();
    return tracks;
  }

  public async store (track) {
    const createdTrack = await Track.create(track);

    return createdTrack;
  }

  public async findById (id) {
    const track = await Track.aggregate(
      [
        { $match: { _id: new mongoose.Types.ObjectId(id) } },
        {
          $lookup: {
            from: 'users',
            localField: 'creator',
            foreignField: '_id',
            as: 'creator'

          }
        }, { $unwind: { path: '$creator' } }, { $unset: 'creator.password' }
      ]
    ).exec();

    return track;
  }

  public async update (id, track) {
    const updatedTrack = await Track.findByIdAndUpdate(id, track, { new: true });

    return updatedTrack;
  }

  public async findByUser (id) {
    const tracks = await Track.aggregate(
      [
        { $match: { creator: new mongoose.Types.ObjectId(id) } },
        {
          $lookup: {
            from: 'users',
            localField: 'creator',
            foreignField: '_id',
            as: 'creator'

          }
        }, { $unwind: { path: '$creator' } }, { $unset: 'creator.password' }
      ]
    ).exec();
    return tracks;
  }

  public async findFiltered (id, disciplinas, turmas, segmento, page, keyword) {
    try {
      let filter = {};
      const limit = 12;
      const skip = page ? (page - 1) * 12 : 0;

      if (keyword) {
        filter = { ...filter, name: new RegExp(keyword, 'i') };
      }

      if (id) {
        filter = { ...filter, creator: new mongoose.Types.ObjectId(id) };
      }
      if (disciplinas) {
        filter = { ...filter, disciplina: { $in: disciplinas } };
      }
      if (turmas) {
        filter = { ...filter, turma: { $in: turmas } };
      }
      if (segmento) {
        filter = { ...filter, segmento: segmento };
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
          }, { $unwind: { path: '$creator' } }, { $unset: 'creator.password' },
          {
            $facet: {
              tracks: [
                { $skip: skip },
                { $limit: limit }
              ],
              pageInfo: [
                { $group: { _id: null, count: { $sum: 1 } } }
              ]
            }
          }
        ]
      ).exec();
      return tracks[0];
    } catch (error) {
      throw new Error(error.message);
    }
  }

  public async returnHome (_id, disciplina, segmento, profile, page, keyword) {
    switch (profile) {
      case ProfileEnum.professor:
        return await this.findFiltered(null, disciplina, null, segmento, page, keyword);

      case ProfileEnum.coordenador:
        return await this.findFiltered(null, null, null, segmento, page, keyword);

      case ProfileEnum.coordenadorDeArea:
        return await this.findFiltered(null, disciplina, null, null, page, keyword);

      case ProfileEnum.adiministrador:
        return await this.findFiltered(null, null, null, null, page, keyword);

      default:
        return ('Perfil inválido');
    }
  }

  public async returnPastTracks (id, disciplina /*, segmento */) {
    try {
      let filter = {};
      if (id) {
        filter = { ...filter, creator: new mongoose.Types.ObjectId(id) };
      }
      if (disciplina) {
        filter = { ...filter, disciplina: { $in: disciplina } };
      }
      // if (segmento) {
      //   filter = { ...filter, segmento: segmento };
      // }
      const tracks = await Track.find({ $match: filter }, { _id: 1, name: 1 }).exec();
      return tracks;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  public async returnTrackReport (id, res) {
    try {
      const track = await this.findById(id);

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

      wb.write('Excel.xlsx', res);
    } catch (e) {
      console.error(e);
      res.status(500).send('Erro no processamento do relatório');
    }
  }
}

export default new TrackService();
