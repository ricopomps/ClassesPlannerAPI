import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

import routes from './routes';

class App {
    public express: express.Application;

    constructor () {
      this.express = express();

      dotenv.config();
      this.middlewares();
      this.database();
      this.routes();
    }

    private middlewares (): void {
      this.express.use(express.json());
      this.express.use(cors());
    }

    private database (): void {
      mongoose.connect(process.env.CONNECTION_STRING, {
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
