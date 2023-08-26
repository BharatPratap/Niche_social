const User = require('../models/User');
const router = require('express').Router();
const bcrypt = require("bcrypt");

//update user
router.put("/:id", async (req, res) => {
    if (req.body.username === req.params.id || req.body.isAdmin) {
        if (req.body.password) {
            try {
                const salt = await getHash();
                const hashedPassword = await bcrypt.hash(req.body.password, salt);
            } catch (err) {
                console.log(err);
                return res.status(500).json('error while generating the hash');
            }
        }

        if (req.body)

            try {
                const user = await User.findOneAndUpdate({ username: req.body.username }, {
                    $set: req.body
                })
                console.log(user);
                res.status(200).json('details updated');
            } catch (err) {
                console.log(err);
                return res.status(500).json('error while updating the user');
            }

    } else {
        return res.status(403).json('You can update only your account details.');
    }
});
//delete user
router.delete("/:id", async (req, res) => {
    if (req.body.username === req.params.id || req.body.isAdmin) {
        try {
            const user = await User.findOneAndDelete({ username: req.body.username })
            console.log(user);
            res.status(200).json('details deleted');
        } catch (err) {
            console.log(err);
            return res.status(500).json('error while deleting the user');
        }

    } else {
        return res.status(403).json('You can delete only your account details.');
    }
});
//get a user
router.get("/:id", async (req, res) => {
    try {
        const user = await User.findOne({ username: req.body.username })
        const { _id, password, updatedAt, createdAt, isAdmin, ...other } = user._doc
        res.status(200).json(other);
    } catch (err) {
        console.log(err);
        return res.status(500).json('error while getting the user');
    }

});
//follow a user
router.put('/:id/follow', async (req, res) => {
    if (req.body.username !== req.params.id) {
        try {
            const currentUser = await User.findOne({ username: req.params.id });
            const user = await User.findOne({ username: req.body.username });
            console.log(user.followers);
            if (!user.followers.includes(req.params.id)) {
                await User.updateOne({ username: req.body.username }, {
                    $push: { followers: req.params.id }
                });
                await User.updateOne({ username: req.params.id }, {
                    $push: { following: req.body.username }
                });
                res.status(200).json(`${currentUser.username} is now following ${req.body.username}`);
            } else {
                res.status(403).json('you are already following this user');
            }
        } catch (er) {
            res.status(500).json(err);
        }
    } else {
        res.status(403).json('you can\'t follow yourself');
    }
});
//unfollow a user
router.put('/:id/unfollow', async (req, res) => {
    if (req.body.username !== req.params.id) {
        try {
            const currentUser = await User.findOne({ username: req.params.id });
            const user = await User.findOne({ username: req.body.username });
            if (!currentUser.following.includes(req.params.id)) {
                await User.updateOne({ username: req.body.username }, {
                    $pull: { followers: req.params.id }
                });
                await User.updateOne({ username: req.params.id }, {
                    $pull: { following: req.body.username }
                });
                res.status(200).json(`${currentUser.username} has now unfollowed ${req.body.username}`);
            } else {
                res.status(403).json('you already don\'t follow this user');
            }
        } catch (er) {
            res.status(500).json(err);
        }
    } else {
        res.status(403).json('you can\'t follow yourself');
    }
});



module.exports = router;