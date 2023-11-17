import express from 'express';
import { handleGeetestPost } from './src/geetest';

const app = express();
const port = 3000;

app.use(express.json());

app.post('/geetest', handleGeetestPost);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
