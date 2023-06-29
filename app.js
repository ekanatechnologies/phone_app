const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
require("dotenv").config();

//Routes
const linkRouter = require("./routes/rating");
const authRouter = require('./routes/agentAuth.js')
const tripRouter = require('./routes/trackMyTrip.js')
const zipRouter  = require("./routes/zipCodes.js");


const admin = require('./utils.js')
const User = require('./model/Auth.js')


const app = express();

app.use(bodyParser.json({ limit: "10mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "10mb", extended: true }));
app.use(cors());

app.use("/rating", linkRouter);
app.use('/trip', tripRouter)
app.use('/', authRouter)
app.use('/zip', zipRouter);


// function to convert dd-mm-yyyy to javascript date
function convertDate(date) {
  var date = date.split("-");
  return new Date(date[2], date[1] - 1, date[0]);
}
const options = {
  priority: "high",
  timeToLive: 60 * 60 * 24,
};


//define a function which send notification to the user when his/her expiration date is expired

const sendNotification = async () => {

  try {
    console.log('sending notification')
    const dbData = await User.find()
    dbData.forEach(async (data) => {
      const convertedDate = convertDate(data.expiration_date)
      const currentDate = new Date()
      //find difference in days between current date and expiration date

      const difference = Math.ceil(Math.abs((convertedDate.getTime() - currentDate.getTime()) / (1000 * 3600 * 24)));
      console.log(difference)
      if (difference === 30) {
        const payload = {
          notification: {
            title: "Membership expiring in 30 days",
            body: `Dear ${data.agentId} your Membership is going to expire within 30 days please renew your plan to avail our services.`,
          },
        };

        await admin
          .messaging()
          .sendToDevice(data.token, payload, options)
          .then((res) => console.log(res))
      } else if (difference === 18) {
        const payload = {
          notification: {
            title: "Membership expiring in 15 days",
            body: `Dear ${data.agentId} your Membership is going to expire within 15 days please renew your plan to avail our services.`,
          },
        };
        await admin
          .messaging()
          .sendToDevice(data.token, payload, options)
          .then((res) => console.log(res))
      } else if (difference === 7) {
        const payload = {
          notification: {

            title: "Membership expiring in 7 days",
            body: `Dear ${data.agentId} your Membership is going to expire within 7 days please renew your plan to avail our services.`,
          },
        };
        await admin

          .messaging()
          .sendToDevice(data.token, payload, options)
          .then((res) => console.log(res))
      }
      else {
        return

      }
    })



  } catch (error) {
    console.log(error)

  }


}

setInterval(sendNotification, 1000 * 60 * 60 * 24)



app.get("/", (req, res) => {
  res.send("Welcome to the uiib-phone-app");
});

const PORT = process.env.PORT || 5000;

mongoose.connect('mongodb://127.0.0.1:27017/ekanatechnologies_phone', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log('Connected to DB')
    })
    .catch(err => {
        console.log(err)
    })
  .then(() =>
    app.listen(5005, () =>
      console.log(`Server Running on Port: http://localhost:${PORT}`)
    )
  )
  .catch((error) => console.log(`${error} did not connect`));
