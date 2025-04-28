import { useContext, createContext, useState, useEffect } from "react";

const UserContext = createContext();

 function UserProvider({ children }) {
  const [auth, setAuth] = useState(null);


  useEffect(() => {
    const storedAuth = localStorage.getItem("Auth");
    if (storedAuth) {
      setAuth(JSON.parse(storedAuth));
    }
  }, []);

  const updateAuth = (newAuth) => {
    localStorage.setItem("Auth", JSON.stringify(newAuth));
    setAuth(newAuth);
  };

  return (
    <UserContext.Provider value={{ auth, updateAuth}}>
      {children}
    </UserContext.Provider>
  );
}

function useUser() {
  return useContext(UserContext);
}

export { UserProvider, useUser };





