const Helper = require("../models/helper");


// Accurate GPS distance calculation using Haversine formula
function calculateDistance(lat1, lon1, lat2, lon2)
{
    const R = 6371; // Earth's radius in kilometers

    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;

    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * Math.PI / 180) *
        Math.cos(lat2 * Math.PI / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c; // distance in km
}



// Main assignment function
async function assignHelper(serviceType, userLat, userLon)
{
    try
    {
        // Find helpers with required skill and available status
        const helpers = await Helper.find({
            skills: serviceType,
            available: true
        });

        // If no helpers available
        if(helpers.length === 0)
        {
            return null;
        }

        let bestHelper = null;
        let bestScore = Infinity;

        helpers.forEach(helper =>
        {
            const distance = calculateDistance(
                userLat,
                userLon,
                helper.latitude,
                helper.longitude
            );

            // Improved scoring logic
            // Distance is primary factor, rating improves helper priority
            const score = distance - (helper.rating * 0.5);

            // Select helper with best score
            if(score < bestScore)
            {
                bestScore = score;
                bestHelper = helper;
            }
        });

        return bestHelper;
    }
    catch(error)
    {
        console.error("Error assigning helper:", error);
        return null;
    }
}


module.exports = assignHelper;
