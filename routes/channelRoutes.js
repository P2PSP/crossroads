const router = require('express').Router();
const bodyParser = require('body-parser');
const cntrl = require('../controllers/channelController');
const check = require('../controllers/validators/channelValidator');

router.use(bodyParser.json());

router.get('/:channelUrl', cntrl.getChannel);
router.get('/', [check.list, cntrl.listAllChannels]);
router.post('/', [check.add, cntrl.addChannel]);
router.put('/', [check.edit, check.auth, cntrl.editChannel]);
router.delete('/', [check.remove, check.auth, cntrl.removeChannel]);

module.exports = router;
