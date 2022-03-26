import { Schema, model, Document } from 'mongoose';

import { ResourcesEnum } from './../model/resourcesEnum';
import { TipoEnum } from './../model/tipoEnum';
import { StepsEnum } from './../model/stepsEnum';
import { DisciplinaEnum } from './../model/disciplinaEnum';
import { TurmaEnum } from './../model/turmaEnum';

interface TrackInterface extends Document {
  name: string,
  turma: TurmaEnum,
  disciplina: DisciplinaEnum,
  objectives: string,
  methodology: TipoEnum,
  resource: ResourcesEnum,
  associatedHabilities: [string],
  activities: [{
    steps: StepsEnum,
    description: string
  }
  ],
  observation: string,
  creator: Schema.ObjectId
}

const TrackSchema = new Schema({
  name: String,
  turma: Number,
  disciplina: Number,
  objectives: String,
  associatedHabilities: [String],
  methodology: String,
  resource: String,
  activities: [{
    steps: String,
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
