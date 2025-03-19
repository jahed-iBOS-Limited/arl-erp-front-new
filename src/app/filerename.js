import fs from 'fs';
import path from 'path';

const renameJsToJsx = (dirPath) => {
  // Read the contents of the directory
  fs.readdir(dirPath, (err, files) => {
    if (err) {
      console.error('Error reading directory:', err);
      return;
    }

    // Loop through all files and subdirectories
    files.forEach((file) => {
      const fullPath = path.join(dirPath, file);
      fs.stat(fullPath, (err, stats) => {
        if (err) {
          console.error('Error checking file stats:', err);
          return;
        }

        // If it's a directory, recursively rename inside it
        if (stats.isDirectory()) {
          renameJsToJsx(fullPath);
        } else if (stats.isFile() && file.endsWith('.js')) {
          //if file name match "helper.js" then skip renaming
          if (file === 'helper.js') {
            return;
          }

          // Rename the .js file to .jsx
          const newFileName = path.join(dirPath, file.replace('.js', '.jsx'));
          fs.rename(fullPath, newFileName, (err) => {
            if (err) {
              console.error('Error renaming file:', err);
            } else {
              console.log(`Renamed: ${fullPath} -> ${newFileName}`);
            }
          });
        }
      });
    });
  });
};

// Start the renaming process on the '_metronic' folder
const baseDirectory = path.join(process.cwd(), 'modules');
renameJsToJsx(baseDirectory);
