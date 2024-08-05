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

const uploadProfileImage = (req, res) => {
    const form = new formidable.IncomingForm({
        uploadDir: path.join(__dirname, '../../uploads'), // Ruta donde se guardarán los archivos temporales
        keepExtensions: true, // Mantener las extensiones del archivo
        multiples: false // Si esperas un solo archivo
    });

    form.parse(req, async (err, fields, files) => {
        if (err) {
            console.error('Error parsing the file:', err);
            return res.status(500).json({ message: 'Error parsing the file' });
        }

        // Obtener el archivo subido
        const fileArray = files.profileImage; // Aquí es un array
        if (!fileArray || fileArray.length === 0) {
            console.error('No file or file path provided');
            return res.status(400).json({ message: 'No file uploaded' });
        }

        // Asumimos que el primer archivo en el array es el que necesitamos
        const file = fileArray[0];
        if (!file.filepath) {
            console.error('No file path provided');
            return res.status(400).json({ message: 'No file path' });
        }

        try {
            // Subir a Cloudinary
            const cloudinaryResult = await uploadToCloudinaryImagesProfile(file.filepath, file.originalFilename);

            // Eliminar archivo local después de subirlo a Cloudinary
            if (fs.existsSync(file.filepath)) {
                fs.unlinkSync(file.filepath);
            }

            // Obtener el ID del usuario del token JWT (esto asume que estás utilizando autenticación JWT)
            const authHeader = req.headers.authorization;
            if (!authHeader) return res.status(401).json({ message: "Authorization header missing" });

            const token = authHeader.split(" ")[1];
            if (!token) return res.status(401).json({ message: "Token missing" });

            const decoded = jwt.verify(token, process.env.TOKEN_SECRET);
            const userId = decoded.user.id;

            // Actualizar el usuario en la base de datos con la nueva URL de la imagen de perfil
            const user = await User.findByPk(userId);
            if (!user) return res.status(404).json({ message: "User not found" });

            user.profileImageUrl = cloudinaryResult.secure_url;
            await user.save();

            // Devolver la URL de la imagen cargada
            res.status(200).json({
                profileImageUrl: cloudinaryResult.secure_url
            });
        } catch (error) {
            console.error('Error uploading to Cloudinary:', error);
            res.status(500).json({ message: 'Error uploading to Cloudinary' });
        }
    });
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