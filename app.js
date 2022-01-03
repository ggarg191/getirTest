const express = require("express");
const mongoose = require("mongoose");
const { getRecords } = require("./controllers/get_records");
const config = process.argv[2] == "dev" ? require('./config/dev') : require('./config/prod');



const app = express();
app.use(express.json());

console.log(config.DB_URL);
mongoose.connect(config.DB_URL, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        app.listen(config.PORT, () => {
            console.log(`Example app listening at http://localhost:${config.PORT}`)
        });
    })
    .catch((err) => {
        console.log("unable to connect to mongo db server : ", err);
    })

app.post("/get_record", getRecords);

// this will return not found error.
app.use((req, res) => {
    res.status(404).send("<h1>404</h1>");
})