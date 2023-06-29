const admin = require("firebase-admin");
const serviceAccount = require("./uiib-phone-app-a-firebase-adminsdk-3rtpn-0e16d43003.json");


admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
});

module.exports = admin;