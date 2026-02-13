const express = require("express");
const router = express.Router();

const Helper = require("../models/helper");


// API to add helper
router.post("/add-helper", async (req, res) =>
{
    try
    {
        const helper = new Helper({
            name: req.body.name,
            skills: req.body.skills,
            latitude: req.body.latitude,
            longitude: req.body.longitude,
            rating: req.body.rating,
            available: true
        });

        await helper.save();

        res.send("Helper added successfully");

    }
    catch(error)
    {
        res.send("Error adding helper");
    }
});

module.exports = router;


// get all helpers
router.get("/all", async (req, res) =>
{
    const helpers = await Helper.find();
    res.json(helpers);
});
