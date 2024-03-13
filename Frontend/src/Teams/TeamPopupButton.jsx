import React from 'react'

export const PopupButton = (props) => {
  return (
    <div className={`text-center`}>
        <button className="bg-black hover:bg-gray-900 text-white font-bold py-3 px-12 mt-3 rounded"
            onClick={props.createTeam}
        >   
            Create Team
        </button>
    </div>
  )
}