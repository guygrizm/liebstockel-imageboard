const path = require("path");
const express = require("express");
const multer = require("multer");
const uidSafe = require("uid-safe");

const app = express();
require("dotenv").config();
const { PORT = 8080 } = process.env;
const { getImages, createImage } = require("./db");
const { AWS_BUCKET } = process.env;

const s3upload = require("./s3");

const diskStorage = multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, path.join(__dirname, "uploads"));
    },
    filename: function (req, file, callback) {
        uidSafe(24).then(function (uid) {
            callback(null, uid + path.extname(file.originalname));
        });
    },
});

const uploader = multer({
    storage: diskStorage,
    limits: {
        fileSize: 2097152,
    },
});

app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.get("/api/images", async (req, res) => {
    const images = await getImages();
    res.json(images);
});

app.post("/upload", uploader.single("image"), s3upload, async (req, res) => {
    console.log("req.body: ", req.body);

    const url = `https://s3.amazonaws.com/${AWS_BUCKET}/${req.file.filename}`;
    const image = await createImage({ url, ...req.body });
    // this afternoon we will use more middleware to
    // send the image to the cloud (AWS)
    if (req.file) {
        res.json(image);
    } else {
        res.json({
            success: false,
        });
    }
});

app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "index.html"));
});

app.listen(PORT, () => console.log(`I'm listening on port ${PORT}`));
