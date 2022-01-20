import { Schema, model, Document } from 'mongoose';

import { DisciplinaEnum } from './../model/disciplinaEnum';
import { TurmaEnum } from './../model/turmaEnum';
import { SegmentoEnum } from './../model/segmentoEnum';
import { ProfileEnum } from './../model/profileEnum';

interface UserInterface extends Document {
  name: string,
  email: string,
  password: string,
  profile: ProfileEnum,
  segmento: SegmentoEnum,
  turmas: [TurmaEnum],
  disciplinas: [DisciplinaEnum]
}

const UserSchema = new Schema({
  name: String,
  email: String,
  password: String,
  profile: Number,
  segmento: String,
  turmas: [Number],
  disciplinas: [Number]
}, {
  timestaps: true
});

export default model<UserInterface>('User', UserSchema);
