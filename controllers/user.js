const db = require("../db/index");
const dotenv = require("dotenv");
const crypto = require("crypto");

const algorithm = "aes-256-cbc";
const key = crypto.randomBytes(32);
const iv = crypto.randomBytes(16);

function encrypt(text) {
  let cipher = crypto.createCipheriv(algorithm, Buffer.from(key), iv);
  let encrypted = cipher.update(text);
  encrypted = Buffer.concat([encrypted, cipher.final()]);
  return encrypted.toString("hex");
}

exports.createUser = async (req, res) => {
  try {
    let { firstname, lastname, email, password } = req.body;
    let pass = encrypt(password);
    password = pass;

    const result = await db.query(
      "INSERT INTO users (firstname, lastname, email, userPassword) values($1, $2, $3, $4) returning *",
      [firstname, lastname, email, password]
    );
    res.status(200).send(result.rows);
  } catch (error) {
    res.status(500).send({ error: error.message || "server error" });
  }
};

exports.loginUser = async (req, res) => {
  try {
    let { email, password } = req.body;
    const result = await db.query("SELECT * FROM users WHERE email = $1", [
      email,
    ]);
    const dbUserpassword = result.rows[0].userpassword;
    let pass = encrypt(password);
    password = pass;
    console.log(`reqBodyPassword:${password}`);
    if (dbUserpassword == password) {
      res.status(200).send(result.rows);
    }
  } catch (error) {
    res.status(500).send({ error: error.message || "server error" });
  }
};

exports.updateUser = async (req, res) => {
  try {
    let { firstname, lastname, password } = req.body;

    let pass = encrypt(password);
    password = pass;

    const result = await db.query(
      "UPDATE users SET firstname = $1, lastname = $2, userPassword = $3 WHERE id = $4 returning *",
      [firstname, lastname, password, req.params.id]
    );
    if (result) {
      res.status(200).send(result.rows);
    } else {
      res.status(400).send("cannot update user's credentials");
    }
  } catch (error) {
    res.status(500).send({ error: error.message || "server error" });
  }
};
