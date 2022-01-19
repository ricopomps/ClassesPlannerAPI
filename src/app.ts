import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';

import routes from './routes';

class App {
    public express: express.Application;

    constructor () {
      this.express = express();

      this.middlewares();
      this.database();
      this.routes();
    }

    private middlewares (): void {
      this.express.use(express.json());
      this.express.use(cors());
    }

    private database (): void {
      mongoose.connect('mongodb+srv://praticaprojeto:praticaprojeto@mycluster.tuuar.mongodb.net/visao?retryWrites=true&w=majority', {
        useNewUrlParser: true
      });
    }

    private routes (): void {
      this.express.get('/', (req, res) => {
        return res.send('Hello World');
      });
      this.express.use(routes);
    }
}

export default new App().express;