const express = require("express");
const graphqlHttp = require("express-graphql");
const bodyParser = require("body-parser");
const passport = require("passport");

// Database configuration file
const config = require("./config/config");

// Load routes
const members = require("./routes/cycleapp/members");
const cycles = require("./routes/cycleapp/cycles");
const semesters = require("./routes/cycleapp/semesters");

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

// Use routes
app.use("/cycleapp/members", members);
app.use("/cycleapp/cycles", cycles);
app.use("/cycleapp/semesters", semesters);

// Sync all models
config.sequelize.sync();

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
