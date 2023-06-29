const axios = require("axios");
const Ratings = require("../model/rating")

const addRatingLink = async (req, res) => {
  const { agentId, ratingLink } = req.body;

  try {

    if (!agentId)
      return res.status(401).json({
        message: "Unauthorized ! please enter valid userID and Password ",
      });
    const existingRating = await Ratings.findOne({ agentId })
    if (existingRating) return res.status(403).json({ message: "You have already added" })
    const ratingToSave = new Ratings({ agentId, ratingLink })
    await ratingToSave.save()

    res.status(200).json(ratingToSave);
  } catch (err) {
    res.status(500).json(err.message)
  }
};

const getRatingLink = async (req, res) => {
  const { agentId } = req.params

  try {
    if (!agentId) return res.status(401).json({ message: "Unauthorized access or wrong agentId" })
    const Link = await Ratings.findOne({ agentId })
    if (!Link) return res.status(404).json({ message: "There is No Link with this agent " })
    res.status(200).json(Link)

  } catch (error) {
    res.send(error)

  }
}
module.exports = { addRatingLink, getRatingLink };
