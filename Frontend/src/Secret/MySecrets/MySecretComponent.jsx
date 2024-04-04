import React, { useEffect, useState } from "react";
import { Header } from "../../Header/Header";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import axiosClient from "../../axios-client";
import SecretTable from "../../commonComponents/SecretTable";
import SecretStoreForm from "../../commonComponents/SecretStoreForm";
import Crypto from "crypto-js";

export const MySecretComponent = () => {

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
  const [userList, setUserList] = useState([]);
  const [teamList,setTeamList] = useState([]);
  const [decryptedDescription, setDecryptedDescription] = useState("");
  const [closeStoreTab, setCloseStoreTab] = useState(false);

  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const hash_id = queryParams.get("hash_id");

  const naviagte = useNavigate()

  useEffect(()=>{
    getAllSecretsForUsers();
    getAllUsers()
    getAllTeamForSecrets()
  },[])
  useEffect(() => {
 
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

  const getAllSecretsForUsers = async() => {
   await axiosClient
      .get(`/api/secrets/getAllSecretsForUsers`)
      .then((res) => {
        setSecrets(res.data.data);
        if(res.data.data && res.data.data.length > 0){
        naviagte(`/secrets/mysecrets/?hash_id=${res?.data?.data[0]?.uuid}`)
        }
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

  const handleSubmit = async (e) => {
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

    await axiosClient
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

  const getAllUsers = async ()=>{
    try {
      await axiosClient
        .get(`/api/teams/getAllUsers`)
        .then((res) => {
          console.log(res.data)
          setUserList(res.data.users)
        })
        .catch((error) => {
          console.log(error);
        });
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }

  const getAllTeamForSecrets = async ()=>{
    try {
      await axiosClient
        .get(`/api/teams/getAllTeamForSecrets`)
        .then((res) => {
          setTeamList(res.data.teams)
        })
        .catch((error) => {
          console.log(error);
        });
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }

  

  return (
    <>
      <div>
        <div>
          {!closeStoreTab && (
            <div className="flex justify-between p-2">
              <p className="text-2xl">Secrets</p>
              <button
                className="px-8 py-2 bg-red-600 rounded-md text-[16px] text-white"
                onClick={() => {
                  setCloseStoreTab(true);
                }}
              >
                Add Secrets
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
            decryptedDescription={decryptedDescription}
            userList={userList}
            teamList={teamList}
          />
        </div>
        <div>
          {/* {!closeStoreTab && (<SecretsTableComponent />)} */}

          <SecretStoreForm
            closeStoreTab={closeStoreTab}
            setCloseStoreTab={setCloseStoreTab}
            getAllSecretsForUsers={getAllSecretsForUsers}
          />
        </div>
      </div>
    </>
  );
};
