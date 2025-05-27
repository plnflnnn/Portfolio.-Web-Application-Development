import dotenv from 'dotenv';
import pg from "pg";
import express from "express";
import bodyParser from "body-parser";
import cors from 'cors';
import Stripe from 'stripe';

dotenv.config()
const app = express();
const port = 3200;
const appUrl = 'http://localhost:3000';
const stripeSecretKey = process.env.STRIPE_SECRET_KEY;

const stripe = new Stripe(stripeSecretKey);

app.use(express.json());

app.use(
  cors({
    origin: "http://localhost:3000"
  })
)

const db = new pg.Client({
  user: "postgres",
  host: "localhost",
  database: "houseStoreDB",
  password: process.env.PASSWORD,
  port: 5432,
});

db.connect();

app.use(bodyParser.urlencoded({ extended: true }));

app.get("/all", async (req, res) => {
    const result = await db.query(
      "SELECT * FROM grocery_store; ");

    const data = result.rows;
    const array = [];
    Array.prototype.forEach.call(data, child => {
        array.push(child)
    });

    res.json(array);
});

app.get("/:categoryName", async(req, res) => {
  const category = req.params.categoryName;
  const result = await db.query(
    "SELECT * FROM grocery_store WHERE item_category = $1;", [category]);

  const data = result.rows;
  const array = [];
  Array.prototype.forEach.call(data, child => {
      array.push(child)
    });
  res.json(array);
})

app.post('/create-checkout-session', async (req, res) => {

  const data = req.body.itemsList;

  const session = await stripe.checkout.sessions.create({
    line_items: data,
    payment_method_types: ["card"],
    mode: 'payment',
    success_url: `${appUrl}/success`,
    cancel_url: `${appUrl}/cart`,
  });

  res.json({id:session.id});
});

app.listen(port);
