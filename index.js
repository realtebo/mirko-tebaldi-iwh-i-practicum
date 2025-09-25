const express = require("express");
const axios = require("axios");
const app = express();

app.set("view engine", "pug");
app.use(express.static(__dirname + "/public"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// * Please DO NOT INCLUDE the private app access token in your repo. Don't do this practicum in your normal account.
const PRIVATE_APP_ACCESS = "pat-na1-1c63d7a1-db76-4017-b752-d0b51fb0db4b";

// TODO: ROUTE 1 - Create a new app.get route for the homepage to call your custom object data. Pass this data along to the front-end and create a new pug template in the views folder.
app.get("/", async (req, res) => {
  const contacts =
    "https://api.hubspot.com/crm/v3/objects/p50525536_games?properties=name,genre,year";
  const headers = {
    Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
    "Content-Type": "application/json",
  };
  try {
    const resp = await axios.get(contacts, { headers });
    const games = resp.data.results;
    console.dir(resp.data, { depth: null });
    res.render("homepage", { title: "Games from Hubspot", games });
  } catch (error) {
    console.error(error);
  }
});

// * Code for Route 1 goes here

// TODO: ROUTE 2 - Create a new app.get route for the form to create or update new custom object data. Send this data along in the next route.

app.get("/update-cobj", (req, res) => {
  res.render("updates", {
    title: "Update Custom Object Form | Integrating With HubSpot I Practicum",
  });
});

// TODO: ROUTE 3 - Create a new app.post route for the custom objects form to create or update your custom object data. Once executed, redirect the user to the homepage.

app.post("/update-cobj", async (req, res) => {
  const { name, year, genre } = req.body;

  try {
    const response = await axios.post(
      "https://api.hubapi.com/crm/v3/objects/p50525536_games",
      {
        properties: {
          name: name,
          year: year,
          genre: genre,
        },
      },
      {
        headers: {
          Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
          "Content-Type": "application/json",
        },
      }
    );

    console.log("Record creato:", response.data);

    // Redirect to homepage after creation
    res.redirect("/");
  } catch (error) {
    console.error(
      "Error creating record:",
      error.response?.data || error.message
    );
    res.status(500).send("Error creating record");
  }
});

// * Localhost
app.listen(3000, () => console.log("Listening on http://localhost:3000"));
