import { StepsEnum } from './../model/stepsEnum';
import { ResourcesEnum } from './../model/resourcesEnum';
import { TurmaEnum } from './../model/turmasEnum';
import { SegmentoEnum } from './../model/segmentoEnum';
import { DisciplinaEnum } from './../model/disciplinaEnum';
import { TipoEnum } from './../model/tipoEnum';
import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../schemas/User';

class UserService {
  public async login (inputUser) {
    const user = await User.findOne({ email: inputUser.email }).select('+password').lean();
    if (user == null || !(await bcrypt.compare(inputUser.password, user.password))) return null;
    try {
      const acessToken = jwt.sign({ user }, process.env.ACESS_TOKEN_SECRET);

      return ({ acessToken, user });
    } catch (error) {
      return null;
    }
  }

  public async index (page, keyword, segmento /* , disciplina */) {
    const users = User.find();
    if (keyword) {
      users.where('name').equals(new RegExp(keyword, 'i'));
    }
    if (segmento) {
      users.where('segmento').equals(segmento);
    }
    // users.where('disciplina').equals(disciplina);
    const response = await users.exec();
    return response;
  }

  public async store (inputUser) {
    try {
      const user = inputUser;
      const hashedPassword = await bcrypt.hash(process.env.DEFAULT_PASSWORD, 10);
      const hashedUser = { ...user, password: hashedPassword };
      await User.create(hashedUser);
      return 201;
    } catch (error) {
      console.log(error);
      return 401;
    }
  }

  public async update (user) {
    const { _id, password, email, ...updatableUser } = user;
    const updatedUser = await User.findByIdAndUpdate(_id, updatableUser, { new: true });
    return updatedUser;
  }

  public async delete (userId) {
    return await User.deleteOne({ _id: mongoose.Types.ObjectId(userId) });
  }

  public async findWithTracks (id) {
    const userWithTracks = await User.aggregate(
      [
        { $match: { _id: mongoose.Types.ObjectId(id) } },
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
    return userWithTracks;
  }

  public returnDefaults () {
    const disciplinas = Object.values(DisciplinaEnum).filter(value => typeof value === 'string') as string[];
    const segmentos = Object.values(SegmentoEnum).filter(value => typeof value === 'string') as string[];
    const turmas = Object.values(TurmaEnum).filter(value => typeof value === 'string') as string[];
    const tipos = Object.values(TipoEnum).filter(value => typeof value === 'string') as string[];
    const resources = Object.values(ResourcesEnum).filter(value => typeof value === 'string') as string[];
    const steps = Object.values(StepsEnum).filter(value => typeof value === 'string') as string[];
    const defaultValues = { disciplinas, segmentos, turmas, tipos, resources, steps };
    return defaultValues;
  }
}
export default new UserService();
