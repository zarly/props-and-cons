
import * as express from 'express'

var router = express.Router();

router.get('/ping', function(req, res) {
    res.send({pong: true});
});

router.get('/ideas', function(req, res) {
    res.send({pong: true});
});

export default router;
