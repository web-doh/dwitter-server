import jwt, { JwtPayload, VerifyErrors } from "jsonwebtoken";
import { Server } from "socket.io";
import * as http from "http";

import { config } from "./../config";

export class Socket {
  private static socket?: Socket;
  private io: Server;

  public static init(server: http.Server) {
    if (!this.socket) {
      this.socket = new Socket(server);
    }
  }

  public static getSoketIO() {
    if (!this.socket) {
      throw new Error("Please call init first");
    }

    return this.socket.io;
  }

  private constructor(server: http.Server) {
    this.io = new Server(server, {
      cors: {
        origin: config.cors.allowedOrigin,
      },
      transports: ["websocket"],
    });

    this.io.use((socket, next) => {
      const token = socket.handshake.auth.token;

      if (!token) {
        return next(new Error("Authentication error"));
      }
      jwt.verify(
        token,
        config.jwt.secretKey,
        (error: VerifyErrors | null, decoded?: JwtPayload) => {
          if (error) {
            return next(new Error("Authentication error"));
          }
          next();
        }
      );
    });

    this.io.on("connection", (socket) => {
      console.log("Socket client connected");
    });
  }
}
