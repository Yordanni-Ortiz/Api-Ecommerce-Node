const cloudinary = require("cloudinary").v2;
const fs = require('fs');
const path = require('path');

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

// Función para subir imágenes de los productos
const uploadToCloudinary = async(localFilePath, filename) => {
    try {
        var folder = "images_ecommerce";
        var filePathOnCloudinary = folder + "/" + path.parse(filename).name;
        const result = await cloudinary.uploader.upload( 
            localFilePath, 
            { "public_id": filePathOnCloudinary }
        )
        return result;
    } catch (error) {
        console.log(error);
        return { message: "Upload to cloudinary failed" };
    } finally {
        fs.unlinkSync(localFilePath)
    }
}

// Función para eliminar imágenes de los productos
const deleteFromCloudinary = async(publicId) => {
    try {
        await cloudinary.uploader.destroy(publicId);
    } catch (error) {
        console.log(error);
        return { message: "Delete from cloudinary failed" }
    }
}

// Función para subir imágenes de perfil
const uploadToCloudinaryImagesProfile = async(localFilePath, filename) => {
    if (!localFilePath || !filename) {
        console.error('Missing file path or filename.');
        return { message: "Missing file path or filename" };
    }

    try {
        const folder = "images_profiles";
        const filePathOnCloudinary = folder + "/" + path.parse(filename).name;

        const result = await cloudinary.uploader.upload(localFilePath, {
            public_id: filePathOnCloudinary,
            folder: folder
        });

        return result;
    } catch (error) {
        console.error('Error uploading to Cloudinary:', error);
        return { message: "Upload to cloudinary failed" };
    } finally {
        if (fs.existsSync(localFilePath)) {
            fs.unlinkSync(localFilePath);
        }
    }
};

module.exports = { uploadToCloudinary, deleteFromCloudinary, uploadToCloudinaryImagesProfile };