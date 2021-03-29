const express = require("express");

const BlockController = require("../controllers/blocks");

const checkAuth = require("../middleware/check-auth");

const router = express.Router();

router.post("", checkAuth, BlockController.createBlock);

router.put("/:id", checkAuth, BlockController.replaceBlock);

router.put("/nextPrev/:id", checkAuth, BlockController.replaceNextHash);

router.get("/block", checkAuth, BlockController.getBlock);

router.get("/block_range", checkAuth, BlockController.getBlockRange);

router.get("/:id", BlockController.getBlocks);

module.exports = router;
