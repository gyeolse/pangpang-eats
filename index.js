const express = require("express");
const compression = require("compression");
const methodOverride = require("method-override");
const cookieParser = require("cookie-parser");

const cors = require("cors");

const PORT = 3001;

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(compression()); //compress and save the data.
app.use(methodOverride()); //to use a 'DELETE' method, add this pkg.
app.use(cookieParser()); //cookie-parser
app.use(cors());

app.listen(PORT, () => {
  console.log(`pangpang Eats Server listening on port ${PORT}`);
});

//ROUTES

require("./src/Routes/boardRoutes")(app);
