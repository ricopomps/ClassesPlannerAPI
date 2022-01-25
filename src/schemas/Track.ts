import { Schema, model, Document } from 'mongoose';

import { DisciplinaEnum } from './../model/disciplinaEnum';
import { TurmaEnum } from './../model/turmaEnum';

interface TrackInterface extends Document {
  turma: TurmaEnum,
  disciplina: DisciplinaEnum,
  objectives: string,
  associatedHabilities: [string],
  activities: [{
    type: string,
    description: string
  }
  ],
  observation: string,
  creator: Schema.ObjectId
}

const TrackSchema = new Schema({
  turma: Number,
  disciplina: Number,
  objectives: String,
  associatedHabilities: [String],
  activities: [{
    type: String,
    description: String
  }
  ],
  observation: String,
  creator: Schema.ObjectId
}, {
  typeKey: '$type',
  timestaps: true
});

export default model<TrackInterface>('Track', TrackSchema);
