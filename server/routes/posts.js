const router = require('express').Router();
const Post = require('../models/Post');
const User = require('../models/User');

//create a post
router.post('/', async (req, res) => {
    const newPost = new Post(req.body);
    try {
        const savedPost = await newPost.save();
        res.status(200).json(savedPost);
    } catch (err) {
        res.status(500).json(err);
    }
});

// update a post
router.post('/:id', async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (post.username === req.body.username) {
            await post.updateOne({ $set: req.body });
            res.status(200).json(post);
        } else {
            res.status(403).json('you can only update your own posts');
        }
    } catch (err) {
        json.status(500).json(err);
    }

});
//delete a post
router.delete('/:id', async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (post.username === req.body.username) {
            await post.deleteOne();
            res.status(200).json(post);
        } else {
            res.status(403).json('you can only delete your own posts');
        }
    } catch (err) {
        res.status(500).json(err);
    }

});
// like a post
router.post('/:id/like', async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post.likes.includes(req.body.username)) {
            await post.updateOne({ $push: { likes: req.body.username } });
            res.status(200).json('The post has been liked successfully');
        } else {
            await post.updateOne({ $pull: { likes: req.body.username } });
            res.status(200).json('The post has been unliked successfully');
        }
    } catch (err) {
        res.status(500).json(err);
    }
});
// get timeline post
router.get('/timeline/all', async (req, res) => {
    let userPosts = [];
    let friendPosts = [];
    try {
        const currentUser = await User.findOne({ username: req.body.username });
        userPosts = await Post.find({ username: currentUser.username });
        friendPosts = await Promise.all(
            currentUser.following.map(async (friendId) => {
                console.log(friendId);
                return await Post.find({ username: friendId });
            })
        )
        res.status(200).json(userPosts.concat(...friendPosts));
    } catch (err) {
        console.log(err);
        res.status(500).json(err);
    }
});
// get a post
router.get('/:id', async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        res.status(200).json(post);
    } catch (err) {
        res.status(500).json(err);
    }
});

module.exports = router;