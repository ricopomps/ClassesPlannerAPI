
import mongoose from 'mongoose';

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

  public async findFiltered (id, disciplinas, turmas, segmento, page) {
    try {
      let filter = {};
      const limit = 12;
      const skip = page ? (page - 1) * 12 : 0;
      if (id) {
        filter = { ...filter, creator: new mongoose.Types.ObjectId(id) };
      }
      if (disciplinas) {
        filter = { ...filter, disciplina: { $in: disciplinas } };
      }
      if (turmas) {
        filter = { ...filter, turma: { $in: turmas } };
      }
      // if (segmento) {
      //   filter = { ...filter, segmento: segmento };
      // }
      const tracks = await Track.aggregate(
        [
          { $match: filter },
          {
            $lookup: {
              from: 'users',
              localField: 'creator',
              foreignField: '_id',
              as: 'creator'
              // let: { segmento: '$creatorz.segmento' },
              // pipeline: [{ $match: { segmento: segmento, creatorz: '$creator' } }]
            }
          }, { $unwind: { path: '$creator' } }, { $unset: 'creator.password' },
          { $skip: skip },
          { $limit: limit }
        ]
      ).exec();
      return tracks;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  public async returnHome (_id, disciplina, segmento, profile, page) {
    switch (profile) {
      case ProfileEnum.professor:
        console.log('findByUsers', segmento, _id);
        return await this.findFiltered(null, disciplina, null, segmento, page);

      case ProfileEnum.coordenador:
        console.log('findFiltered', segmento);
        return await this.findFiltered(null, null, null, segmento, page);

      case ProfileEnum.coordenadorDeArea:
        console.log('findFiltered', disciplina);
        return await this.findFiltered(null, disciplina, null, null, page);

      case ProfileEnum.adiministrador:
        console.log('index');
        return await this.index(page);

      default:
        console.log('profile', profile);
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
}

export default new TrackService();
