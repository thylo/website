// packages
const fs = require("fs");
const glob = require("glob");
const path = require("path");

// config
const assetsDirs = [
  {
    src: "./src/assets/img/",
    dist: "./dist/img/",
  },
  {
    src: "./src/assets/fonts/",
    dist: "./dist/fonts/",
  },
];

// make sure paths do not end with slash
function sanitizePath(filepath) {
  let sanitizedFilepath = filepath;
  if (filepath.slice(-1) === "/") {
    sanitizedFilepath = filepath.slice(0, -1);
  }
  return sanitizedFilepath;
}

function getFiles(sourceDir) {
  return new Promise((resolve, reject) =>
    glob(`${sourceDir}/**/*`, { nodir: true }, (err, data) => {
      if (err) reject(err);
      resolve(data);
    })
  );
}

function fileExist(file) {
  return new Promise((resolve, reject) =>
    fs.access(file, (err, value) => {
      resolve(!err);
    })
  );
}

function createDir(file, options) {
  return new Promise((resolve, reject) =>
    fs.mkdir(file, options, (err, value) => {
      if (err) reject(err);
      resolve(value);
    })
  );
}

// copy assets
function copyAssets() {
  return Promise.all(
    assetsDirs.map(async (dir) => {
      const sourceDir = sanitizePath(dir.src);
      const distDir = sanitizePath(dir.dist);

      // glob all files
      const files = await getFiles(sourceDir);

      // copy each file to dist dir
      await Promise.all(
        files.map(async (file) => {
          let srcFile = file;
          let distFile = srcFile.replace(sourceDir, distDir);
          let distDirname = path.dirname(distFile);

          const dirExist = await fileExist(distDirname);
          if (!dirExist) {
            await createDir(distDirname, { recursive: true });
          }

          if (!(await fileExist(distFile)) || dir.force === true) {
            fs.copyFile(srcFile, distFile, (err) => {
              if (err) throw err;
            });
          }
        })
      );
    })
  );
}

// exports
module.exports = {
  assets: copyAssets,
};
