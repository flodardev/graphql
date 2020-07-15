const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const { graphqlHTTP } = require("express-graphql");
const { schema, root } = require("./schema/schema");
require("dotenv").config();

const app = express();
app.use(cors());

// Mongoose connect
mongoose.connect(process.env.MONGODB_URL, {
	useNewUrlParser: true,
	useUnifiedTopology: true,
});
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", function () {
	console.log("Connected to database.");
});

// Middlewares
app.use(
	"/graphql",
	graphqlHTTP({
		schema,
		rootValue: root,
		graphiql: true,
	}),
);

app.listen(4000, () => {
	console.log("Listening on http://localhost:4000");
});
