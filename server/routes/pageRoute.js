const express = require("express");
const { getPage, getPages } = require("../controllers/pageController");

const router = express.Router();

router.route("/").get(getPages);
router.route("/:key").get(getPage);

module.exports = router;
