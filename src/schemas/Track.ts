import { Schema, model, Document } from 'mongoose';

interface TrackInterface extends Document {
  turma: number,
  disciplina: number,
  objectives: string,
  associatedHabilities: [string],
  activities: [{
    type: string,
    description: string
  }
  ],
  observation: string
}

const UserSchema = new Schema({
  turma: Number,
  disciplina: Number,
  objectives: String,
  associatedHabilities: [String],
  activities: [{
    type: String,
    description: String
  }
  ],
  observation: String
}, {
  typeKey: '$type',
  timestaps: true
});

export default model<TrackInterface>('Track', UserSchema);
