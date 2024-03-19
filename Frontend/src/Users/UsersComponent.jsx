import React, { useState } from "react";
import { Header } from "../Header/Header";
import invitePeople from "../../src/assets/images/addFriends.png";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import InviteUsersBtn from "./InviteUsersBtn"
export const UsersComponent = ({ closeTab, setCloseTab, handleOpenClose }) => {

  const [inviteEmail, setInviteEmail] = useState("");
  const [isValid, setIsValid] = useState("")

  const handleChange = (e) => {
    const emailAddress = e.target.value
    setInviteEmail(emailAddress)

    if (isValid) {
      setIsValid("")
    }
  }

  const handleInviteUsers = (e) => {
    e.preventDefault();
    if (inviteEmail) {
      console.log("Sent")
    }
    if (!inviteEmail.trim()) {
      setIsValid("Please Enter an Mail-Id to invite Users")
    }
  }

  return (
    <div>
      <Header />

      <div className="relative">
        <div className="flex justify-between px-3 py-2">
          <p>Users</p>
          <button className="px-10 py-3 bg-red-500 rounded-md text-[16px]" onClick={() => { setCloseTab(true) }}>Invite</button>
        </div>


        {closeTab && (<>
          <div className='absolute top-0 left-[230px] border border-solid rounded-md w-[50%] h-[500px] mx-auto my-6 py-2 shadow-xl'>
            <div className="flex justify-around pl-[120px] px-auto items-center">
              {/* <p>Hello</p> */}
              <h1 className="text-xl">Invite users to secure data</h1>
              <span className="text-red-500 cursor-pointer" onClick={handleOpenClose}><FontAwesomeIcon icon={faTimes} /></span>
            </div>
            <img src={invitePeople} className="m-auto w-auto h-[75%] py-5" />
            <form onSubmit={handleInviteUsers} className="mx-auto">
              <label className="pl-16 pr-3 text-[16px]">Email</label>
              <input
                placeholder="Email"
                type="email"
                className="h-10 w-80 px-2 border rounded-md"
                name="email"
                value={inviteEmail}
                onChange={handleChange} />
              <div className="flex items-center justify-center py-1">
                <button className="px-10 py-3 bg-red-500 rounded-md ">Invite</button>
              </div>
            </form>
            {isValid && <p className="text-red-500 text-center">{isValid}</p>}
          </div>
        </>)}

      </div>
    </div>
  );
};
