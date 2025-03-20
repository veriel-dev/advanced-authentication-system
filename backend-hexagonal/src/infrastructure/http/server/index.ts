import express, { Express, Request, Response } from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import { config } from '../../config/config';

// Importar repositorios
import { MongoUserRepository } from '../../repositories/MongoUserRepository';
// Importar servicios de infraestructura
import { BcryptAuthService } from '../../services/BcryptAuthService';
import { NodemailerEmailService } from '../../services/NodemailerEmailService';
// Importar servicios de aplicación
import { AuthenticationService } from '../../../application/services/AuthenticationService';
// Importar controladores
import { AuthController } from '../controllers/AuthController';
// Importar constructores de rutas
import createAuthRouter from '../routes/AuthRoutes';
// Importar Connect DB
import { connectDB } from '../../config/database';
import path from 'path';

class Server {
  public app: Express;
  private PREFIX_URL: string;
  private frontendPath: string;

  constructor() {
    this.app = express();
    this.PREFIX_URL = '/api/v1';
    this.frontendPath = config.frontendPath;
    this.connectDb();
    this.middleware();
    this.routes();
  }

  private middleware(): void {
    this.app.use(express.json());
    this.app.use(cookieParser());
    this.app.use(
      cors({
        origin: config.clientUrl,
        credentials: true,
        methods: ['GET', 'POST', 'PUT', 'DELETE'],
      }),
    );
    if (config.environment === 'production') {
      this.app.use(express.static(this.frontendPath));
    }
  }
  private routes(): void {
    // Crear los repositorios
    const userRepository = new MongoUserRepository();

    // Crear los servicios de infraestructura
    const authService = new BcryptAuthService();
    const emailService = new NodemailerEmailService();

    // Crear los servicios de aplicación
    const authenticationService = new AuthenticationService(
      userRepository,
      authService,
      emailService,
    );
    const authController = new AuthController(authenticationService);

    const authRouter = createAuthRouter(authController);
    this.app.use(`${this.PREFIX_URL}/auth`, authRouter);

    this.app.get('/health', (req: Request, res: Response) => {
      res.status(200).json({ status: 'ok' });
    });
    if (config.environment === 'production') {
      this.app.get('*', (req: Request, res: Response) => {
        res.sendFile(path.join(this.frontendPath, 'index.html'));
      });
    }
  }
  private async connectDb(): Promise<void> {
    await connectDB();
  }
  public async start() {
    this.app.listen(config.port, () => {
      console.log(`Server running on http://localhost:${config.port}`);
    });
  }
}

export default Server;
