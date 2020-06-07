import multer from 'multer';
import path from 'path';
import { randomBytes, createHash } from 'crypto';

export default {
    storage: multer.diskStorage({
        destination: path.resolve(__dirname, '..', '..', 'uploads', 'points'),
        filename(request, file, callback) {
            const salt = randomBytes(8).toString('hex');
            const hash = createHash('sha256').update(file.originalname).digest('hex');
            const extension = '.' + file.mimetype.split('/').pop();

            const filename = salt + hash + extension;

            callback(null, filename);
        }
    }),
}