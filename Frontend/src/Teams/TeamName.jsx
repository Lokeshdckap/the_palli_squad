import React from 'react';
import TeamTableComponent from '../commonComponents/TeamTableComponent';


export default function TeamName({teamList}) {

    return(
        <>
            <TeamTableComponent 
            teamList={teamList}
            /> 
        </>
    )
}