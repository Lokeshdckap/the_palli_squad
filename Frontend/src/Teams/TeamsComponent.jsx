import React, { useEffect, useState } from "react";
import { Header } from "../Header/Header";
import TeamName from "./TeamName";
import CreateTeamForm from "./CreateTeamForm";
import axiosClient from "../axios-client";
import { useParams } from "react-router-dom";

const TeamsComponent = (props) => {
  const [teamList, setTeamList] = useState([]);
  const [teampop, setTeampop] = useState(false);
  const [closeTab, setCloseTab] = useState(false);
  const [teamCreateForm, setTeamCreateForm] = useState("");

  const params = useParams()

  const handleOpenClose = () => {
    setCloseTab(false);
  };
  const handleTeamForm = () => {
    setTeamCreateForm(false);
  };

  useEffect(() => {
    setTeampop(true);
    getAllTeam();
  }, []);

  const getAllTeam = () => {
    axiosClient
      .get("/api/teams/getAllTeam")
      .then((res) => {
        console.log(res)
        setTeamList(res.data.getAllTeam);
         
        setTeampop(false);
      })
      .catch((error) => {
        setTeampop(false);
      });
  };

 

  return (
    <div>
      {!teampop ? (
        <div>
          <Header />
          {/* <InviteUsers closeTab={closeTab} setCloseTab={setCloseTab} handleOpenClose={handleOpenClose} /> */}
          <CreateTeamForm
            teamCreateForm={teamCreateForm}
            setTeamCreateForm={setTeamCreateForm}
            handleTeamForm={handleTeamForm}
            getAllTeam={getAllTeam}
          />
          {!teamCreateForm && <TeamName teamList={teamList} />}
        </div>
      ) : (
        <></>
      )}
    </div>
  );
};
export default TeamsComponent;
