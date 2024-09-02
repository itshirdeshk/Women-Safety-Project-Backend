// src/routes/communityRoutes.js
const express = require('express');
const {
    createPost,
    getPosts,
    getPost,
} = require('../controllers/communityController');
const { protect } = require('../middleware/authMiddleware');
const { body, param } = require('express-validator');
const validate = require('../middleware/validateMiddleware');

const router = express.Router();

router.post(
    '/',
    protect,
    validate([
        body('title').not().isEmpty().withMessage('Title is required'),
        body('body').not().isEmpty().withMessage('Content is required'),
        body('category')
            .optional()
            .isIn(['Safety Tips', 'Legal Rights', 'Self-Defense', 'Mental Health', 'Other'])
            .withMessage('Invalid category'),
        body('anonymous').optional().isBoolean(),
    ]),
    createPost
);

router.get('/', getPosts);

router.get(
    '/:id',
    validate([
        param('id').isMongoId().withMessage('Invalid post ID'),
    ]),
    getPost
);

module.exports = router;
