const Helper = require("../models/helper");


// function to calculate distance
function calculateDistance(lat1, lon1, lat2, lon2)
{
    const dx = lat1 - lat2;
    const dy = lon1 - lon2;

    return Math.sqrt(dx * dx + dy * dy);
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
