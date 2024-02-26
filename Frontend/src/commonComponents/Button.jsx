import React from "react";
import "../styles/index.css";


const Button = (props) => {
  const {onclick} = props
  return (
    <button
      type="button"
      class=" text-gray-900 bg-white border border-gray-300 pt-4 focus:outline-none hover:bg-gray-700  w-[100rem] font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-gray-800 dark:text-white dark:border-gray-600 "
      style={{
        width: "100%",
      }}
      onclick={onclick}
    >
      {props.givenName}
    </button>
  );
};

export default Button;
