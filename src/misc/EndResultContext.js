// EndResultContext.js
import React, { createContext, useContext, useState } from 'react';

const EndResultContext = createContext();

export const useEndResult = () => {
  return useContext(EndResultContext);
};

export const EndResultProvider = ({ children }) => {
  const [endResultForEndGame, setEndResultForEndGame] = useState(0);
  return (
    <EndResultContext.Provider value={{ endResultForEndGame, setEndResultForEndGame }}>
      {children}
    </EndResultContext.Provider>
  );
};
