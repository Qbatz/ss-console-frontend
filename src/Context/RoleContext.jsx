// import React, { createContext, useContext, useEffect, useState } from "react";
// import api from "../Config/AxiosConfig";

// const RoleContext = createContext(null);

// export const RoleProvider = ({ children }) => {
//   const [modules, setModules] = useState([]);
//   const [loading, setLoading] = useState(true);

//  useEffect(() => {
//   const token = localStorage.getItem("access_token");

//   if (!token) {
//     setLoading(false);
//     return;
//   }

//   const fetchModules = async () => {
//     try {
//       const res = await api.get("/v2/modules");
      
//       setModules(res.data);
     
//     } catch (err) {
//       console.log("Modules fetch error", err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   fetchModules();
// }, []);


//   return (
//     <RoleContext.Provider value={{ modules, loading }}>
//       {children}
//     </RoleContext.Provider>
//   );
// };

// export const useRole = () => useContext(RoleContext);
import React, { createContext, useContext, useEffect, useState } from "react";
import api from "../Config/AxiosConfig";

const RoleContext = createContext(null);

export const RoleProvider = ({ children }) => {
  const [modules, setModules] = useState([]);
  const [agentRoles, setAgentRoles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

const getErrorMessage = (error) => {
  if (error?.response?.data) {
    if (typeof error.response.data === "string") {
      return error.response.data;
    }

    if (error.response.data.message) {
      return error.response.data.message;
    }

    return JSON.stringify(error.response.data);
  }

  return "Something went wrong";
};



  // 🔹 Fetch Modules
  const fetchModules = async () => {
    try {
      setLoading(true);
      const res = await api.get("/v2/modules");

      if (res.status === 200) {
        setModules(res.data || []);
      }
    } catch (error) {
      setErrorMsg(getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Fetch Agent Roles
  const getAgentRoles = async () => {
    try {
      setLoading(true);
      const res = await api.get("/v2/agent-role");

      if (res.status === 200) {
        setAgentRoles(res.data || []);
        return { success: true, data: res.data };
      }

      return { success: false };
    } catch (error) {
      const msg = getErrorMessage(error);
      setErrorMsg(msg);
      return { success: false, message: msg };
    } finally {
      setLoading(false);
    }
  };

  // Auto load modules on mount
  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (token) {
      fetchModules();
    }
  }, []);
  const createAgentRole = async (payload) => {
    try {
      setLoading(true);
      setErrorMsg("");

      const res = await api.post("/v2/agent-role", payload);

      if (res.status === 200 || res.status === 201) {
        await getAgentRoles(); // refresh list
        return { success: true, data: res.data };
      }

      return { success: false };
    } catch (error) {
      const msg = getErrorMessage(error);
      setErrorMsg(msg);
      return { success: false, message: msg };
    } finally {
      setLoading(false);
    }
  };
  const createAdmin = async (payload) => {
  try {
    setLoading(true);
    setErrorMsg("");

    const res = await api.post("/v2/admin", payload);

    if (res.status === 200 || res.status === 201) {
      return { success: true, data: res.data };
    }
  

    return { success: false };
  }
 catch (error) {
  const msg = getErrorMessage(error);

  console.log("API ERROR 👉", msg);  // 👈 add this

  return { success: false, message: msg };
}
  finally {
    setLoading(false);
  }
};

const updateAgentRole = async (roleId, payload) => {
  try {
    setLoading(true);
    setErrorMsg("");

    const res = await api.put(`/v2/agent-role/${roleId}`, payload);

    if (res.status === 200) {
      await getAgentRoles(); // refresh list
      return { success: true, data: res.data };
    }

    return { success: false };
  } catch (error) {
    const msg = getErrorMessage(error);
    setErrorMsg(msg);
    return { success: false, message: msg };
  } finally {
    setLoading(false);
  }
};

  return (
    <RoleContext.Provider
      value={{
        modules,
        agentRoles,
        loading,
        errorMsg,
        fetchModules,
        getAgentRoles,createAgentRole,createAdmin,updateAgentRole
      }}
    >
      {children}
    </RoleContext.Provider>
  );
};

export const useRole = () => useContext(RoleContext);
