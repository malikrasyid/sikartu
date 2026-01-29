import { createContext, useContext, useState, useCallback } from 'react';
import { getPerkara } from '../services/perkaraService';

const PerkaraContext = createContext();

export function PerkaraProvider({ children }) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isFetched, setIsFetched] = useState(false); // Tracks if we already have data

  // Function to fetch data. 
  // force = true will ignore cache and hit API (useful for Admin or refresh button)
  const fetchData = useCallback(async (force = false) => {
    // If we already have data and we are not forcing a refresh, do nothing (use cache)
    if (isFetched && !force && data.length > 0) {
        setLoading(false);
        return;
    }

    setLoading(true);
    try {
      const result = await getPerkara();
      setData(result);
      setIsFetched(true);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  }, [isFetched, data.length]);

  // Helper to force refresh (e.g., after adding new data)
  const refreshData = () => fetchData(true);

  return (
    <PerkaraContext.Provider value={{ data, loading, fetchData, refreshData, setData }}>
      {children}
    </PerkaraContext.Provider>
  );
}

export const usePerkara = () => useContext(PerkaraContext);