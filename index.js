const express = require("express");
const mongoose = require("mongoose");
const route = require("./routes/route")
const cors = require("cors");
const dotenv = require("dotenv");
dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })

  .then(() => console.log("MongoDb is connected"))
  .catch((err) => console.log(err));

  app.use('/', route);

  app.use("/*", (req, res) => {
    res.status(400).send({ status: false, error: "Enter proper Url" });
  });

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Server is running on PORT : ${port}`);
});
