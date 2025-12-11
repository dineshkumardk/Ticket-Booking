import { useEffect, useState } from "react";
import { api } from "../api/api";
import { ShowContext } from "./ShowContextProvider";

export function ShowProvider({ children }) {
  const [shows, setShows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;
    
    const fetchShows = async () => {
      try {
        if (isMounted) {
          setLoading(true);
          setError(null);
        }
        const data = await api.getShows();
        if (isMounted) {
          setShows(data || []);
          setLoading(false);
        }
      } catch (err) {
        if (isMounted) {
          console.error('Error fetching shows:', err);
          setError(err.message || 'Failed to load shows');
          setShows([]);
          setLoading(false);
        }
      }
    };
    
    fetchShows();
    
    return () => {
      isMounted = false;
    };
  }, []);

  const refresh = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await api.getShows();
      setShows(data || []);
      setLoading(false);
    } catch (err) {
      console.error('Error refreshing shows:', err);
      setError(err.message || 'Failed to load shows');
      setLoading(false);
    }
  };

  return (
    <ShowContext.Provider value={{ shows, loading, error, refresh }}>
      {children}
    </ShowContext.Provider>
  );
}