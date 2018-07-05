const express = require("express");
const graphqlHttp = require("express-graphql");
const bodyParser = require("body-parser");
const passport = require("passport");

// Database configuration file
const config = require("./config/config");

// Load routes
const users = require("./routes/cycleapp/users");

const schema = require("./schema");

const app = express();

// Body Parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Server port
const port = require("./config/keys").port;

// Check database connection
config.sequelize
  .authenticate()
  .then(() => console.log("Database connection successful"))
  .catch(err => console.log(err));

// Sync all models
config.sequelize.sync();

// Use routes
app.use("/cycleapp/users", users);

// Passport middleware
app.use(passport.initialize());

// Passport config
require("./config/passport")(passport);

// Graphql middleware
app.use(
  "/graphql",
  graphqlHttp({
    schema: schema,
    graphiql: true
  })
);

app.listen(port, () => console.log(`Server running on port ${port}`));
