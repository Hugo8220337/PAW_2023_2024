var express = require('express');
var router = express.Router();

/* GET donors listing. */
router.get('/', function(req, res, next) {
  res.render('pages/index', { title: 'Administrator Manager', pageType: 'entity' });
});

module.exports = router;