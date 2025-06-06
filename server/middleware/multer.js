import multer from 'multer'

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
    // Debug log
    console.log('File details:', {
        originalname: file.originalname,
        mimetype: file.mimetype,
        fieldname: file.fieldname
    });

    // List of allowed image MIME types
    const allowedMimeTypes = [
        'image/jpeg',
        'image/jpg',
        'image/png',
        'image/gif',
        'image/webp',
        'application/octet-stream' // Sometimes files are sent with this type
    ];

    // Check both mimetype and file extension
    const isAllowedMimeType = allowedMimeTypes.includes(file.mimetype);
    const isImageExtension = /\.(jpg|jpeg|png|gif|webp)$/i.test(file.originalname);

    if (isAllowedMimeType || isImageExtension) {
        cb(null, true);
    } else {
        console.log('Rejected file:', {
            mimetype: file.mimetype,
            originalname: file.originalname
        });
        cb(new Error(`Invalid file type. File type: ${file.mimetype}, Allowed types: ${allowedMimeTypes.join(', ')}`), false);
    }
};

// Error handling middleware
const handleMulterError = (err, req, res, next) => {
    console.log('Multer error:', err);
    if (err instanceof multer.MulterError) {
        if (err.code === 'LIMIT_FILE_SIZE') {
            return res.status(400).json({
                message: 'File too large. Maximum size is 5MB'
            });
        }
        return res.status(400).json({
            message: err.message
        });
    } else if (err) {
        return res.status(400).json({
            message: err.message
        });
    }
    next();
};

const uploadFiles = multer({ 
    storage,
    fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024, // 5MB max file size
    }
}).array('files', 10);

export { uploadFiles, handleMulterError };
export default uploadFiles;