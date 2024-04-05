import React, { useEffect, useState } from "react";
import { Header } from "../../Header/Header";
import { useLocation, useParams } from "react-router-dom";
import axiosClient from "../../axios-client";
import SecretTableShare from "../../commonComponents/SecretTableShare";
import Crypto from "crypto-js";

export const ShareSecretComponent = () => {
  const params = useParams();
  const [shareSecrets, setShareSecrets] = useState([]);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [authUser, setAuthUser] = useState(false);
  const [decryptedData, setDecryptedData] = useState("");
  const [decryptedAttachments, setDecryptedAttachments] = useState([]);
  const [decryptedFileType, setDecryptedFileType] = useState("");
  const [decryptedFileName, setDecryptedFileName] = useState("");
  const [decryptedDescription, setDecryptedDescription] = useState("");
  const [closeStoreTab, setCloseStoreTab] = useState(false);

  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const hash_id = queryParams.get("hash_id");

  useEffect(() => {
    getShareWithMe();
    if (authUser) {
      getDecrypted();
    }
  }, [authUser]);

  const showModal = () => {
    setIsModalOpen(true);
  };
  const handleOk = () => {
    setIsModalOpen(false);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const getShareWithMe = () => {
    axiosClient
      .get(`/api/shares/getShareWithMe`)
      .then((res) => {
        console.log(res.data.users)
        setShareSecrets(res.data.users)
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const handleInputChange = (e) => {
    const newPassword = e.target.value;
    setPassword(newPassword);
    if (error) {
      setError("");
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!password.trim()) {
      setError("PassPhrase is required");
      return;
    }

    const encryptPassword = (encryptData) => {
      const secretKey = process.env.REACT_APP_SECRET_KEY;
      const securePassword = Crypto.AES.encrypt(
        encryptData,
        secretKey
      ).toString();
      return securePassword;
    };

    const encryptSecret = encryptPassword(password)
    
    let payLoad = {
      passPhrase: encryptSecret,
    };


    axiosClient
      .post("/api/auth/checkPassPharse", payLoad)
      .then((res) => {
        if (res.status === 200) {
          setAuthUser(res.data.data);
          setIsModalOpen(false);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const getDecrypted = async () => {
    try {
      await axiosClient
        .get(`/api/secrets/secret-decryption/${hash_id}`)
        .then((res) => {
          if (res.status == 200) {
            if (res.data.deryptionData) {
           
              setDecryptedData(res.data.deryptionData);
            }
            if(res.data.decryptedDescription){
              setDecryptedDescription(res.data.decryptedDescription)
            }
            if (res.data.file) {
              setDecryptedFileType(res.data.encryptedFileType);
              setDecryptedFileName(res.data.encryptedFileName);
              setDecryptedAttachments(res.data.file.data);
            }
          }
        })
        .catch((error) => {
          console.log(error);
        });
    } catch (error) {
      console.error("Error fetching data:", error);
      // Handle the error, such as displaying an error message
    }
  };
  return (
    <>
      <div>
        <div>
          <SecretTableShare
            secret={shareSecrets}
            setPassword={setPassword}
            password={password}
            handleInputChange={handleInputChange}
            handleSubmit={handleSubmit}
            setError={setError}
            error={error}
            showModal={showModal}
            handleOk={handleOk}
            handleCancel={handleCancel}
            setIsModalOpen={setIsModalOpen}
            isModalOpen={isModalOpen}
            authUser={authUser}
            setAuthUser={setAuthUser}
            decryptedData={decryptedData}
            decryptedAttachments={decryptedAttachments}
            decryptedFileType={decryptedFileType}
            decryptedDescription={decryptedDescription}
            decryptedFileName={decryptedFileName}
          />
        </div>
      </div>
    </>
  );
};
