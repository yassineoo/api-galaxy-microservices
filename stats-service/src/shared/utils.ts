import { BadRequestException, NotFoundException } from '@nestjs/common';
import { extname, join } from 'path';

import { promises as fs } from 'fs';
import { MediaDTO } from 'src/users/dto/Media.dto';

export async function validateMediaElement(
  medias: MediaDTO,
  location: string = 'events',
) {
  console.log('our medias  => ', medias);
  const imageUrl = medias.url;
  console.log(imageUrl);

  const arr = imageUrl?.split('/') ?? [];
  console.log(arr);

  if (!(arr?.length > 0)) throw new BadRequestException('wrong image url');

  const imageName = arr[arr.length - 1];
  console.log('image name  => ', imageName);
  let sourcePath, destinationUrl;
  console.log('ur location  => ', location);
  if (!imageUrl.includes(`${location}/tmp`)) {
    throw new BadRequestException('the image url is not valid ----');
  }
  sourcePath = join(process.cwd(), `./uploads/${location}/tmp/`, imageName);
  destinationUrl = join(process.cwd(), `./uploads/${location}/`, imageName);
  try {
    await fs.readFile(sourcePath);
  } catch (err) {
    console.error(err);
    throw new BadRequestException('file not found');
  }

  try {
    await fs.copyFile(sourcePath, destinationUrl);
  } catch (err) {
    console.error(err);
    throw new BadRequestException('failed to copy file');
  }
  medias.url = imageName;

  return medias;
}

export const transeferBlur = (originaleUrl) => {
  const arr = originaleUrl?.split('/') ?? [];

  const imageName = arr[arr.length - 1];
  const newUrl = originaleUrl.replace(
    imageName,
    generateBlurredFilename(imageName),
  );

  return newUrl;
};

export async function validateMedias(medias: MediaDTO[], location: string) {
  for (let i = 0; i < medias.length; i++) {
    // handle blured images

    const newUrl = transeferBlur(medias[i].url);
    await validateMediaElement({ ...medias[i], url: newUrl }, location);

    medias[i] = await validateMediaElement(medias[i], location);
  }
  return { medias };
}

export const generateBlurredFilename = (originalFilename: string) => {
  const ext = extname(originalFilename); // Get the file extension
  const base = originalFilename.replace(ext, ''); // Get the filename without the extension
  return `${base}_blur${ext}`; // Append '_blur' to the filename and add the extension
};

export async function deleteMedias(
  medias: MediaDTO[],
  location: string = 'events',
) {
  for (const media of medias) {
    const imageUrl = media.url;
    const imageName = imageUrl.split('/').pop();

    if (!imageName) {
      throw new BadRequestException('Invalid image URL');
    }

    const imagePath = join(process.cwd(), `./uploads/${location}/`, imageName);

    try {
      await fs.unlink(imagePath);
    } catch (err) {
      console.error(err);
      throw new NotFoundException('File not found');
    }
  }
}

export async function copyImage(imageUrl, folderName, debug = false) {
  let imageName, sourcePath, destinationUrl;
  if (!imageUrl && !debug) {
    throw new BadRequestException('image url is required');
  }
  if (!debug && imageUrl) {
    const arr = imageUrl.split('/');

    imageName = arr[arr.length - 1];
    if (!imageUrl.includes(`${folderName}/tmp`)) {
      throw new BadRequestException(
        'the image url is not valid from copy --' + folderName,
      );
    }
    sourcePath = join(process.cwd(), `./uploads/${folderName}/tmp/`, imageName);
    destinationUrl = join(process.cwd(), `./uploads/${folderName}/`, imageName);
    try {
      await fs.readFile(sourcePath);
    } catch (err) {
      //this.logger.error(err);
      throw new BadRequestException('file not found');
    }

    try {
      await fs.copyFile(sourcePath, destinationUrl);
      return imageName;
    } catch (err) {
      //        this.logger.error(err);
      throw new BadRequestException('failed to copy file');
    }
  }
}

export async function deleteImage(folderName, imageName) {
  const imagePath = join(process.cwd(), `./uploads/${folderName}/`, imageName);
  console.log('deleteing image from ');
  console.log('deleteing image from ');
  console.log('deleteing image from ');
  console.log('deleteing image from ', imagePath);

  console.log('deleteing image from ');
  console.log('deleteing image from ');
  try {
    await fs.unlink(imagePath);
  } catch (err) {
    throw new BadRequestException('Failed to delete image');
  }
}
