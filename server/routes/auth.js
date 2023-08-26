const router = require("express").Router();
const User = require("../models/User");
const bcrypt = require("bcrypt");

const getHash = async () => {
    const saltRounds = 10;
    const salt = await bcrypt.genSalt(saltRounds);
    return salt;
}
//REGISTER
router.post("/register", async (req, res) => {
    try {
        const userDetails = req.body;

        // generate hashedPassword for user
        const salt = await getHash();
        const hashedPassword = await bcrypt.hash(userDetails.password, salt);

        // create new user with hashed password
        const newUser = new User({
            username: userDetails.username,
            email: userDetails.email,
            password: hashedPassword,
        })

        // save the user in DB
        const user = await newUser.save();
        res.status(200).json(user);
    } catch (error) {
        console.log(`Error occured while creating the object-, ${error}`);
        res.status(500).send(`Error occured while creating the object-, ${error}`);
    }

})

//LOGIN
router.post("/login", async (req, res) => {
    try {
        const user = await User.findOne({ email: req.body.email || '' });

        !user && res.status(404).send("user not found");

        const validUser = await bcrypt.compare(req.body.password, user.password);

        !validUser && res.status(400).send(`Unauthorised- Invalid Password`);

        res.status(200).send(`Welcome ${user.username} \n ${user}`);
    } catch (error) {
        console.log(`Error occured in login route-, ${error}`);
        // res.status(500).json(error);
    }
});

module.exports = router