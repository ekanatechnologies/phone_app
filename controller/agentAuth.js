const User = require('../model/Auth.js')
const admin = require('../utils.js')




const signin = async (req, res) => {
  const { expiration_date, device_id, token, agentId } = req.body;


  const payload = {
    notification: {
      title: "Welcome to UIIB",
      body: `Dear User ! welcome to UIIB.Thanks for installing our app. Agent ${agentId} would love to speak with you about your insurnace needs.`,
    },
  };
  const options = {
    priority: "high",
    timeToLive: 60 * 60 * 24,
  };
  try {
    if (!device_id) return res.status(401).json({ message: "Please provide your device ID to put the data classified" })
    const user = await User.findOne({ device_id })



    if (user) {
      const data = await User.findOneAndUpdate({ device_id }, { $set: { agentId: agentId, expiration_date: expiration_date, token: token } }, { new: true })


      await admin
        .messaging()
        .sendToDevice(data.token, payload, options).then((response) => console.log(response))

      return res.status(200).json({ data })
    } else {


      const data = new User({ expiration_date, device_id, token, agentId })
      await admin
        .messaging()
        .sendToDevice(data.token, payload, options).then((response) => console.log(response))
      await data.save()
      res.status(200).json({ data })
    }


  } catch (error) {
    res.status(500).json({ error })

  }
};

// const sendNotification = async (req, res) => {
//   const { agentId } = req.body;


//   try {
//     if (!agentId) return res.status(401).json({ message: "please provide your agent id " })

//     const agentData = await User.findOne({ agentId })
//     if (!agentData) return res.status(404).json({ message: "No agent with this agent Id" })
//     const token = agentData.token;

//     const date1 = new Date(agentData.expiration_date)
//     const today = new Date()
//     const daysLeft = Math.ceil(Math.abs((date1 - today)) / (1000  60  60 * 24))
//     if (daysLeft === 7) {
//       const payload = {
//         notification: {
//           title: "Membership expiring in 7 days",
//           body: `Dear ${agentId} your Membership is going to expire within 7 days please renew your plan to avail our services.`,
//         },
//       };
//       const options = {
//         priority: "high",
//         timeToLive: 60  60  24,
//       };
//       await admin
//         .messaging()
//         .sendToDevice(token, payload, options)
//         .then((res) => console.log(res))

//     }

//     res.status(200).json({ agentData })

//   } catch (error) {
//     res.status(500).send(error)

//   }

// }
module.exports = { signin };
