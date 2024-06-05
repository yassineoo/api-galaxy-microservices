import express from 'express';
import bodyParser from 'body-parser';


import swaggerUi from "swagger-ui-express";
import cors from "cors"

import authRouter from './routes/authRouter';
import userRouter from './routes/userRouter';
import { specs } from './utils/swagger';
import profileRouter from './routes/profileRouter';



const app = express();
const port = 5000;

app.use(express.json());
app.use(express.urlencoded({
  extended:true
}))
app.use(cors())
app.use("/user", userRouter);
app.use("/profile", profileRouter);

app.use("/", authRouter);

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));


app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
