import { Schema, model, Document } from 'mongoose';

import { DisciplinaEnum } from './../model/disciplinaEnum';
import { TurmasEnum } from './../model/turmasEnum';
import { SegmentoEnum } from './../model/segmentoEnum';

interface SubjectInterface extends Document
    {
      anos: [TurmasEnum],
      disciplina: DisciplinaEnum,
      segmentos: [
        {
          segmento: SegmentoEnum,
          unidadeTematica: [{
            tituloUnidade: string,
            habilidades: [
              {
                codigoHabilidade: string,
                descricaoHabilidade: string
              }
            ]
          }]
        }
      ]
    }

const SubjectSchema = new Schema({
  anos: [String],
  disciplina: String,
  segmento: String,
  unidadesTematicas: [{
    tituloUnidade: String,
    habilidades: [
      {
        codigoHabilidade: String,
        descricaoHabilidade: String
      }
    ]
  }]

}, {
  typeKey: '$type',
  timestaps: true
});

export default model<SubjectInterface>('Subject', SubjectSchema);
