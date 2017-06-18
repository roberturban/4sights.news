import * as path from 'path';
const express = require('express');
const router = express.Router();

router.get(function(req, res, next) {
  res.sendFile(path.join(__dirname, '../../public/index.html'));
});

module.exports = router;
