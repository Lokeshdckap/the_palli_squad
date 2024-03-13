import React from "react";
import TableComponent from "../../commonComponents/TableComponent";
// import TeamPopup from "../../Teams/TeamPopup";

const ExistingUsers = ({existUserList}) => {
    
  return (
    <div>
      <TableComponent 
      existUserList={existUserList}
      />
    </div>
  );
};
export default ExistingUsers;


// const popupTeam = () => {
//   return (
//     <div>
//       <TeamPopup />
//     </div>
//   );
// }

// export default popupTeam;