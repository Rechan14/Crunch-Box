const db = require('../_helpers/db'); 
const Upload = db.Upload; //  Ensure db.Upload is correctly defined

if (!Upload) {
    console.error(" Upload model is undefined. Check your db.js file.");
}

module.exports = {
    create,
    getById,
    getAll,
    deleteById
};

//  Create new image entry in the database
async function create(imageData) {
    try {
        console.log("Creating Image Entry in DB:", imageData);
        
        // Fix: Ensure Upload model is referenced from db
        if (!db.Upload) {
            throw new Error("Upload model is not defined! Check db.js.");
        }

        const savedImage = await db.Upload.create(imageData);

        if (!savedImage) {
            throw new Error("Failed to save image to DB!");
        }

        console.log("Image successfully saved to DB:", savedImage);
        return savedImage;
    } catch (error) {
        console.error("Error saving image to DB:", error);
        throw error;
    }
}

module.exports = { create };

//  Retrieve an image by ID
async function getById(id) {
    try {
        return await Upload.findByPk(id);
    } catch (error) {
        console.error(" Error retrieving image:", error);
        throw error;
    }
}

//  Retrieve all images
async function getAll() {
    try {
        return await Upload.findAll();
    } catch (error) {
        console.error(" Error retrieving all images:", error);
        throw error;
    }
}

//  Delete an image by ID
async function deleteById(id) {
    try {
        const image = await Upload.findByPk(id);
        if (!image) throw new Error('Image not found');

        await image.destroy();
        console.log(" Image deleted:", id);
    } catch (error) {
        console.error(" Error deleting image:", error);
        throw error;
    }
}

