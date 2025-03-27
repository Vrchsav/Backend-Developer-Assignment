const express = require("express");
const app = express();
const cors = require("cors");

require("dotenv").config();

const PORT = process.env.PORT || 4000;

app.use(cors(
    
));
const db=require("./config/database");
db.connect();


app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
})
