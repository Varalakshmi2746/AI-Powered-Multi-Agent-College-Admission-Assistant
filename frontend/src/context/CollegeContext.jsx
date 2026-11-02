import React, { createContext, useContext, useState, useEffect } from 'react';
import { collegeAPI } from '../services/api';

const CollegeContext = createContext();

export const CollegeProvider = ({ children }) => {
  const [colleges, setColleges] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedForCompare, setSelectedForCompare] = useState([]);

  const fetchColleges = async (params = {}) => {
    setLoading(true);
    try {
      const res = await collegeAPI.getAll(params);
      if (res.data.success) {
        setColleges(res.data.colleges);
      }
    } catch (err) {
      console.error('Failed to fetch colleges:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchColleges();
  }, []);

  const toggleCompare = (collegeId) => {
    setSelectedForCompare((prev) => {
      if (prev.includes(collegeId)) {
        return prev.filter((id) => id !== collegeId);
      } else {
        if (prev.length >= 4) {
          alert('You can compare a maximum of 4 colleges at a time.');
          return prev;
        }
        return [...prev, collegeId];
      }
    });
  };

  const clearCompare = () => setSelectedForCompare([]);

  return (
    <CollegeContext.Provider
      value={{
        colleges,
        loading,
        fetchColleges,
        selectedForCompare,
        toggleCompare,
        clearCompare,
      }}
    >
      {children}
    </CollegeContext.Provider>
  );
};

export const useColleges = () => useContext(CollegeContext);
