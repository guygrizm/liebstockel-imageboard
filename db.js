const spicedPg = require("spiced-pg");

const { DATABASE_USERNAME, DATABASE_PASSWORD } = process.env;
const DATABASE_NAME = "imageboard";

const db = spicedPg(
    `postgres:${DATABASE_USERNAME}:${DATABASE_PASSWORD}@localhost:5432/${DATABASE_NAME}`
);

//get images function

async function getImages() {
    const result = await db.query(`SELECT * FROM images`);
    return result.rows;
}

module.exports = {
    getImages,
};
