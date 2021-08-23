const express = require('express');
const {body} = require('express-validator');

const forumController = require('../controllers/forum');

const router = express.Router();

const validateForumHeader = () => {
     return [
          body('title').notEmpty().withMessage('Title must be filled'),
          body('content').notEmpty().withMessage('Content must be filled'),
     ]
}

const validateForumDetail = () => {
     return [
          body('content').notEmpty().withMessage('Content must be filled'),
     ]
}

router.post('/', validateForumHeader(), forumController.storeNewHeader);
router.post('/detail/:forumHeaderId', validateForumDetail() ,forumController.storeNewDetail);
router.get('/:forumHeaderId', forumController.getForumHeader);
router.get('/', forumController.getAllForumHeaders);
router.get('/detail/:forumHeaderId', forumController.getAllForumDetails);
router.put('/:forumHeaderId', validateForumHeader(), forumController.updateForumHeader);
router.put('/detail/:forumDetailId', validateForumDetail(), forumController.updateForumDetail);
router.delete('/:forumHeaderId', forumController.deleteForumHeader);
router.delete('/detail/:forumDetailId', forumController.deleteForumDetail);

module.exports = router;