import React, { useEffect, useState } from "react";
import { Header } from "../Header/Header";
import { useLocation, useParams } from "react-router-dom";
import axiosClient from "../axios-client";
import SecretTable from "../commonComponents/SecretTable";

export const SecretComponent = () => {
  const params = useParams();
  const [secrets, setSecrets] = useState([]);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [authUser, setAuthUser] = useState(false);
  const [decryptedData, setDecryptedData] = useState("");
  const [decryptedAttachments, setDecryptedAttachments] = useState("");

  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const hash_id = queryParams.get("hash_id");

  useEffect(() => {
    getAllSecretsForUsers();
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

  const getAllSecretsForUsers = () => {
    axiosClient
      .get(`/api/secrets/getAllSecretsForUsers`)
      .then((res) => {
        setSecrets(res.data.data);
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

    let payLoad = {
      passPhrase: password,
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
          console.log(res.data.file);
          if (res.status == 200) {
            if (res.data.deryptionData) {
              setDecryptedData(res.data.deryptionData);
            }
            if (res.data.file) {
              setDecryptedAttachments(res.data.file);
            }
          }
          // setAuthUser(false);
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
    <div>
      <Header />
      <div>
        <SecretTable
          secret={secrets}
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
        />
      </div>
    </div>
  );
};
