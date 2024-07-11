const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
require("dotenv").config();
const { uploadOnCloudinary } = require("./config/cloudinary");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const { ConnectMongoDB } = require(".//config/connection");
const app = express();
app.use(cors());
app.use(morgan('dev'))
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const PORT = process.env.PORT || 7000;
const MONGO_URL = process.env.MONGO_URL;
ConnectMongoDB(MONGO_URL)
  .then(() => {
    console.log("DATABASE CONNECTED SUCCESSFULLY");
  })
  .catch((error) => {
    console.log("mongoose error", error);
  });


const aagam_router = require("./routes/aagam")  
const jaimin_router = require("./routes/jaimin")
const priyang_router = require("./routes/priyang")
const sashrik_router = require("./routes/sashrik")
app.use("/aagam", aagam_router)
app.use("/jaimin", jaimin_router)
app.use("/priyang", priyang_router)
app.use("/sashrik", sashrik_router)
app.listen(PORT, () => {
  console.log(
    "Server has been started at link: " + `http://localhost:${PORT}/`
  );
});