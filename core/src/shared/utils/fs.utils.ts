const fs = require('fs');
const path = require('path');
const fse = require('fs-extra');

export const checkFileExist = (path: string) => {
  return fs.existsSync(path);
};

export const readFileFullPath = (location: string): Buffer => {
  return fs.readFileSync(location);
};

export const readFile = (location: string): Buffer => {
  return fs.readFileSync(path.join(process.cwd() + location));
};

export const writeFile = (location: string, data: string): Buffer => {
  return fse.outputFileSync(path.join(process.cwd() + location), data, {});
};
