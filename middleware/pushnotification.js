const admin = require("firebase-admin");

const serviceAccount = require("../uiib-android-app-firebase-adminsdk-713nj-114328f08b.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://uiib-android-app-default-rtdb.firebaseio.com",
});


const token = [
  "cEpV3X_VSnSdImjbCNWtZc:APA91bGjDFwRMV8W2sgnIgG3K2JKd_x9OhgKzTr_TqFfQJL7YtzO1XKrVoOkF6M1TxllaN7USWkEPJYvSCmBooKvXTQpdeUOyPe_NBHqjHPBv9CIFjFQicYnowfIhmTvzltN03xFrurt",
];

const payload = {
  notification: {
    title: "This is from node js",
    body: "this is the body part of the application",
  },
};
// See documentation on defining a message payload.
const options = {
  priority: "high",
  timeToLive: 60 * 60 * 24,
};

admin
  .messaging()
  .sendToDevice(token, payload, options)
  .then((res) => console.log(res))
  .catch((error) => console.log(error));

module.exports = admin