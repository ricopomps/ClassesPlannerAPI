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
}

export default new SubjectService();
