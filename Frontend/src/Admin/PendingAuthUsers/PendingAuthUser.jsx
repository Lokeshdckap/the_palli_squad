import React, { useState } from "react";
import TableComponent from "../../commonComponents/TableComponent";
import PendingTable from "../../commonComponents/PendingTable";

export const PendingAuthUser = ({ approvalSignup,approvalDevice }) => {
  console.log(approvalSignup);
  const [activeTab, setActiveTab] = useState(1);

  const toggleTabs = (tabIndex) => {
    setActiveTab(tabIndex);
  };

  return (
    <>
      <div className="flex">
        <div
          className={`border-[1px] w-[100%] border-gray-300 bg-white rounded-lg cursor-pointer ${
            activeTab === 0 ? "bg-blue-500 text-white" : ""
          }`}
          onClick={() => toggleTabs(0)}
        >
          <div className="w-[90%] m-auto py-3">
            <div className="">
              <p className="text-center">Approval For New Signups</p>
            </div>
          </div>
        </div>
        <div
          className={`border-[1px] w-[100%] border-gray-300 bg-white rounded-lg cursor-pointer ${
            activeTab === 1 ? "bg-blue-500 text-white" : ""
          }`}
          onClick={() => toggleTabs(1)}
        >
          <div className="w-[90%] m-auto py-3">
            <div className="text-center">
              <p>Approval For Unauthorised Device Login</p>
            </div>
          </div>
        </div>
      </div>

      {activeTab === 0 ? (
        <PendingTable existUserList={approvalSignup} />
      ) : (
        activeTab === 1 && <PendingTable existUserList={approvalDevice} />
      )}
    </>
  );
};
