import express from "express";
import { MongoClient } from "mongodb";
import dotenv from "dotenv";
import bcrypt from "bcrypt";
import { CreateUser, GetuserByName, genpassword } from "./userfunctions.js";
import cors from "cors";

const app = express();
dotenv.config();
app.use(cors()); //thid party middleware

const PORT = process.env.PORT;
const MONGO_URL = process.env.MONGO_URL;

async function createConnection() {
  const client = new MongoClient(MONGO_URL);
  await client.connect();
  console.log("mongodb is connected");
  return client;
}

export const client = await createConnection();
app.use(express.json());

app.get("/", (request, response) => {
  response.send("Hello World!!!");
});

app.post("/login", async (request, response) => {
  const { username, password } = request.body;
  const userfromDB = await GetuserByName(username);

  if (!userfromDB) {
    response.status(400).send({ message: "Invalid Credential" });
    return;
  }
  const storedpassword = userfromDB.password;
  console.log(storedpassword);

  const ispasswordmatch = await bcrypt.compare(password, storedpassword);
  console.log(ispasswordmatch);
  console.log(userfromDB);
  response.status(200).send("login Successful");
});

app.post("/signup", async (request, response) => {
  const data = request.body;
  const username = data.username;
  const password = data.password;
  const firstname = data.firstname;
  const lastname = data.lastname;
  const phoneno = data.phoneno;
  const email = data.email;

  const userfromDB = await GetuserByName(username);
  console.log(userfromDB);
  if (userfromDB) {
    response.send({ message: "username already exists" });
    return;
  }
  if (password.length < 8) {
    response.send({ message: "password must be longer" });
    return;
  }

  const hashedpassword = await genpassword(password);
  const result = await CreateUser({
    firstname: firstname,
    username: username,
    lastname: lastname,
    phoneno: phoneno,
    email: email,
    password: hashedpassword,
  });
  response.send(result);
});



// const pizzas = [
//   {
//     name: "PEPPER BARBECUE CHICKEN",
//     varients: ["small", "medium", "large"],
//     prices: [
//       {
//         small: 200,
//         medium: 350,
//         large: 400,
//       },
//     ],
//     category: "nonveg",
//     image: "https://www.dominos.co.in/files/items/Pepper_Barbeque.jpg",
//     description: "Pepper Barbecue Chicken I Cheese",
//   },
//   {
//     name: "Non Veg Supreme",
//     varients: ["small", "medium", "large"],
//     prices: [
//       {
//         small: 200,
//         medium: 350,
//         large: 400,
//       },
//     ],
//     category: "nonveg",
//     image: "https://www.dominos.co.in/files/items/Non-Veg_Supreme.jpg",
//     description:
//       "Bite into supreme delight of Black Olives, Onions, Grilled Mushrooms, Pepper BBQ Chicken, Peri-Peri Chicken, Grilled Chicken Rashers",
//   },
//   {
//     name: "Golden Corn Pizza",
//     varients: ["small", "medium", "large"],
//     prices: [
//       {
//         small: 180,
//         medium: 250,
//         large: 360,
//       },
//     ],
//     category: "veg",
//     description:
//       "Corn over the base makes it look beautiful. It is served with tomato sauce and chili flakes are sprinkled over the topping according the taste. After mixing all the ingredients, it is baked by adding cheese and corn for added flavor to pizza. Corn adds health and sweet taste to the pizza.",
//     image: "https://www.crazymasalafood.com/wp-content/images/golden-1.jpg",
//   },
//   {
//     name: "Jalapeno & Red Paprika Pizza",
//     varients: ["small", "medium", "large"],
//     prices: [
//       {
//         small: 200,
//         medium: 300,
//         large: 420,
//       },
//     ],
//     category: "veg",
//     image: "https://www.crazymasalafood.com/wp-content/images/jalepeno.jpg",
//     description:
//       "This pizza is amazing and can become more delicious if we will add some more cheese in it. Ingredients are yeast, sugar, olive oil, salt, and all-purpose flour in a big bowl. After mixing all the ingredients, it is baked by adding Jalapeno and Paprika with corns over the cheese layer. The base is made crunchy to give it best taste. It can be made more tasty by sprinkling chili flakes and Oregano as per the taste.",
//   },
//   {
//     name: "Margerita",
//     varients: ["small", "medium", "large"],
//     prices: [
//       {
//         small: 150,
//         medium: 220,
//         large: 300,
//       },
//     ],
//     category: "veg",
//     image:
//       "https://cdn.loveandlemons.com/wp-content/uploads/2019/09/margherita-pizza-500x500.jpg",
//     description:
//       "The pizza base is made by mixing yeast, sugar, olive oil, salt, and all-purpose flour in a big bowl. After mixing all the ingredients, it is baked by adding the cheese as topping over it. The base is perfectly prepared by adding single layer of cheese over it. It is mouth-watering pizza for cheese lovers.",
//   },
//   {
//     name: "Double Cheese Margherita Pizza",
//     varients: ["small", "medium", "large"],
//     prices: [
//       {
//         small: 250,
//         medium: 380,
//         large: 500,
//       },
//     ],
//     category: "veg",
//     image: "https://www.crazymasalafood.com/wp-content/images/double-1.jpg",
//     description:
//       "This is a plain pizza which have cheese on it which is margherita and is delicious because of the loads of cheese. After mixing all the ingredients, it is baked by adding the cheese as topping over it. The base is perfectly prepared by adding double layer of cheese over it",
//   },
// ];
app.get("/pizzas", async (request, response) => {
  const result = await client
    .db("demo")
    .collection("pizzas")
    .find({})
    .toArray();
  response.send(result);
});
app.post("/pizzas", async (request, response) => {
  const data = request.body;
  console.log(data);
  const result = await client.db("demo").collection("pizzas").insertMany(data);
  response.send(result);
});

app.listen(PORT, () => console.log("App is started in ", PORT));