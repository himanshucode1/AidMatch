const Helper = require("../models/helper");


// function to calculate distance
function calculateDistance(lat1, lon1, lat2, lon2)
{
    const R = 6371; // Earth's radius in km

    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;

    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * Math.PI / 180) *
        Math.cos(lat2 * Math.PI / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    const distance = R * c;

    return distance;
}



// main assignment function
async function assignHelper(serviceType, userLat, userLon)
{
    try
    {
        // find helpers with required skill and available
        const helpers = await Helper.find({
            skills: serviceType,
            available: true
        });


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

            // score based on distance and rating
            const score = distance - helper.rating;

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
        console.log(error);
        return null;
    }
}


module.exports = assignHelper;
