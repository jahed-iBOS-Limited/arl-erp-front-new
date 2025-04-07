import imageCompression from 'browser-image-compression';

export const compressfile = (
  files,
  options = {
    maxSizeMB: 0.9,
    maxWidthOrHeight: 1920,
    useWebWorker: true,
  }
) => {
  return new Promise((resolve, reject) => {
    const compressFilesAsync = async () => {
      try {
        const compressedFiles = [];
        for (let i = 0; i < files.length; i++) {
          if (files[i]?.type?.startsWith('image/')) {
            compressedFiles.push(await imageCompression(files[i], options));
          } else {
            compressedFiles.push(files[i]);
          }
        }
        resolve(compressedFiles);
      } catch (error) {
        reject(error);
      }
    };
    compressFilesAsync();
  });
};
