export const fileFilter = (
  req: Express.Request,
  file: Express.Multer.File,
  callback: (error: Error | null, acceptFile: boolean) => void, //!callback : Function esto no permite el ESLINT
) => {
  if (!file) {
    callback(new Error('File is empty'), false);
    return;
  }

  const fileExptension = file.mimetype.split('/');

  if (
    !Array.isArray(fileExptension) ||
    fileExptension.length < 2 ||
    !fileExptension[1]
  ) {
    callback(new Error('File is empty'), false);
  }

  const validExtensions = ['jpg', 'jpeg', 'png', 'gif'];

  if (validExtensions.includes(fileExptension[1])) {
    callback(null, true);
    return;
  }
  callback(new Error('File incorrect Exptension'), false);
};
