const { Transaction } = require("../../models");
const { authMiddleware } = require("../../utils/auth");
const router = require("express").Router();

router.get("/getall", authMiddleware, (req, res) => {
  Transaction.findAll({ where: { UserId: req.user.id }, order: [['date','DESC']] })
    .then((data) => {
      res.status(200).json(data);
    })
    .catch((err) => {
      res.status(500).json({ err });
    });
});

router.post("/add", authMiddleware, (req, res) => {
  Transaction.create({
    description: req.body.description,
    value: req.body.value,
    date: req.body.date,
    cleared: req.body.cleared,
    UserId: req.user.id,
  }).then((newTrans)=>{
      res.status(200).json(newTrans);
  }).catch((err)=>{
      res.status(500).json({err});
  })
});

router.put("/:id",authMiddleware,(req,res)=>{
  Transaction.update(req.body,{
    where: {
      id: req.params.id
    }
  }).then((updated)=>{
    res.status(200).json(updated)
  }).catch((err)=>{
    res.status(500).json({err})
  })
})

module.exports = router;
