import React from 'react';
import { useState } from "react";
import axios from "axios";
import invitePeople from "../../src/assets/images/addFriends.png";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function InviteUsers({ closeTab, setCloseTab, handleOpenClose }) {
    // const [inviteUsers,setInviteUsers]=useState(false)

    const [inviteEmail, setInviteEmail] = useState("");
    const [role, setRole] = useState("")
    const [isValid, setIsValid] = useState("")

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name === "email") {
            setInviteEmail(value);
        } else if (name === "role") {
            setRole(value);
        }
        if (isValid) {
            setIsValid("");
        }
    }


    const handleInviteUsers = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post("", { email: inviteEmail, role: role })
            console.log(response)
            toast.success("Email sent Successfully");
        }
        catch (error) {
            if (!inviteEmail.trim()) {
                // setIsValid("Please Enter an Mail-Id to invite Users")
                toast.error("Please enter email address")
            }

        }
    }

    return (
        <>
            <div className="relative">
                <div className="flex justify-between px-3 py-2">
                    <p className="text-2xl">Teams</p>
                    <button className="px-10 py-3 bg-red-500 rounded-md text-[16px]" onClick={() => { setCloseTab(true) }}>Invite</button>
                </div>
                {closeTab && (<>
                    <div className='absolute top-0 left-[230px] border border-solid rounded-md w-[50%] h-[500px] mx-auto my-6 py-2 shadow-xl'>
                        <div className="flex justify-around pl-[120px] px-auto items-center">
                            {/* <p>Hello</p> */}
                            <h1 className="text-xl">Invite users to create Team</h1>
                            <span className="text-red-500 cursor-pointer" onClick={handleOpenClose}><FontAwesomeIcon icon={faTimes} /></span>
                        </div>
                        <img src={invitePeople} className="m-auto w-auto h-[75%] py-5" />
                        <form onSubmit={handleInviteUsers} className="mx-auto">
                            <div className="flex items-center justify-center gap-3">
                                <label className="pr-3 text-[16px]">Email</label>
                                <input
                                    placeholder="Email"
                                    type="email"
                                    className="h-10 w-80 px-2 border rounded-md"
                                    name="email"
                                    value={inviteEmail}
                                    onChange={handleChange} />
                                <select
                                    value={role}
                                    onChange={handleChange}
                                    name="role"
                                    className="p-2"

                                >
                                    <option value="">Select Role</option>
                                    <option value="admin">Admin</option>
                                    <option value="manager">Manager</option>
                                    <option value="collabrator">Collabrator</option>
                                </select>
                            </div>
                            <div className="flex items-center justify-center py-1">
                                <button className="px-10 py-3 bg-red-500 rounded-md ">Invite</button>
                            </div>
                        </form>
                        {/* {isValid && <p className="text-red-500 text-center">{isValid}</p>} */}
                    </div>
                </>)}
            </div>
        </>
    )

}
