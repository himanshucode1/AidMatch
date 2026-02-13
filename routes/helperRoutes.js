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
        console.log(error);
        res.status(500).send("Error adding helper");
    }
});


// get all helpers
router.get("/all", async (req, res) =>
{
    try
    {
        const helpers = await Helper.find();
        res.json(helpers);
    }
    catch(error)
    {
        res.status(500).send("Error fetching helpers");
    }
});


// Update helper live location
router.post("/update-location", async (req, res) =>
{
    try
    {
        const { helperId, latitude, longitude } = req.body;

        if(!helperId || latitude == null || longitude == null)
        {
            return res.status(400).send("Missing required fields");
        }

        const helper = await Helper.findById(helperId);

        if(!helper)
        {
            return res.status(404).send("Helper not found");
        }

        helper.latitude = latitude;
        helper.longitude = longitude;

        await helper.save();

        res.send("Helper location updated successfully");
    }
    catch(error)
    {
        console.log(error);
        res.status(500).send("Error updating helper location");
    }
});


// IMPORTANT: export must be LAST line
module.exports = router;
