const express = require('express');
const User = require('../models/user');
const router = new express.Router();

router.post('/users', async (req, res) => {
    const user = new User(req.body);


    try {
        let existingUser = User.findOne({ email });
        if(existingUser) {
            return res.status(400).send();
        }
        await user.save();
        res.status(201).send(req.body);
    } catch (error) {
        res.status(400).send(error)
    }
})

router.post("/users/register", async (req, res) => {
    try {
      const { email, password } = req.body;
  
      let user = await User.findOne({ email });
      if (user) return res.status(400).send("User already registered.");
  
      user = new User({ email, password });
      user.password = await bcrypt.hash(user.password, 10);
      await user.save();
  
      res.send("registered");
    } catch (err) {
      console.log(err);
      res.status(500).send("Something went wrong");
    }
  });

router.post('/users/login', async (req, res) => {
    try {
        const user = await User.findByCredentials(req.body.email, req.body.password);
        res.send(user);
    } catch (error) {
        res.status(400).send()
    }
})
 
router.get('/users', async (req, res) => {
    try {
        const users = await User.find({});
        res.send(users);
    } catch (error) {
        res.status(500).send();
    }
})

router.get('/users/:id', async (req, res) => {
    const _id = req.params.id;
    try {
        const user = await User.findById(_id);
        if(!user) {
            return res.status(404).send();
        }
        res.send(user);
    } catch (error) {
        res.status(500).send();
    }
})

router.patch('/users/:id', async (req, res) => {
    const _id = req.params['id'];
    const updates = Object.keys(req.body);
    const allowedUpdates = ['name', 'email', 'password', 'age'];
    const isValidOperation = updates.every(update => allowedUpdates.includes(update));

    if(!isValidOperation) {
        return res.status(400).send({ error: 'Invalid updates!'});
    }
    
    try {
        // const user = await User.findByIdAndUpdate(_id, req.body, { new: true, runValidators: true });
        const user = await User.findById(_id);
        if(!user) {
            return res.status(404).send();
        }
        updates.forEach(update => user[update] = req.body[update])

        await user.save();
        res.status(204).send();
    } catch (error) {
        res.status(400).send();
    }
})



module.exports = router;