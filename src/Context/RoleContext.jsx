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
import { useLocation } from "react-router-dom";

const RoleContext = createContext(null);

export const RoleProvider = ({ children }) => {
  const [modules, setModules] = useState([]);
  const [agentRoles, setAgentRoles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [agents, setAgents] = useState([]);
  const [accessError,setAccessError] = useState("")
  const [adminPermissions, setAdminPermissions] = useState([]);
  const [adminDetails, setAdminDetails] = useState(null);
const location = useLocation();
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

//  useEffect(() => {
//   fetchModules();
//     getAdminDetails();   
// }, []);
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
      setAccessError(msg)
      return { success: false, message: msg };
    } finally {
      setLoading(false);
    }
  };

  // Auto load modules on mount
//  useEffect(() => {

//   const token =
//     localStorage.getItem("access_token") ||
//     localStorage.getItem("mock_token");

//   if (!token) return;

//   fetchModules();
//   getAdminDetails();

// }, []);

const isTokenValid = (token) => {
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    const currentTime = Date.now() / 1000;
    return payload.exp > currentTime;
  } catch {
    return false;
  }
};

useEffect(() => {

  const token =
    localStorage.getItem("access_token") ||
    localStorage.getItem("mock_token");

  if (!token || !isTokenValid(token)) {
    localStorage.removeItem("access_token");
    localStorage.removeItem("mock_token");
    return;
  }


  if (modules.length === 0) {
    fetchModules();
  }

  if (!adminDetails) {
    getAdminDetails();
  }

}, [location.pathname]);
  const createAgentRole = async (payload) => {
    try {
      setLoading(true);
      setErrorMsg("");

      const res = await api.post("/v2/agent-role", payload);

      if (res.status === 200 || res.status === 201) {
        await getAgentRoles(); 
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

    if (res?.status === 200 || res?.status === 201) {
      return { success: true, data: res.data , message: "Created Successfully" };
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
const getAgentRoleById = async (roleId) => {
  try {
    setLoading(true);

    const res = await api.get(`/v2/agent-role/${roleId}`);

    if (res.status === 200) {
      return { success: true, data: res.data };
    }

    return { success: false };
  } catch (error) {

    if (error?.response?.status === 500) {
      return {
        success: false,
        message: "Internal Server Error",
      };
    }

    const msg = getErrorMessage(error);

    return {
      success: false,
      message: msg,
    };

  } finally {
    setLoading(false);
  }
};
// const getAgentRoleById = async (roleId) => {
//   try {
//     setLoading(true);

//     const res = await api.get(`/v2/agent-role/${roleId}`);

//     if (res.status === 200) {
//       return { success: true, data: res.data };
//     }

//     return { success: false };
//   } catch (error) {
//     const msg = getErrorMessage(error);
//     return { success: false, message: msg };
//   } finally {
//     setLoading(false);
//   }
// };

const deleteAgentRole = async (roleId) => {
  try {
    setLoading(true);
    setErrorMsg("");

    const res = await api.delete(`/v2/agent-role/${roleId}`);

    if (res.status === 200 || res.status === 204) {
      await getAgentRoles(); // refresh list after delete
      return { success: true, message: "Deleted Successfully" };
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
const getAdminDetails = async () => {
  try {
    setLoading(true);
    setErrorMsg("");

    const res = await api.get("/v2/admin");

    if (res.status === 200) {
      setAdminPermissions(res.data.permissions || []);
      setAdminDetails(res.data); 
       console.log("addmi",adminPermissions)
      return { success: true, data: res.data};
     
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
const getAllAgents = async ({
  name = "",
  isActive = true,
  roleId = "",
  page = 1,
  size = 10
} = {}) => {

  try {

    setLoading(true);
    setErrorMsg("");

    const res = await api.get("/v2/admin/get-all-agents", {
      params: {
        name,
        isActive,
        roleId: roleId || undefined,
        page,
        size
      }
    });

    if (res.status === 200) {

      setAgents(res.data || []);

      return {
        success: true,
        data: res.data
      };
    }

    return { success: false };

  } catch (error) {

    const msg = getErrorMessage(error);

    setErrorMsg(msg);
    setAccessError(msg);

    return {
      success: false,
      message: msg
    };

  } finally {

    setLoading(false);

  }
};
// const getAllAgents = async () => {
//   try {
//     setLoading(true);
//     setErrorMsg("");

//     const res = await api.get("/v2/admin/get-all-agents");

//     if (res.status === 200) {
//       setAgents(res.data || []);
//       return { success: true, data: res.data };
//     }

//     return { success: false };
//   } catch (error) {
//     const msg = getErrorMessage(error);
//     setErrorMsg(msg);
//     setAccessError(msg)
//     return { success: false, message: msg };
//   } finally {
//     setLoading(false);
//   }
// };
const deactivateAgent = async (agentId) => {
  try {
    setLoading(true);
    setErrorMsg("");

    const res = await api.put(`/v2/admin/deactivate-agent/${agentId}`);

    if (res.status === 200) {
      await getAllAgents(); // refresh list
      return { success: true, message: "Agent Deactivated Successfully" };
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
const assignStaff = async (demoRequestId, agentId,comments) => {
  try {
    const res = await api.put(
      `/v2/demo-request/assign/${demoRequestId}`,
      {
        agentId: agentId,
         comments: comments
      }
    );

    if (res.status === 200) {
      return { success: true };
    }

    return { success: false };

  } catch (error) {
    const msg = getErrorMessage(error);
    return { success: false, message: msg };
  }
};
const reactivateAgent = async (agentId) => {
  try {
    setLoading(true);
    setErrorMsg("");

    const res = await api.put(`/v2/admin/reactivate-agent/${agentId}`);

    if (res.status === 200) {
      await getAllAgents(); // 🔥 refresh list
      return { success: true, message: "Agent Reactivated Successfully" };
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
const getAgentDetails = async (agentId) => {
  try {
    setLoading(true);
    setErrorMsg("");

    const res = await api.get(`/v2/admin/agent-details/${agentId}`);

    if (res.status === 200) {
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

const updateAdminRole = async (agentId, payload) => {
  try {
    setLoading(true);

    const res = await api.put(
      `/v2/admin/update-role/${agentId}`,
      payload
    );

    if (res.status === 200) {
      await getAllAgents(); // refresh table
      return { success: true, message: "Role Updated Successfully" };
    }

    return { success: false };
  } catch (error) {
    const msg = getErrorMessage(error);
    return { success: false, message: msg };
  } finally {
    setLoading(false);
  }
};
const getAgentRoleDropdown = async () => {
  try {
    setLoading(true);

    const res = await api.get("/v2/agent-role/dropdown");

    if (res.status === 200) {
      return {
        success: true,
        data: res.data || []
      };
    }

    return { success: false };

  } catch (error) {

    const msg = getErrorMessage(error);

    return {
      success: false,
      message: msg
    };

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
        adminDetails,  
        fetchModules,
        getAgentRoles,createAgentRole,createAdmin,
        updateAgentRole,getAgentRoleById,deleteAgentRole,getAdminDetails,getAllAgents,agents,accessError,deactivateAgent, adminPermissions,
        assignStaff,reactivateAgent,getAgentDetails,updateAdminRole,getAgentRoleDropdown
      }}
    >
      {children}
    </RoleContext.Provider>
  );
};

export const useRole = () => useContext(RoleContext);
