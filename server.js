const path = require("path");
const express = require("express");
const multer = require("multer");
const uidSafe = require("uid-safe");

const app = express();
require("dotenv").config();
const { PORT = 8080 } = process.env;
const {
    getImages,
    createImage,
    getImageById,
    addComment,
    getCommentsById,
    getMoreImages,
} = require("./db");
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

// get images

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
// get images by id
app.get("/api/:id", async (req, res) => {
    console.log("req params", req.params);
    const id = req.params.id;
    const image = await getImageById(id);
    res.json(image);
    console.log("image", image);
});

// get more images

app.get("/api/images/more/:lowestId", async (req, res) => {
    const { lowestId } = req.params;
    const images = await getMoreImages(lowestId);
    res.json(images);
});

// get comments by id

app.get("/api/comments/:id", async (req, res) => {
    const id = req.params.id;
    const comments = await getCommentsById(id);
    res.json(comments);
    console.log("GET request comments", comments);
});

// add a comment

app.post("/api/comment", async (req, res) => {
    console.log("req.body", req.body);
    await addComment({ ...req.body });
    res.status(200).end();
});

app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "index.html"));
});

app.listen(PORT, () => console.log(`I'm listening on port ${PORT}`));
