import React from 'react';
import TeamTableComponent from '../commonComponents/TeamTableComponent';


export default function TeamName() {
    const teamNames = [
        {
            id:1,
            team_name:"DCKAP",
            member_count:0,
            created_at:"2022-03-22",
            updated_at:"2022-03-22"
        },
        {
            id:2,
            team_name:"Zoho",
            member_count:0,
            created_at:"2022-03-22",
            updated_at:"2022-03-22"
        }
    ];

    return(
        <>
            <TeamTableComponent data={teamNames}/> 
        </>
    )
}