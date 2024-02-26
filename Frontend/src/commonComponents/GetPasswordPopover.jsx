import React from "react";

import { trackPwdRequirement } from "../utility";

const GetPasswordPopover = (props) => {
  const {password} = props

  const requirementsList = trackPwdRequirement(password);


  return (
    <ul>
      {requirementsList.map((item) => (
        <li key={item.key}>
          {item.error ? (
            <span>
              <i className="fa-regular fa-circle-xmark" style={{color:" #ff0000"}}></i>
              <span>{item.content}</span>
            </span>
          ) : (
            <span>
              <i className="fa-regular fa-circle-check" style={{color:"#00d619"}}></i>
              <span>{item.content}</span>
            </span>
          )}
        </li>
      ))}
    </ul>
  );
};

export default GetPasswordPopover;
