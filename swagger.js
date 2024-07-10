import swaggerAutogen from "swagger-autogen";
import dotenv from "dotenv";
dotenv.config();

const doc = {
  info: {
    title: "livekit API",
    description: "Description",
  },
  host: `localhost:${process.env.PORT}`,
  schemes: ["http"],
};

const outputFile = "./swagger-output.json";
const routes = ["./routes/livekitRoute.js"];

swaggerAutogen(outputFile, routes, doc);
