// const cheerio = require("cheerio");
const getTripCost = async (req, res) => {
  const { agentId, coveredDistance, mpg } = req.body;
  let currentFuelPrice = req.body.currentFuelPrice || 3.5;

  try {
    if (!coveredDistance)
      return res.status(400).json({
        message: "Please provide Covered Distance . sent distance value is",
        coveredDistance,
      });
    let distanceMiles = Number(coveredDistance) / 1.609;
    distanceMiles = distanceMiles.toFixed(2);

    let totalTripCost = (Number(currentFuelPrice) / Number(mpg)) * Number(distanceMiles);
    totalTripCost = totalTripCost.toFixed(2);

    const data = {
      agentId,
      coveredDist: distanceMiles,
      fuelPrice: currentFuelPrice,
      totalTripCost,
    };

    res.status(200).json({ data });


  } catch (error) {
    console.log(error);
  }
};




module.exports = { getTripCost };
