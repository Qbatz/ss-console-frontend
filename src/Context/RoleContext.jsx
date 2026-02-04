import React, { createContext, useContext, useEffect, useState } from "react";
import api from "../Config/AxiosConfig";

const RoleContext = createContext(null);

export const RoleProvider = ({ children }) => {
  const [modules, setModules] = useState([]);
  const [loading, setLoading] = useState(true);

 useEffect(() => {
  const token = localStorage.getItem("access_token");

  if (!token) {
    setLoading(false);
    return;
  }

  const fetchModules = async () => {
    try {
      const res = await api.get("/v2/modules");
      setModules(res.data);
    } catch (err) {
      console.log("Modules fetch error", err);
    } finally {
      setLoading(false);
    }
  };

  fetchModules();
}, []);


  return (
    <RoleContext.Provider value={{ modules, loading }}>
      {children}
    </RoleContext.Provider>
  );
};

export const useRole = () => useContext(RoleContext);
