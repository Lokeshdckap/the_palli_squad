import React, { useEffect, useState } from "react";
import { Header } from "../Header/Header";
import { PopupInput } from "./TeamPopupInput";
import { PopupButton } from "./TeamPopupButton";
import axios from "axios";
import TeamTableComponent from "../commonComponents/TeamTableComponent"
import TeamName from "./TeamName";
import InviteUsers from "./InviteUsers";
import CreateTeamForm from "./CreateTeamForm";

const TeamsComponent = (props) => {
  const [teamList, setTeamList] = useState(false);
  const [teampop, setTeampop] = useState(false);
  const [closeTab, setCloseTab] = useState(false);
  const [teamCreateForm, setTeamCreateForm] = useState(false);

  const handleOpenClose = () => {
    setCloseTab(false)
  }
  const handleTeamForm = () => {
    setTeamCreateForm(false)
  }

  const useEffect = async (e) => {
    setTeampop(true);
    await axios
      .get("/api/teams/getAllTeam", { "token": "token here" })
      .then((res) => {
        console.log(res);

        setTeampop(false);
        setTeamList({
          team_id: res.data.team_id,
          team_count: res.data.team_count,
          team_name: res.data.team_name,
          token: res.data.access,
        });
      })
      .catch((error) => {
        setTeampop(false);
        console.log(error)
      })

  };

  console.log(teamCreateForm, "CreateTeamForm")
  return (
    <div>
      {!teampop ? (
        <div>
          <Header />
          {/* <InviteUsers closeTab={closeTab} setCloseTab={setCloseTab} handleOpenClose={handleOpenClose} /> */}
          <CreateTeamForm teamCreateForm={teamCreateForm} setTeamCreateForm={setTeamCreateForm} handleTeamForm={handleTeamForm} />
          {!teamCreateForm && (<TeamName />)}
        </div>

      ) : (
        <div>
          <div className=" flex items-center justify-center h-screen w-screen absolute top-2/4 left-2/4 transform -translate-x-1/2 -translate-y-1/2 z-20 ">
            <div className="bg-[#fff] h-[320px] w-[600px] rounded-lg -z-10">
              {/* <div className="">
                <i
                  className="fa-solid fa-xmark text-red-500 pt-3 float-right text-2xl cursor-pointer mr-5"
                  onClick={props.click}
                ></i>
              </div> */}
              <div className="w-[480px] m-auto">
                <div className="flex pt-10 items-center space-x-2">
                  <i className="fa-solid fa-user-plus text-2xl "></i>
                  <p className="text-2xl text-textPrimary">Create Team</p>
                </div>
                <p className="pt-3">You can share the credentials in a team.</p>
                <div>
                  <PopupInput
                    lableName={"Team Name"}
                    HandleChange={props.HandleChange}
                    columnName={props.columnName}
                  />
                  {/* {!props.error.team_name ? (
                    <div>
                      <p className="invisible">Required</p>
                    </div>
                  ) : (
                    <div>
                      <p className="text-red-500">{props.error.team_name}</p>
                    </div>
                  )} */}
                </div>
                <div>
                  <PopupButton width="100px" createTeam={props.createTeam} />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );

};
export default TeamsComponent;
