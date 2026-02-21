import express, { Request, Response } from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import { createServer } from "http";
import WebSocket from "ws";
import { env } from "./config/env";
import websocketService, { WsState } from "./services/websocket.service";

// Routes
import authRoutes from "./routes/auth.routes";
import walletRoutes from "./routes/wallet.routes";
import userRoutes from "./routes/user.routes";
import escrowRoutes from "./routes/escrow.routes";
import collateralRoutes from "./routes/collateral.routes";
import loanRoutes from "./routes/loan.routes";
import oracleRoutes from "./routes/oracle.routes";
import confirmationRoutes from "./routes/confirmation.routes";
import governanceRoutes from "./routes/governance.routes";
import riskRoutes from "./routes/risk.routes";
import analyticsRoutes from "./routes/analytics.routes";

// Middleware
import { rateLimitMiddleware } from "./middleware/rate-limit.middleware";
import { errorMiddleware, notFoundMiddleware } from "./middleware/error.middleware";

const app = express();

// ── Global Middleware ────────────────────────────────────────────────────────
app.use(helmet());
app.use(cors({ origin: env.corsAllowedOrigins }));
app.use(morgan("dev"));
app.use(express.json());
app.use(rateLimitMiddleware);

// ── Health ───────────────────────────────────────────────────────────────────
app.get("/health", (_req: Request, res: Response) => {
    res.json({ status: "ok", version: "1.0.0", timestamp: new Date() });
});

// ── API Routes ───────────────────────────────────────────────────────────────
const api = "/api";

app.use(`${api}/auth`, authRoutes);
app.use(`${api}/wallets`, walletRoutes);
app.use(`${api}/users`, userRoutes);
app.use(`${api}/escrows`, escrowRoutes);
app.use(`${api}/collateral`, collateralRoutes);
app.use(`${api}/loans`, loanRoutes);
app.use(`${api}/oracles`, oracleRoutes);
app.use(`${api}/confirmations`, confirmationRoutes);
app.use(`${api}/governance`, governanceRoutes);
app.use(`${api}/risk`, riskRoutes);
app.use(`${api}/analytics`, analyticsRoutes);

// ── Error Handling (must be last) ────────────────────────────────────────────
app.use(notFoundMiddleware);
app.use(errorMiddleware);

const port = env.port;

// ── Create HTTP + WebSocket Server ────────────────────────────────────────
const server = createServer(app);
const wsState = websocketService.getWsState();

// ── WebSocket Server ────────────────────────────────────────────────────────
const wss = new WebSocket.Server({ 
    server,
    path: '/ws'
});

wss.on('connection', (ws: WebSocket, req) => {
    console.log(`WebSocket client connected from ${req.socket.remoteAddress}`);
    wsState.addConnection(ws);
    
    ws.send(JSON.stringify({ 
        type: 'CONNECTION_ESTABLISHED', 
        message: 'Connected to StelloVault WebSocket',
        timestamp: new Date().toISOString()
    }));
});

// ── Start Server ───────────────────────────────────────────────────────────
server.listen(port, () => {
    console.log(`StelloVault server running on http://localhost:${port}`);
    console.log(`WebSocket endpoint: ws://localhost:${port}/ws`);
    console.log(`Routes mounted at ${api}`);
});

export default app;
