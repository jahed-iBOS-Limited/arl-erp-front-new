const CryptoJS = require("crypto-js");

const key = CryptoJS.enc.Utf8.parse("@#%FWFJW#R(%adfs");
const iv = CryptoJS.enc.Utf8.parse("@#%FWFJW#R(%adfs");

export const makeEncryption = (data) => {
  const encryptedText = CryptoJS.AES.encrypt(
    CryptoJS.enc.Utf8.parse(`${data}`),
    key,
    {
      keySize: 128 / 8,
      iv: iv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7,
    }
  ).toString();
  // return process.env.NODE_ENV === "production"  ? encryptedText : data;
  return encryptedText;
};

export const makeDecryption = (data) => {
  const decrypt = CryptoJS.AES.decrypt(data, key, {
    iv: iv,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7,
  });
  const decryptedData = decrypt.toString(CryptoJS.enc.Utf8);
  // return process.env.NODE_ENV === "production"
  //   ? decryptedData
  //   : JSON.stringify(data);
  if (decryptedData) {
    return JSON.parse(decryptedData);
  }
  // return JSON.parse(decryptedData);
};
