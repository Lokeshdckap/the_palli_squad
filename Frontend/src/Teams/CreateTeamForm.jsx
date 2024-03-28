import React from 'react';
import { useState } from "react";
import axios from "axios";
import TeamMeeting from "../../src/assets/images/TeamMeeting.png";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function CreateTeamForm({ teamCreateForm, setTeamCreateForm, handleTeamForm }) {
    // const [inviteUsers,setInviteUsers]=useState(false)

    const [createTeam, setCreateTeam] = useState("");
    const [isValid, setIsValid] = useState("")

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name === "email") {
            setCreateTeam(value);
        }
        if (isValid) {
            setIsValid("");
        }
    }


    const handleCreateTeam = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post("", { team: createTeam })
            console.log(response)
            toast.success("Team created Successfully");
        }
        catch (error) {
            if (!createTeam.trim()) {
                // setIsValid("Please Enter an Mail-Id to invite Users")
                toast.error("Please enter Team Name")
            }

        }
    }

    return (
        <>
            <div className="relative">
                <div className="flex justify-between px-3 py-2">
                    <p className="text-2xl">Teams</p>
                    <button className="px-8 py-2 bg-red-600 rounded-md text-[16px] text-white" onClick={() => { setTeamCreateForm(true) }}>Create Team</button>
                </div>
                {teamCreateForm && (<>
                    <div className='absolute top-0 left-[230px] border border-solid rounded-md w-[50%] h-[200px] mx-auto my-6 py-2 shadow-xl'>
                        <div className="flex justify-center px-[20px] px-auto items-center">
                            {/* <p>Hello</p> */}
                            <h1 className="text-2xl w-full text-center">Create Team</h1>
                            <span className="text-red-500 text-xl cursor-pointer" onClick={handleTeamForm}><FontAwesomeIcon icon={faTimes} /></span>
                        </div>
                        {/* <img src={TeamMeeting} className="m-auto w-auto h-[75%] py-5" /> */}
                        <form onSubmit={handleCreateTeam} className="mx-auto my-4">
                            <div className="flex items-center justify-center gap-3">
                                <label className="pr-2 text-[16px]">Team Name</label>
                                <input
                                    placeholder="Team Name"
                                    type="text"
                                    className="h-10 w-80 px-2 border rounded-md"
                                    name="createTeam"
                                    value={createTeam}
                                    onChange={handleChange} />
                            </div>
                            <div className="flex items-center justify-center py-1 mt-3">
                                <button className="px-8 py-2 bg-red-600 rounded-md text-white">Create</button>
                            </div>
                        </form>
                    </div>
                </>)}
            </div>
        </>
    )

}
