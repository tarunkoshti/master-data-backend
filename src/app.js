import cors from 'cors';
import express from 'express';
import cookieParser from 'cookie-parser';
import { errorHandler } from './core/middlewares/errorHandler.js';
import Logger from './core/utils/logger.js';
import apiRoutes from './core/routes/index.js';
import pool from './config/db.js';
import { frontendUrl, uploadDir } from './config/base.js';

// Verify database connection
const connectDb = async () => {
    try {
        const connection = await pool.getConnection();
        Logger.info("Database connected successfully");
        connection.release();
    } catch (err) {
        Logger.error("Database connection failed: " + err.message);
    }
}
connectDb();

const app = express();
app.set('trust proxy', 1);

app.use((req, res, next) => {
    Logger.info(`${req.method} ${req.originalUrl} from ${req.ip} (Origin: ${req.get('origin')})`);
    next();
});

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const allowedOrigins = [
    frontendUrl
];

app.use(cors({
    origin: function (origin, callback) {
        if (!origin) return callback(null, true);

        if (allowedOrigins.includes(origin)) {
            callback(null, origin);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
}));

// Routes
const UPLOADS_DIR = uploadDir;
app.use('/uploads', express.static(UPLOADS_DIR));
app.use('/api/v1', apiRoutes);
app.get('/', (req, res) => res.send('ok'));

// catch 404 and forward to error handler
app.use((req, res, next) => next(new Error('Route Not Found')));

// Middleware Error Handler
app.use(errorHandler);

export default app;
