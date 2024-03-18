import React, { useEffect, useState } from "react";
import { Header } from "../Header/Header";
import { PopupInput } from "./TeamPopupInput";
import { PopupButton } from "./TeamPopupButton";
import axios from "axios";
import TeamTableComponent from "../commonComponents/TeamTableComponent"

const TeamsComponent = (props) => {
  const [teamList,setTeamList] = useState([
  
  {
      team_name:"palli",
      created_at:"2024/03/12",
      updated_at:"2024/03/12",
      team_count:13,
      id:1,
    }

  ]);


  useEffect(()=>{
    axios.get("",{"token": "token here"}).then((res)=>{
      
    }).catch((error)=>{
      console.log(error)
    })

  },[])

    return (
      <div>
        {teamList.length ? (
        <div>
          <Header />
          <TeamTableComponent data={teamList}/>
         
        </div>
          
        ) : (
          <div>
          <div className="bg-[#aba9af] opacity-[0.5] w-[100%] h-[100%] absolute top-0 left-0  z-10"></div>
          <div className=" flex items-center justify-center h-screen w-screen absolute top-2/4 left-2/4 transform -translate-x-1/2 -translate-y-1/2 z-20 ">
            <div className="bg-[#fff] h-[320px] w-[600px]  rounded-lg -z-10">
              <div className="">
                <i
                  className="fa-solid fa-xmark text-red-500 pt-3 float-right text-2xl cursor-pointer mr-5"
                  onClick={props.click}
                ></i>
              </div>
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
