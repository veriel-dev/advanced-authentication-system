import express, { Express } from 'express';
import { config } from '../config/config';
import { connectDB } from '../config/database';
import authRoutes from "../routes/auth/auth.routes"

class Server {
  public app: Express
  private PREFIX_URL: String;

  constructor() {
    this.app = express();
    this.PREFIX_URL = '/api/v1';
    this.connectDb();
    this.middleware();
    this.routes(); 
  }

  private middleware(): void {
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
  }
  private routes(): void {
    this.app.use(`${this.PREFIX_URL}/auth`, authRoutes);
  }
  private async connectDb(): Promise<void> {
    await connectDB()
  }

  public async start() {
    this.app.listen(config.port, () => {
      console.log(`Server running on http://localhost:${config.port}`);
    });
  }
}

export default Server;