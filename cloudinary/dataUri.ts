/* eslint-disable no-undef */
import DataUriParser from 'datauri/parser.js';
import path from 'path';

const getDataUri = (file: Express.Multer.File) => {
  const parser = new DataUriParser();
  const extName = path.extname(file.originalname).toString();
  parser.format(extName, file.buffer);
  const fileUri: string = parser.content!;
  return fileUri;
};

export default getDataUri;
