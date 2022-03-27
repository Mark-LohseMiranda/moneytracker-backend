const { User } = require("../../models");
const { authMiddleware, signToken } = require("../../utils/auth");
const bcrypt = require("bcrypt");
const router = require("express").Router();

// LOGIN USER - GET TOKEN
router.post("/login", (req, res) => {
  User.findOne({
    where: {
      email: req.body.email,
    },
  })
    .then((foundUser) => {
      if (!foundUser) {
        res.status(401).send("incorrect email or password");
      } else if (bcrypt.compareSync(req.body.password, foundUser.password)) {
        const token = signToken(foundUser);

        res
          .status(200)
          .json({ token, message: "Logged in successfully 😊 👌" });
      } else {
        res.status(401).json({ err: "incorrect email or password" });
      }
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ err });
    });
});

// CREATE A NEW USER
router.post("/signup", (req, res) => {
    User.findOne({
      where: {
        email: req.body.email
      }
    }).then((foundUser)=>{
      if(foundUser) {
        res.status(403).send("user already exists please login")
      } else {
        User.create({
          username: req.body.username,
          password: req.body.password,
          email: req.body.email.toLowerCase(),
        })
          .then((newUser) => {
            res.json(newUser);
          })
          .catch((err) => {
            console.log(err);
            res.status(500).json({ err });
          });
      }
    }).catch((err) => {
      console.log(err);
      res.status(500).json({ err });
    });
  });


router.get("/verify", authMiddleware, (req, res) => {
  res.status(200).json(req.user);
});

router.put("/update", authMiddleware, async (req, res) => {
  if (req.body.email) {
    User.update(
      { email: req.body.email },
      { where: { email: req.user.data.email } }
    )
      .then((update) => {
        res.status(200).json(update);
      })
      .catch((err) => {
        res.status(500).json(err);
      });
  }
  if (req.body.username) {
    User.update(
      { username: req.body.username },
      { where: { username: req.user.data.username } }
    )
      .then((update) => {
        res.status(200).json(update);
      })
      .catch((err) => {
        res.status(500).json(err);
      });
  }

  if (req.body.password) {
    const newPassword = await bcrypt.hash(req.body.password, 10);

    User.update(
      { password: newPassword },
      { where: { email: req.user.data.email } }
    )
      .then((update) => {
        res.status(200).json(update);
      })
      .catch((err) => {
        res.status(500).json(err);
      });
  }
});

module.exports = router;
