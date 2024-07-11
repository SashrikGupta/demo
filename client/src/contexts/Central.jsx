import React, { createContext, useContext, useState, useEffect } from "react";

export const curr_context = createContext();

export default function Central(props) {
 

  const backend_url = "http://localhost:7000" 
  const [user , set_user] = useState("10") 



  return (
    <>
      <curr_context.Provider value={{backend_url , user , set_user}}>
        {props.children}
      </curr_context.Provider>
    </>
  );
}