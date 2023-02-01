require("dotenv").config();
const spicedPg = require("spiced-pg");

const { DATABASE_USERNAME, DATABASE_PASSWORD } = process.env;
console.log(DATABASE_USERNAME);
console.log(DATABASE_PASSWORD);

const DATABASE_NAME = "imageboard";

const db = spicedPg(
    `postgres:${DATABASE_USERNAME}:${DATABASE_PASSWORD}@localhost:5432/${DATABASE_NAME}`
);

//get images function

async function getImages() {
    const result = await db.query(`SELECT * FROM images 
    ORDER BY id DESC
    LIMIT 4`);
    return result.rows;
}

//create images function

async function createImage({ url, username, title, description }) {
    const result = await db.query(
        `
    INSERT INTO images (url, username, title, description)
    VALUES ($1, $2, $3, $4)
    RETURNING *
  `,
        [url, username, title, description]
    );
    return result.rows[0];
}

// get image by ID

async function getImageById(id) {
    const result = await db.query(
        `
    SELECT * FROM images
    WHERE id = $1
    `,
        [id]
    );
    return result.rows[0];
}

async function getMoreImages(lowestId) {
    const result = await db.query(
        `
      SELECT id, title, url, (
            SELECT id FROM images
            ORDER BY id ASC
            LIMIT 1
        ) AS "lowestId" FROM images
        WHERE id < $1
        ORDER BY id DESC
        LIMIT 4;
    `,
        [lowestId]
    );
    return result.rows;
}

// comments

// add a comment

async function addComment({ username, comment, image_id }) {
    const result = await db.query(
        `
    INSERT INTO comments(username, comment, image_id)
    VALUES($1,$2,$3)
    RETURNING *
    `,
        [username, comment, image_id]
    );
    return result.rows[0];
}

// get comments by id
async function getCommentsById(image_id) {
    const result = await db.query(
        `
    SELECT * FROM comments
    WHERE image_id = $1
    `,
        [image_id]
    );
    return result.rows;
}

module.exports = {
    getImages,
    createImage,
    getImageById,
    addComment,
    getCommentsById,
    getMoreImages,
};
