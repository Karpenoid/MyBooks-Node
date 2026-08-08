import express from "express";
import cors from "cors";
import router from "./routes/index.js";
import { errorMiddleware } from "./middlewares/error.middleware.js";
import swaggerUi from "swagger-ui-express";
import { swaggerSpec } from "./swagger.js";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use("/api", router);

app.use(errorMiddleware);

export default app;
