const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config();
const port = process.env.PORT || 4000;
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");

app.use(cors());
app.use(express.json());
app.get("/", (req, res) => {
  res.send("this is server of assignment 10");
});

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.tyigyp7.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // await client.connect();

    const database = client.db("dreamVenture");
    const touristSpots = database.collection("touristSpots");
    const feedback = database.collection("feedback");
    const countries = database.collection("countries");


    app.get("/spots", async (req, res) => {
      const cursor = touristSpots.find();
      const result = await cursor.toArray();
      res.send(result);
    });

    app.get("/feedback", async (req, res) => {
      const cursor = feedback.find();
      const result = await cursor.toArray();
      res.send(result);
    });

    app.get("/countries", async (req, res) => {
      const cursor = countries.find();
      const result = await cursor.toArray();
      res.send(result);
    });

    app.get("/myCountries/:name", async (req, res) => {
      const country = req.params.name;
      const query = {Country : country}
      const data = await touristSpots.find(query);
      const result = await data.toArray()
      res.send(result)
    });

    app.get("/spots/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await touristSpots.findOne(query);
      res.send(result);
    });

    app.put("/spots/:id", async (req, res) => {
      const id = req.params.id;
      const {
        SpotName,
        Location,
        Photo,
        Description,
        Country,
        Cost,
        Season,
        Traveltime,
        Visitor,
      } = req.body;
      console.log(id);
      const options = { upsert: true };
      const query = { _id: new ObjectId(id) };

      const updateSpot = {
        $set: {
          SpotName,
          Location,
          Photo,
          Description,
          Country,
          Cost,
          Season,
          Traveltime,
          Visitor,
        },
      };

      const result = await touristSpots.updateOne(query, updateSpot, options);
      res.send(result);
    });

    app.get("/mySpots/:email", async (req, res) => {
      const email = req.params.email;
      const query = { Email: email };
      const data = await touristSpots.find(query);
      const result = await data.toArray();
      res.send(result);
    });

    app.post("/addSpot", async (req, res) => {
      const {
        SpotName,
        Location,
        Photo,
        Description,
        Country,
        Cost,
        Season,
        Traveltime,
        Visitor,
        Email,
        UserName,
      } = req.body;

      const touristSpot = {
        SpotName,
        Location,
        Photo,
        Description,
        Country,
        Cost,
        Season,
        Traveltime,
        Visitor,
        Email,
        UserName,
      };
      const result = await touristSpots.insertOne(touristSpot);
      res.send(result);
    });
    
    app.post("/feedback", async (req, res) => {
      const { user, email, message } = req.body;
      const userFeedback = {
        user,
        email,
        message,
      };
      const result = await feedback.insertOne(userFeedback);
      res.send(result);
    });

    app.delete("/spots/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await touristSpots.deleteOne(query)
      res.send(result)
    });

    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
