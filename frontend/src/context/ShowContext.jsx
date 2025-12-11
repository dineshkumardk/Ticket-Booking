import { useEffect, useState } from "react";
import { api } from "../api/api";
import { ShowContext } from "./ShowContextProvider";

export function ShowProvider({ children }) {
  const [shows, setShows] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    
    const fetchShows = async () => {
      if (isMounted) setLoading(true);
      const data = await api.getShows();
      if (isMounted) {
        setShows(data);
        setLoading(false);
      }
    };
    
    fetchShows();
    
    return () => {
      isMounted = false;
    };
  }, []);

  const refresh = async () => {
    setLoading(true);
    const data = await api.getShows();
    setShows(data);
    setLoading(false);
  };

  return (
    <ShowContext.Provider value={{ shows, loading, refresh }}>
      {children}
    </ShowContext.Provider>
  );
}