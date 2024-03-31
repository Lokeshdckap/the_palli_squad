const db = require("../../utils/database");
const { Op, where } = require("sequelize");
const { sequelize, col } = require("../../utils/database");
const Team = db.teams;
const User = db.users;
const UserTeams = db.user_team_members;
const Invite = db.invitations;
const secrets = db.secret;
const uuid = require("uuid");
const path = require("path");
const fs = require("fs");
const crypto = require("crypto");
const sendEmail = require("../../utils/sendEmails");
const jwt = require("jsonwebtoken");

const encrypted = async (secretData) => {
  try {
    const password = secretData;
    const passphrase = "Lokesh@9873262"; // Your passphrase
    const salt = Buffer.alloc(16, 0); // Generate a random salt
    const iterations = 10000; // Number of iterations
    const keyLength = 32; // Desired key length in bytes

    const derivedKey = await new Promise((resolve, reject) => {
      crypto.pbkdf2(
        passphrase,
        salt,
        iterations,
        keyLength,
        "sha256",
        (err, key) => {
          if (err) {
            reject(err);
          } else {
            resolve(key);
          }
        }
      );
    });

    const iv = Buffer.alloc(16, 0);
    const cipher = crypto.createCipheriv(
      "aes-256-cbc",
      Buffer.from(derivedKey),
      iv
    );
    let encryptedData = cipher.update(password, "utf8", "hex");
    encryptedData += cipher.final("hex");

    return encryptedData;
  } catch (error) {
    console.error("Error encrypting:", error);
    return null;
  }
};
const decrypted = async (encryptedData) => {
  try {
    const passphrase = "Lokesh@9873262"; // Your passphrase
    const salt = Buffer.alloc(16, 0); // Use a fixed salt for consistency
    const iterations = 10000; // Number of iterations
    const keyLength = 32; // Desired key length in bytes

    const derivedKey = await new Promise((resolve, reject) => {
      crypto.pbkdf2(
        passphrase,
        salt,
        iterations,
        keyLength,
        "sha256",
        (err, key) => {
          if (err) {
            reject(err);
          } else {
            resolve(key);
          }
        }
      );
    });

    const iv = Buffer.alloc(16, 0); // Use a fixed IV for consistency
    const decipher = crypto.createDecipheriv("aes-256-cbc", derivedKey, iv);
    let decrypted = decipher.update(encryptedData, "hex", "utf8");
    decrypted += decipher.final("utf8");

    return decrypted;
  } catch (error) {
    return null;
  }
};

const encryptionFile = async (filePath) => {
  try {
    const fileContent = fs.readFileSync(filePath);
    const passphrase = "Lokesh@9873262"; // Your passphrase
    const salt = Buffer.alloc(16, 0); // Generate a random salt
    const iterations = 10000; // Number of iterations
    const keyLength = 32; // Desired key length in bytes

    const derivedKey = await new Promise((resolve, reject) => {
      crypto.pbkdf2(
        passphrase,
        salt,
        iterations,
        keyLength,
        "sha256",
        (err, key) => {
          if (err) {
            reject(err);
          } else {
            resolve(key);
          }
        }
      );
    });

    const iv = Buffer.alloc(16, 0);
    const cipher = crypto.createCipheriv(
      "aes-256-cbc",
      Buffer.from(derivedKey),
      iv
    );
    let encryptedFile = cipher.update(fileContent, "binary", "hex");
    encryptedFile += cipher.final("hex");

    return encryptedFile;
  } catch (error) {
    console.error("Error reading file for encryption:", error);
    throw error;
  }
};

const decryptionFile = async (fileId) => {
  try {
    const fileRecord = await secrets.findOne({
      where: {
        uuid: fileId,
      },
    });

    if (!fileRecord.encrypted_attachment) {
      throw new Error("File not found in database.");
    }

    // Convert the encrypted content from buffer to hex string
    const encryptedContentHex = fileRecord.encrypted_attachment.toString("hex");
    const passphrase = "Lokesh@9873262"; // Your passphrase
    const salt = Buffer.alloc(16, 0); // Generate a random salt
    const iterations = 10000; // Number of iterations
    const keyLength = 32; // Desired key length in bytes

    const derivedKey = await new Promise((resolve, reject) => {
      crypto.pbkdf2(
        passphrase,
        salt,
        iterations,
        keyLength,
        "sha256",
        (err, key) => {
          if (err) {
            reject(err);
          } else {
            resolve(key);
          }
        }
      );
    });

    const iv = Buffer.alloc(16, 0);
    const decipher = crypto.createDecipheriv(
      "aes-256-cbc",
      Buffer.from(derivedKey),
      iv
    );
    let decryptedContentHex = decipher.update(
      encryptedContentHex,
      "hex",
      "utf8"
    );
    decryptedContentHex += decipher.final("utf8");
    // Return the decrypted content as a hex string
    return decryptedContentHex;
  } catch (error) {
    console.error("Error decrypting file:", error);
    throw error;
  }
};

const encryptionData = async (req, res) => {
  try {
    const title = req.body.title;

    const username = req.body.username;

    const secretData = req.body.secretData;

    const encryptedFile = await encryptionFile(req.file.path);

    const encryptedFilePath = req.file.path;

    const encryptedFileType = req.file.mimetype;

    const originalname = req.file.originalname;

    fs.writeFileSync(encryptedFilePath, encryptedFile, "hex");

    const encryptionData = await encrypted(secretData);

    const createSecrets = await secrets.create({
      title: title,
      username: username,
      user_uuid: req.user.id,
      uuid: uuid.v4(),
      encrypted_password: encryptionData,
      encrypted_attachment: Buffer.from(encryptedFile, "hex"),
      encrypted_file_type: encryptedFileType,
      encrypted_fileName: originalname,
    });

    if (createSecrets) {
      return res.status(200).json({
        Success: "Your Secrets Created Sucessfully",
        createSecrets,
      });
    } else {
      return res.status(500).json({
        Error: "Error Secrets Not Created",
      });
    }
  } catch (err) {
    return res.status(500).json({
      Error: "Error Secrets Not Created",
    });
  }
};

const decryptionData = async (req, res) => {
  try {
    const secret_uuid = req.params.uuid;
    const file = await decryptionFile(secret_uuid);
    const findSecrets = await secrets.findOne({
      where: {
        uuid: secret_uuid,
      },
    });

    if (findSecrets) {
      const deryptionData = await decrypted(findSecrets.encrypted_password);

      if (deryptionData != null) {
        return res.status(200).json({
          Success: "Your Secrets fetched Sucessfully",
          deryptionData,
          file,
        });
      }
      return res.status(500).json({
        Error: "Error Secrets Not Secrets",
      });
    } else {
      return res.status(500).json({
        Error: "Error Secrets Not Secrets",
      });
    }
  } catch (err) {
    return res.status(500).json({
      Error: "Error Secrets Not Secrets",
    });
  }
};

const getAllSecretsForUsers = async (req, res) => {
  try {
    const allSecrets = await secrets.findAll({
      where: {
        user_uuid: req.user.id,
      },
    });

    const secretsWithHexAttachments = allSecrets.map(secret => ({
        uuid: secret.uuid,
        username: secret.username,
        title: secret.title,
        password : secret.encrypted_password,
        encrypted_attachment_hex: Buffer.from(secret.encrypted_attachment).toString('hex'),
      }));

    if (allSecrets)
      return res.status(200).json({
        data: secretsWithHexAttachments,
        msg: "All Secrets Fetched Sucessfully",
      });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      Error: "Error Secrets Not Secrets",
    });
  }
};

module.exports = {
  encryptionData,
  decryptionData,
  getAllSecretsForUsers,
};
