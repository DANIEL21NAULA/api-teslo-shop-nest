import { v4 as uuid } from 'uuid';

export const fileName = (
  req: Express.Request,
  file: Express.Multer.File,
  callback: (error: Error | null, acceptFile: string) => void, //!callback : Function esto no permite el ESLINT
) => {
  if (!file) {
    callback(new Error('File is empty'), '');
    return;
  }

  const fileExptension = file.mimetype.split('/')[1];

  const fileName = `${uuid()}.${fileExptension}`;

  callback(null, fileName);
};
