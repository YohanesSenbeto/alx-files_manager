const express = require("express");
const bodyParser = require("body-parser");
const routes = require("./routes");

const PORT = process.env.PORT || 5000;

const app = express();

// Configure body-parser to handle larger payloads
app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));

app.use("/", routes);

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
