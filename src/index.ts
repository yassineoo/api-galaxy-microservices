import express from 'express';
import bodyParser from 'body-parser';

import authRouter from './routes/authRouter';
import UAMRouter from './routes/UPermissionRouter';



const app = express();
const port = 3000;


app.use(bodyParser.json());
app.use("/UAM", UAMRouter);

app.use("/", authRouter);


app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
