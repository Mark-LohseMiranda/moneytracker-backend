const { Transaction } = require("../../models");
const { authMiddleware } = require("../../utils/auth");
const router = require("express").Router();

router.get("/getall", authMiddleware, (req, res) => {
  Transaction.findAll({
    where: { UserId: req.user.id },
    order: [["date", "DESC"]],
  })
    .then((data) => {
      res.status(200).json(data);
    })
    .catch((err) => {
      res.status(500).json(err);
    });
});

router.get("/getone/:id", authMiddleware, (req, res) => {
  try {
    Transaction.findOne({
      where: {
        id: req.params.id,
        UserId: req.user.id,
      },
    })
      .then((data) => {
        if (!data) {
          res
            .status(403)
            .json({ message: "Not your transaction or transaction not found" });
          return;
        }
        res.status(200).json(data);
      })
      .catch((err) => {
        res.status(500).json(err);
      });
  } catch (err) {
    res.status(500).json(err);
  }
});

router.post("/add", authMiddleware, (req, res) => {
  Transaction.create({
    description: req.body.description,
    value: req.body.value,
    date: req.body.date,
    cleared: req.body.cleared,
    UserId: req.user.id,
  })
    .then((newTrans) => {
      res.status(200).json(newTrans);
    })
    .catch((err) => {
      res.status(500).json(err);
    });
});

router.put("/:id", authMiddleware, async (req, res) => {
  try {
    const Transupdate = await Transaction.update(req.body, {
      where: {
        id: req.params.id,
        UserId: req.user.id,
      },
    });
    if (!Transupdate[0]) {
      res
        .status(403)
        .json({ message: "Not your transaction or transaction not found" });
      return;
    }
    res.status(200).json(Transupdate);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const Transdelete = await Transaction.destroy({
      where: {
        id: req.params.id,
        UserId: req.user.id,
      },
    });
    if (!Transdelete) {
      res
        .status(403)
        .json({ message: "Not your transaction or transaction not found" });
      return;
    }
    res.status(200).json(Transdelete);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
