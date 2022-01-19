import { Schema, model, Document } from 'mongoose';

interface UserInterface extends Document {
  name: string,
  email: string,
  password: string,
  profile: number,
  segmento: string,
  turmas: [number],
  disciplinas: [number]
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
