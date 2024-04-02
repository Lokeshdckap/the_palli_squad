import CryptoJS from 'crypto-js';

// Encrypts the content with the given password
const encryptFile = (fileContent, password) => {
  return CryptoJS.AES.encrypt(fileContent, password).toString();
};

// Decrypts the content with the given password
const decryptFile = (encryptedContent, password) => {
  try {
    const bytes = CryptoJS.AES.decrypt(encryptedContent, password);
    const decryptedContent = bytes.toString(CryptoJS.enc.Utf8);
    return decryptedContent;
  } catch (error) {
    console.error('Error decrypting file:', error);
    return null;
  }
};

export { encryptFile, decryptFile };
