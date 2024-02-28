import React from "react";
import { Search } from "../commonComponents/Search";

export const HeaderComponent = () => {
  return (
    <div>
      <div className="flex justify-between px-[30px] py-[18px]">
        <Search />

        <div>
          <i className="fa-regular text-white fa-circle-user text-2xl cursor-pointer pr-3"></i>
        </div>
      </div>
    </div>
  );
};
