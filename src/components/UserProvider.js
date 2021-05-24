/* eslint-disable import/no-anonymous-default-export */
import React, { useState, useEffect, createContext } from "react";
import { auth } from "./Firestore";
export const UserContext = createContext({ user: null });
export default (props) => {
  const [user, setuser] = useState(null);
  useEffect(() => {
    if(user){
      auth.onAuthStateChanged(async (user) => {
        const { displayName, email } = user;
        setuser({
          displayName,
          email,
        });
      });
    }
  }, []);
  return (
    <UserContext.Provider value={user}>{props.children}</UserContext.Provider>
  );
};
