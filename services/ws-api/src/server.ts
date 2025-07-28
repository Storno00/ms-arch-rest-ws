import { createServer } from "http";
import { Server as SocketServer } from "socket.io";
import { setupSocketHandlers } from "./handlers";
import { redis } from "@backend/database";
export const bootstrap = () => {
    const httpServer = createServer();

    const io = new SocketServer(httpServer, {
        cors: {
            origin: "*",
            methods: ["GET", "POST"],
        },
    });

    setupSocketHandlers(io);

    // Health check endpoint
    httpServer.on("request", async (req, res) => {
        if (req.url === "/health") {
            res.writeHead(200, { "Content-Type": "application/json" });
            //console.log(await prisma.user.findMany());
            await redis.set("bike:1", "Process 134");
            const respons = await redis.get("bike:1");
            console.log(respons);
            res.end(JSON.stringify({ status: "OK", service: "ws-api" }));
            return;
        }
        res.writeHead(404);
        res.end();
    });

    return httpServer;
};
