import express from "express";
import { auth } from "../middleware/auth.js";
import { client } from "../index.js";
import { Getuser } from "../helperfunctions.js";
import { ObjectId } from "mongodb";
const router = express.Router();

router.route("/").get(async (req, res) => {
  const result = await client
    .db("pizzadelivery")
    .collection("pizzas")
    .find({})
    .toArray();
  res.send(result);
});
router.route("/").post(async (req, res) => {
  const data = req.body;
  //   console.log(data);
  const result = await client
    .db("pizzadelivery")
    .collection("pizzas")
    .insertMany(data);
  res.send(result);
});

router.route("/add-to-cart").post(async (req, res) => {
  const data = req.body;
  // console.log(data);
  const result = await client
    .db("pizzadelivery")
    .collection("cart")
    .insertOne(data);
  res.send(result);
});
router.route("/add-to-cart").get(async (req, res) => {
  const id = req.header("x-auth-token");
  const user = await Getuser({ _id: ObjectId(id) });
  // console.log(user);
  const cart = await client
    .db("pizzadelivery")
    .collection("cart")
    .find({ username: user.username })
    .toArray();
  // console.log(cart);
  res.send(cart);
});
router.route("/product/:id").delete(async (req, res) => {
  const id = req.params;
  const cart = await client
    .db("pizzadelivery")
    .collection("cart")
    .deleteOne({ _id: ObjectId(id) });
  res.send(cart);
});
router.route("/payment").post(async (req, res) => {
  const data = req.body;
  const payment = await client
    .db("pizzadelivery")
    .collection("orders")
    .insertOne(data);
  res.send(payment);
});
router.route("/orderhistory").get(async (req, res) => {
  const id = req.header("x-auth-token");
  // console.log(id);
  const user = await Getuser({ token: id });
  // console.log(user);
  const orders = await client
    .db("pizzadelivery")
    .collection("orders")
    .find({ username: user.username })
    .toArray();
  // console.log(orders);
  res.send(orders);
});
router.route("/order/:id").delete(async (req, res) => {
  const id = req.params;
  const order = await client
    .db("pizzadelivery")
    .collection("orders")
    .deleteMany({ _id: ObjectId(id) });
  res.send(order);
});

export const pizzaRouter = router;
