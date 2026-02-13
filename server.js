const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const helperRoutes = require("./routes/helperRoutes");
const bookingRoutes = require("./routes/bookingRoutes");


const app = express();

// middleware (important for future)
app.use(cors());
app.use(express.json());
app.use("/api/helpers", helperRoutes);
app.use("/api/bookings", bookingRoutes);



// MongoDB connection
mongoose.connect("mongodb+srv://aidmatch123:Apple123@cluster0.rxfvfjh.mongodb.net/?appName=Cluster0")
.then(() =>
{
    console.log("AidMatch Database Connected");
})
.catch((error) =>
{
    console.log("Database connection error:", error);
});

// test route
app.get("/", (req, res) =>
{
    res.send("AidMatch Server Running Successfully");
});

// start server
const PORT = process.env.PORT || 3000;

app.listen(PORT, () =>
{
    console.log("AidMatch server running on port " + PORT);
});

