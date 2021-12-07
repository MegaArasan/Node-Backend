import { client } from "./index.js";
import bcrypt from "bcrypt";

async function CreateUser(data) {
  return await client.db("demo").collection("users").insertOne(data);
}

async function GetuserByName(username) {
  return await client
    .db("demo")
    .collection("users")
    .findOne({ username: username });
}

async function genpassword(password) {
  const NO_OF_ROUNDS = 10;
  const salt = await bcrypt.genSalt(NO_OF_ROUNDS);
  const hashedpassword = await bcrypt.hash(password, salt);
  console.log(hashedpassword);
  return hashedpassword;
}

export { CreateUser, GetuserByName, genpassword };
