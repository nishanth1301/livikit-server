import dotenv from "dotenv";
import { AccessToken } from "livekit-server-sdk";
import express from "express";
import swaggerUi from "swagger-ui-express";
import swaggerDocument from "./swagger-output.json" assert { type: "json" };
import { router as livekitRoutes } from "./routes/livekitRoute.js";
import cors from "cors";
// const swaggerUi = require("swagger-ui-express");
// const swaggerDocument = require("./swagger-output.json");

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

app.use("/", livekitRoutes);

app.get("/status", (req, res) => {
  res.status(200).json({ message: "Servier is running" });
});

// app.get("/livekit", async (req, res) => {
//   const roomName = "random_rooms_";
//   const participantName = "coducer";

//   const apiKey = "APIoUTE4xbVZMDP";
//   const secretKey = "OfGPBDadQcw5ySrnTpqTe1qtNsbnc7ecjdE6gkdLugeA";

//   const at = new AccessToken(apiKey, secretKey, {
//     identity: participantName,
//   });
//   at.addGrant({
//     roomJoin: true,
//     room: roomName,
//     roomCreate: true,
//     canPublish: true,
//     canSubscribe: true,
//   });

//   const token = await at.toJwt();
//   res.json({ tokens: token });
// });

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.listen(process.env.PORT, () => {
  console.log(`livekit app listening on port ${process.env.PORT}`);
});
