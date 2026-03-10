const express = require('express');
const app = express();
const dotenv = require('dotenv').config();
const port = process.env.PORT || 5000;
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const {dbConnect} = require("./utiles/DB");
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true,
}));
app.use(bodyParser.json());
app.use(cookieParser());

app.use("/api",require("./routes/authRoutes"))
app.use("/api",require("./routes/categoriesRoutes"))
app.use("/api",require("./routes/productRoutes"))







dbConnect();

app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${port}`);
})