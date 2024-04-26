/*
import { Logger } from '@nestjs/common';
import { MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface';
import { unlinkSync } from 'fs';
import { diskStorage } from 'multer';
import path, { extname, join } from 'path';
type ValidFileExtension = 'png' | 'jpg' | 'jpeg' | 'svg';
type ValidFileExtensionVideo = 'mkv' | 'mp4';
type ValidExtensions = ValidFileExtension | ValidFileExtensionVideo;
type ValidMimeType =
  | `image/${ValidFileExtension}`
  | `video/${ValidFileExtensionVideo}`;
import { v4 as uuidv4 } from 'uuid';
const FileType = require('file-type');

const validImageExtensions: ValidFileExtension[] = [
  'png',
  'jpg',
  'jpeg',
  'svg',
];
const validVideoExtensions: ValidFileExtensionVideo[] = ['mkv', 'mp4'];
const validExtensions: ValidExtensions[] = [
  ...validImageExtensions,
  ...validVideoExtensions,
];
const validMimeTypes: ValidMimeType[] | any = [
  'image/png',
  'image/jpg',
  'image/jpeg',
  'video/x-matroska',
  'video/mp4',
  'image/svg+xml',
];
export const tmpImageDirs = {
  'user-profile-image': './uploads/user-profile-images/tmp/',
  store: './uploads/store/tmp/',
  product: './uploads/product-images/tmp/',
  offer: './uploads/offer-images/tmp/',
  events: './uploads/events/tmp/',
  city: './uploads/city/tmp/',
  blogs: './uploads/blogs/tmp/',
  pages: './uploads/pages/tmp/',
  chat: './uploads/chat/tmp/',
  guide: './uploads/guide/tmp/',
  'guide-category': './uploads/guide-category/tmp/',
};
export const fileStorageConfig: MulterOptions = {
  storage: diskStorage({
    destination: (req, file, cb) => {
      if (!req.params.imageType) {
        Logger.error('imageType is required');
        cb(null, 'imageType is required');
      }
      const dir = tmpImageDirs[req.params.imageType];

      if (!dir) {
        Logger.error('invalid image type');
        cb(null, 'Invalid image type');
      }
      cb(null, dir);
    },
    filename: (req, file, cb) => {
      const fileExtension: string = extname(file.originalname);
      const fileName: string = uuidv4() + fileExtension;
      Logger.log('uploading : ' + fileName);
      cb(null, fileName);
    },
  }),
  fileFilter: (req, file, cb) => {
    console.log('mime type ', file.mimetype);
    validMimeTypes.includes(file.mimetype as ValidMimeType)
      ? cb(null, true)
      : cb(null, false);
  },
};

export const isFileExtensionSafe = async (path): Promise<boolean> => {
  const fileExtAndMimeType = await FileType.fromFile(path);

  if (!fileExtAndMimeType) return false;
  const { ext, mime } = fileExtAndMimeType;
  console.log('extension', { ext, mime });
  return (
    validExtensions.includes(ext as ValidExtensions) &&
    validMimeTypes.includes(mime as ValidMimeType)
  );
};

export const removeFile = (path): void => {
  try {
    unlinkSync(path);
  } catch (err) {
    console.error(err);
  }
};

*/
