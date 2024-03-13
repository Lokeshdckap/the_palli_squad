import React from "react";
import TableComponent from "../../commonComponents/TableComponent";

export const ExistingUsers = ({existUserList}) => {
    
  return (
    <div>
      <TableComponent 
      existUserList={existUserList}
      />
    </div>
  );
};
