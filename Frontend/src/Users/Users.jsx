import React, { useState } from 'react'
import { UsersComponent } from './UsersComponent'
import TableuserComponent from '../commonComponents/TableuserComponent'

export const Users = () => {
  const [closeTab, setCloseTab] = useState(false)
  // const [inviteUsers,setInviteUsers]=useState(false)
  const handleOpenClose = () => {
    setCloseTab(false)
  }

  return (
    <>

      <UsersComponent closeTab={closeTab} setCloseTab={setCloseTab} handleOpenClose={handleOpenClose} />
      {!closeTab && (<TableuserComponent />)}
      <div>
        {/* <table>
            <th>S.no</th>
            <th>UserName</th>
            <th>UserEmail</th>
            <th>Role</th>
            <th>isLogged</th>
        </table> */}
      </div>
    </>
  )
}
