const express = require("express");
const path = require("path");
const Valuables = require("../model/valuables.js");
const fs = require("fs");
const { v4: uuidv4 } = require("uuid");

const mongoose = require("mongoose");

const router = express.Router();

const multer = require("multer");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    if (file.fieldname === "image") {
      cb(null, path.join(__dirname, "../uploads/"));
    } else if (file.fieldname === "audio") {
      cb(null, path.join(__dirname, "../uploads/audios"));
    } else {
      cb(null, path.join(__dirname, "../uploads/"));
    }
  },
  filename: (req, file, cb) => {
    cb(null, `${uuidv4()}${new Date().toDateString()}${file.originalname}`);
  },
});

// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, path.join(__dirname, "../resources/"));
//   },
//   filename: (req, file, cb) => {
//     cb(null, new Date().toDateString() + file.originalname);
//   },
// });
const fileFilter = (req, file, cb) => {
  // reject a file
  if (
    file.mimetype === "image/jpeg" ||
    file.mimetype === "image/png" ||
    file.mimetype === "audio/mpeg"
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 5,
  },
  fileFilter: fileFilter,
});

router.post("/create", upload.array("image", 5), async (req, res) => {
  const { agentId, title, rec, value, price, record_brief, tab } = req.body;
  const files = req.files;
  const imagePath = files.map((item) => item.path);

  try {
    // if (!agentId || !title)
    //   return res.status(400).json({ message: "please Provide agentId!!!" });
    const data = new Valuables({
      agentId,
      title,
      value,
      imagePath,
      record_brief,
      price,
      rec,
      tab,
    });
    let mypath = String(data.imagePath).substring(36);
    let tosend = `https://ekanatechnologies.in/${mypath}`;
    data.imagePath = tosend;
    await data.save();

    res.status(201).json({ data });
  } catch (error) {
    res.status(500).send(error);
    // console.log(error);
  }
});

router.get("/get", async (req, res) => {
  const { agentId } = req.params;

  try {
    // if (!agentId)
    //   return res
    //     .status(401)
    //     .json({ message: "please provide a valid agent id" });
    const valuables = await Valuables.find(agentId);

    if (valuables.length === 0)
      return res
        .status(404)
        .json({ message: "You don't have valuables .. Please create one" });

    ///// Deleting data from server Directory which is more than 7 days;

    const DateToDelete = new Date();
    DateToDelete.setDate(DateToDelete.getDate() - 7);

    // let imagPath = valuables.map((valuable) => valuable.imagePath);
    // for (let index = 0; index < imagPath.length; index++) {
    //   let originalPath = String(imagPath[index]);
    //   if (originalPath.includes(String(DateToDelete.toDateString()))) {
    //     fs.unlink(originalPath, function (err) {
    //       if (err) {
    //         throw err;
    //       } else {
    //         console.log("Successfully deleted the file.");
    //       }
    //     });
    //   } else {
    //     console.log("No media file to delete ");
    //   }
    // }
    // let voicePath = valuables.map((valuable) => valuable.audioPath);
    // for (let index = 0; index < voicePath.length; index++) {
    //   let originalPath = String(voicePath[index]);
    //   if (originalPath.includes(String(DateToDelete.toDateString()))) {
    //     fs.unlink(originalPath, function (err) {
    //       if (err) {
    //         throw err;
    //       } else {
    //         console.log("Successfully deleted the file.");
    //       }
    //     });
    //   } else {
    //     console.log("No media file to delete");
    //   }
    // }

    // /// deleting the Data from database which is older than 7 days

    // const deleteDocument = async () => {
    //   let delDays = new Date(DateToDelete);
    //   const docToDelete = await Valuables.find({ createdAt: { $lt: delDays } });

    let imagePath = valuables.map((valuable) => valuable.imagePath);
    // let baseimage = [];

    for (let index = 0; index < imagePath.length; index++) {
      imagePath[index].map((item) => {
        if (String(item).includes(String(DateToDelete.toDateString()))) {
          fs.unlinkSync(item);
        } else {
          console.log("No files for today to delete");
        }
      });
    }

    /// Deleting the Data from database which is older than 7 days

    const documentToDelete = await Valuables.find({
      createdAt: {
        $lt: new Date(DateToDelete),
      },
    });
    if (documentToDelete.length !== 0) {
      documentToDelete.map(async (document) => {
        await Valuables.findByIdAndRemove(document._id);
      });
    }

    res.status(200).json({ valuables });
  } catch (error) {
    res.status(400).json({ error });
  }
});
router.get("/delete/:id", async (req, res) => {
  const { id } = req.params;
  try {
    if (!id) return res.status(404).send(`Please provide a correct Object ID`);
    const valuable = await Valuables.findById(id);
    if (valuable !== null) {
      const imagePath = String(valuable.imagePath);
      let toDel = imagePath.substring(28, 150);
      let str2 = "./public_html.";
      console.log(str2.concat(toDel));

      // ///// Deleting Image from Server directory;
      // imagePath && fs.unlinkSync();
      await Valuables.findByIdAndRemove(id);
    } else {
      return res
        .status(404)
        .json({ message: `No valuable exists with the id: ${id}` });
    }

    res.json({ message: "Valuable deleted successfully." });
  } catch (error) {
    console.log(error);
  }
});

module.exports = router;
