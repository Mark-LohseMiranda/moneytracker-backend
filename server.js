const express = require("express");
const sequelize = require("./config/connection");
const routes = require("./controllers");
const cors = require("cors");

const PORT = process.env.PORT || 3001;
const app = express();

if(process.env.NODE_ENV === 'production') {
  app.use((req, res, next) => {
    if (req.header('x-forwarded-proto') !== 'https')
      res.redirect(`https://${req.header('host')}${req.url}`)
    else
      next()
  })
}

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

//LOCAL
app.use(cors());

//DEPLOYED
// app.use(
//   cors({
//     origin: ["https://pact-for-animals.herokuapp.com"],
//   })
// );

app.use("/", routes);

sequelize.sync({ force: false }).then(function () {
  app.listen(PORT, function () {
    console.log("App listening on PORT " + PORT);
  });
});