import  app  from "./bootstrap/bootstrap";
import { connectDB } from './dataBases/mongoDB';

// Connect to MongoDB
connectDB();
const port = process.env.PORT || 3000;

app.listen(port, () =>
  console.log(`CodeRefs listening at http://localhost:${port}`)
);
//disconnectDB();