const express = require("express");
const fetch = require("node-fetch");
const bodyParser = require("body-parser");
require("dotenv").config();

const port = process.env.PORT || 8080;
const app = express();
app.use("/", express.static(__dirname + "/"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.post("/api/protocol", async (req, res) => {
  const githubUrl = "https://api.github.com/repos/victorwinberg/fgg";
  try {
    const protocol = await fetch(
      `${githubUrl}/contents/protokoll/${encodeURI(req.query.filename)}`,
      {
        method: "PUT",
        headers: {
          Authorization: `token ${process.env.API_TOKEN}`,
          "Content-Type": "application/json; charset=utf-8",
        },
        body: JSON.stringify(req.body),
      }
    );

    let json;
    try {
      json = await protocol.json();
    } catch (error) {
      // no json
    }

    return res.status(protocol.status).send(json || protocol.statusText);
  } catch (error) {
    return res.status(500).send(error);
  }
});

app.listen(port, function () {
  console.log("FGG-App running on port " + port);
});
