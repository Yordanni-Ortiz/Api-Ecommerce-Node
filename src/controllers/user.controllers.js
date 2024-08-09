const catchError = require('../utils/catchError');
const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const path = require('path');
const util = require('util');
const { uploadToCloudinaryImagesProfile } = require('../utils/cloudinary');
const formidable = require('formidable');

const getAll = catchError(async(req, res) => {
    const results = await User.findAll();
    return res.json(results);
});

const create = catchError(async(req, res) => {
    const result = await User.create(req.body);
    return res.status(201).json(result);
});

const getOne = catchError(async(req, res) => {
    const { id } = req.params;
    const result = await User.findByPk(id);
    if(!result) return res.sendStatus(404);
    return res.json(result);
});

const remove = catchError(async(req, res) => {
    const { id } = req.params;
    await User.destroy({ where: {id} });
    return res.sendStatus(204);
});

const update = catchError(async(req, res) => {
    const { id } = req.params;
    delete req.body.password;
    const result = await User.update(
        req.body,
        { where: {id}, returning: true }
    );
    if(result[0] === 0) return res.sendStatus(404);
    return res.json(result[1][0]);
});

const login = catchError(async(req, res) => {
    const { userName, password } = req.body;

    // Buscar al usuario por su nombre de usuario
    const user = await User.findOne({ where: { userName } });
    console.log("User found:", user);
    if (!user) {
        return res.status(401).json({ message: "Credentials invalid" });
    }

    // Verificar la contraseña
    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
        return res.status(401).json({ message: "Credentials invalid" });
    }
 
    // Generar el token JWT
    const token = jwt.sign(
        { user: { id: user.id, userName: user.userName } },
        process.env.TOKEN_SECRET,
        { expiresIn: '1d' }
    );

       // Devolver la respuesta con el usuario y el token
       return res.json({
           user: {
               id: user.id,
               userName: user.userName,
               firstName: user.firstName,
               lastName: user.lastName,
               email: user.email,
               phone: user.phone,
               profileImageUrl: user.profileImageUrl || process.env.DEFAULT_IMAGE_URL,
               createdAt: user.createdAt
           },
           token,
       });
});

const changePassword = catchError(async (req, res) => {
    const { currentPassword, password } = req.body;
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).json({ message: "Authorization header missing" });

    const token = authHeader.split(" ")[1];
    if (!token) return res.status(401).json({ message: "Token missing" });

    try {
        const decoded = jwt.verify(token, process.env.TOKEN_SECRET);
        const userId = decoded.user.id;

        const user = await User.findByPk(userId);
        if (!user) return res.status(404).json({ message: "User not found" });

        const isCurrentPasswordValid = await bcrypt.compare(currentPassword, user.password);
        if (!isCurrentPasswordValid) return res.status(401).json({ message: "Current password is incorrect" });

        const hashedPassword = await bcrypt.hash(password, 10);

        const result = await User.update(
            { password: hashedPassword },
            { where: { id: userId }, returning: true }
        );

        if (result[0] === 0) return res.sendStatus(404);
        return res.json({ message: "Password updated successfully" });
    } catch (error) {
        return res.status(401).json({ message: "Invalid token" });
    }
});

const uploadProfileImage = async (req, res) => {
    try {
        const form = new formidable.IncomingForm({ uploadDir: path.join(__dirname, '../../uploads'), keepExtensions: true });
        form.parse(req, async (err, fields, files) => {
            if (err || !files.profileImage) return res.status(400).json({ message: 'Error uploading file' });

            const file = files.profileImage[0];
            const cloudinaryResult = await uploadToCloudinaryImagesProfile(file.filepath, file.originalFilename);
            fs.existsSync(file.filepath) && fs.unlinkSync(file.filepath);

            const token = req.headers.authorization?.split(" ")[1];
            if (!token) return res.status(401).json({ message: "Unauthorized" });

            const decoded = jwt.verify(token, process.env.TOKEN_SECRET);
            const user = await User.findByPk(decoded.user.id);
            if (!user) return res.status(404).json({ message: "User not found" });

            // Actualiza el campo profileImageUrls
            const updatedImageUrls = [...user.profileImageUrls, cloudinaryResult.secure_url];
            user.profileImageUrls = updatedImageUrls;
            user.profileImageUrl = cloudinaryResult.secure_url;
            await user.save();

            res.status(200).json({ profileImageUrl: cloudinaryResult.secure_url, profileImageUrls: user.profileImageUrls });
        });
    } catch (error) {
        res.status(500).json({ message: 'Error uploading profile image' });
    }
};

module.exports = {
    getAll,
    create,
    getOne,
    remove,
    update,
    login,
    changePassword,
    uploadProfileImage
}