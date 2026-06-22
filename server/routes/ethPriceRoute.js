const express = require("express");
const { getEthPrice } = require("../controllers/ethPriceController");

const router = express.Router();

router.route("/").get(getEthPrice);

module.exports = router;
