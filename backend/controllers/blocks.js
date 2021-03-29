const Block = require("../models/block");

exports.createBlock = (req, res, next) => {
  const block = new Block({
    index: req.body.index,
    previousHash: req.body.previousHash,
    timestamp: req.body.timestamp,
    data: req.body.data,
    hash: req.body.hash,
    nonce: req.body.nonce,
    creator: req.userData.userId
  });
  block
    .save()
    .then(createdBlock => {
      res.status(201).json({
        message: "Block added successfully",
        block: {
          ...createdBlock,
          id: createdBlock._id
        }
      });
    })
    .catch(error => {
      res.status(500).json({
        message: "Creating a new block failed!"
      });
    });
};

exports.replaceBlock = (req, res, next) => {
  const r_block = new Block({
    _id: req.body.id,
    index: req.body.index,
    previousHash: req.body.previousHash,
    timestamp: req.body.timestamp,
    data: req.body.data,
    hash: req.body.hash,
    nonce: req.body.nonce,
    creator: req.userData.userId
  });
  console.log(r_block);
  Block
    .updateOne({ _id: req.params.id, creator: req.userData.userId }, r_block)
    .then(createdBlock => {
      res.status(201).json({
        message: "Block replaced successfully",
        block: {
          ...createdBlock,
          id: createdBlock._id
        }
      });
    })
    .catch(error => {
      res.status(500).json({
        message: "Updating a block failed!"
      });
    });
};

exports.replaceNextHash = (req, res, next) => {
  const hash_block = new Block({
    _id: req.body.id,
    previousHash: req.body.hash,
    creator: req.userData.userId
  });
  Block
    .updateOne({ _id: req.params.id, creator: req.userData.userId }, hash_block)
    .then(status => {
      res.status(201).json({
        message: "Next Block hash replaced successfully",
      });
    })
    .catch(error => {
      res.status(500).json({
        message: "updating a previous hash of block failed!"
      });
    });
};

exports.getBlocks = (req, res, next) => {
  const blockQuery = Block.find({'creator': req.params.id});
  let fetchedBlocks;

  blockQuery
    .then(documents => {
      fetchedBlocks = documents;
      return Block.count();
    })
    .then(count => {
      res.status(200).json({
        message: "Blocks fetched successfully!",
        blocks: fetchedBlocks,
        maxBlocks: count
      });
    })
    .catch(error => {
      res.status(500).json({
        message: "Fetching blocks failed!"
      });
    });
};

exports.getBlock = (req, res, next) => {
  Block.findOne({creator: req.userData.userId}).sort({index:-1})
    .then(block => {
      if (block) {
        res.status(200).json({
          message: "Block fetched",
          block: block
        });
      } else {
        res.status(404).json({ message: "Block not found!" });
      }
    })
    .catch(error => {
      res.status(500).json({
        message: "Fetching block failed!"
      });
    });
};

exports.getBlockRange = (req, res, next) => {
  var start = req.param('start');
  var end= req.param('end');

  Block.find({creator: req.userData.userId})
    .then(block => {
      if (block) {
        let mod_block = [];
        //console.log(start, end);
        for(let i=start; i<=end; i++){
          mod_block.push(block[i]);
        }
        console.log(mod_block);
        res.status(200).json({
          message: "Block fetched",
          block: mod_block
        });
      } else {
        res.status(404).json({ message: "Block not found!" });
      }
    })
    .catch(error => {
      res.status(500).json({
        message: "Fetching block failed!"
      });
    });
};
