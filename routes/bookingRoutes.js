const express = require("express");
const router = express.Router();

const Booking = require("../models/booking");
const Helper = require("../models/helper");
const assignHelper = require("../utils/assignHelper");


// create booking and assign helper
router.post("/create-booking", async (req, res) =>
{
    try
    {
        const { serviceType, latitude, longitude } = req.body;

        // find best helper
        const helper = await assignHelper(serviceType, latitude, longitude);

        if(!helper)
        {
            return res.send("No helper available");
        }

        // mark helper busy
        helper.available = false;
        await helper.save();


        // create booking
        const booking = new Booking({

            serviceType: serviceType,
            userLatitude: latitude,
            userLongitude: longitude,
            helperId: helper._id,
            status: "assigned"

        });

        await booking.save();

        res.send("Helper assigned: " + helper.name);

    }
    catch(error)
    {
        console.log(error);
        res.send("Error creating booking");
    }
});


module.exports = router;


// helper response API (accept or reject)

router.post("/helper-response", async (req, res) =>
{
    try
    {
        const { bookingId, response } = req.body;

        const booking = await Booking.findById(bookingId);

        if(!booking)
        {
            return res.send("Booking not found");
        }

        const helper = await Helper.findById(booking.helperId);

        if(response === "accept")
        {
            booking.status = "accepted";
            await booking.save();

            return res.send("Helper accepted booking");
        }

        if(response === "reject")
        {
            // make current helper available again
            helper.available = true;
            await helper.save();

            // find another helper
            const newHelper = await assignHelper(
                booking.serviceType,
                booking.userLatitude,
                booking.userLongitude
            );

            if(!newHelper)
            {
                booking.status = "no helper available";
                await booking.save();

                return res.send("No other helper available");
            }

            // assign new helper
            newHelper.available = false;
            await newHelper.save();

            booking.helperId = newHelper._id;
            booking.status = "reassigned";

            await booking.save();

            return res.send("New helper assigned: " + newHelper.name);
        }

    }
    catch(error)
    {
        console.log(error);
        res.send("Error processing response");
    }
});


// get all bookings
router.get("/all", async (req, res) =>
{
    const bookings = await Booking.find();
    res.json(bookings);
});
