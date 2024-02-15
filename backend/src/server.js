const express = require("express");
const app = express();
const routes = require("./routes");
const cors = require("cors");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const db = require("./configs/connectDB");

// PORT
require("dotenv").config();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true }));

// Body Parser
app.use(bodyParser.json());

// Cookie Parser
app.use(cookieParser());

// Routes
routes(app);

// Connect DB
db.connect();

// Run localhost
app.listen(port, () => {
    console.log(`App listening on port ${port}`);
});
