const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();
const router = require("./routes/auth");
const locationRouter = require("./routes/locations");
const alarmLogRouter = require("./routes/alarmLogs");

const app = express();
app.use(express.json());
app.use("/api/auth",router);
app.use("/api/locations",locationRouter);
app.use("/api/alarmLogs", alarmLogRouter);

const PORT = process.env.PORT || 3000;

const MONGODB_URI = process.env.MONGODB_URI;

mongoose.connect(MONGODB_URI)
.then(() => console.log("Database connected"))
.catch(err => 
    console.log(`Error occurred while connecting to database\nError: ${err}`)
);

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});


