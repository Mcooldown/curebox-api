const express = require('express');
const {body} = require('express-validator');

const router = express.Router();
const articleController = require('../controllers/article');

const validateInput = () => {
     return [
     body('title').notEmpty().withMessage('Article title must be filled'),
     body('content').notEmpty().withMessage('Article content must be filled'),
     ];
}

router.post('/', validateInput(), articleController.storeArticle);
router.get('/', articleController.getAllArticles);
router.get('/user/:userId', articleController.getUserArticles);
router.get('/:articleId', articleController.getArticleDetail);
router.put('/:articleId', validateInput() , articleController.updateArticle);
router.delete('/:articleId', articleController.deleteArticle);

module.exports = router;