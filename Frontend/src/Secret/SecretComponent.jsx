import React, { useEffect, useState } from "react";
import { Header } from "../Header/Header";
import { useLocation, useParams } from "react-router-dom";
import axiosClient from "../axios-client";
import SecretTable from "../commonComponents/SecretTable";
import SecretsTableComponent from "../commonComponents/SecretsTable";
import SecretStoreForm from "./SecretStoreForm";
import Justification from "../commonComponents/Justification"

export const SecretComponent = () => {
  const params = useParams();
  const [secrets, setSecrets] = useState([]);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [authUser, setAuthUser] = useState(false);
  const [decryptedData, setDecryptedData] = useState("");
  const [decryptedAttachments, setDecryptedAttachments] = useState([]);
  const [decryptedFileType, setDecryptedFileType] = useState("");
  const [decryptedFileName, setDecryptedFileName] = useState("");
  const [reason, setReason] = useState(false);

  const [closeStoreTab, setCloseStoreTab] = useState(false);
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
          if (res.status == 200) {
            if (res.data.deryptionData) {
              setDecryptedData(res.data.deryptionData);
            }
            if (res.data.file) {
              setDecryptedFileType(res.data.encryptedFileType);
              setDecryptedFileName(res.data.encryptedFileName);
              setDecryptedAttachments(res.data.file.data)
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
        <Header />
        <button className="px-8 py-2 bg-blue-600 hover:bg-blue-500 rounded-md text-[16px] text-white" onClick={() => setReason(true)}>
          Justification
        </button>
        <div>
          {!closeStoreTab && (
            <div className="flex justify-between p-2">
              <p className="text-2xl">Secrets</p>
              <button
                className="px-8 py-2 bg-blue-600 hover:bg-blue-500 rounded-md text-[16px] text-white"
                onClick={() => {
                  setCloseStoreTab(true);
                }}
              >
                Add+
              </button>

            </div>
          )}


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
            decryptedFileType={decryptedFileType}
            decryptedFileName={decryptedFileName}
          />
        </div>
        <div>
          {/* {!closeStoreTab && (<SecretsTableComponent />)} */}

          <SecretStoreForm
            closeStoreTab={closeStoreTab}
            setCloseStoreTab={setCloseStoreTab}
            getAllSecretsForUsers={getAllSecretsForUsers}
          />
          {reason && (<Justification reason={reason} setReason={setReason}/>)}
        </div>
      </div>
    </>
  );
};
