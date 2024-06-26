import React from "react";



const Button = (props) => {
  const {onclick} = props
  return (
    <button
      type="submit"
      className=" text-white bg-slate-800 border border-gray-300 focus:outline-none hover:bg-slate-900  w-[100rem] font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-gray-800 dark:text-white dark:border-gray-600 "
      style={{
        width: "100%",
      }}
      onclick={onclick}
      // type="submit"
    >
      {props.givenName}
    </button>
  );
};

export default Button;
