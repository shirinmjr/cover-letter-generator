const express = require("express");
const cors = require("cors");
//const bodyParser = require("body-parser");
const logger = require("morgan");
//const genController = require("./controllers/letter-gen-controller");
const PORT = process.env.PORT || 3001;

const app = express();

//middleware
app.use(cors());
app.use(express.json());
app.use(logger("dev"));
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => res.send({ msg: "This is root!" }));
app.post("letters", controllers.createCoverLetters);

app.listen(PORT, () => console.log(`Express server listening on port ${PORT}`));
