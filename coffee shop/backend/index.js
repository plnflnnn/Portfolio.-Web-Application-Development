const express = require('express');
const cors = require("cors");
const { MongoClient } = require('mongodb');

const app = express();
app.use(express.json());
app.use(cors());

const url = 'mongodb+srv://myDatabaseUser:D1fficultP%40ssw0rd@cluster0.example.mongodb.net/?retryWrites=true&w=majority';
const client = new MongoClient(url);

const dbName = 'coffeeDB';

app.get("/best", async (req, res) => {
    await client.connect();
    const db = client.db(dbName);
    const collection = db.collection('best');
    const goods = await collection.find({}).toArray();
    res.json(goods);
});

app.get("/coffee", async (req, res) => {
    await client.connect();
    const db = client.db(dbName);
    const collection = db.collection('coffee');
    const goods = await collection.find({}).toArray();
    res.json(goods);
});

app.get("/filters", async (req, res) => {
    await client.connect();
    const db = client.db(dbName);
    const collection = db.collection('filters');
    const goods = await collection.find({}).toArray();
    res.json(goods);
});

app.listen(1000);