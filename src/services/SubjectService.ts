import Subject from '../schemas/Subject';

class SubjectService {
  public async index () {
    const subjects = await Subject.find();
    return subjects;
  }

  public async store (subject) {
    const subjectStored = await Subject.create(subject);
    return subjectStored;
  }

  public async getBySubject (subject: string) {
    const subjects = await Subject.find({ disciplina: subject }).exec();
    return subjects;
  }
}

export default new SubjectService();
