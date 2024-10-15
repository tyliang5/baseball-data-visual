import React, { createContext, useState } from 'react';

export const BaseballDataContext = createContext();

export const BaseballDataProvider = ({ children }) => {
    const [data, setData] = useState([]);

    return (
        <BaseballDataContext.Provider value={{ data, setData }}>
            {children}
        </BaseballDataContext.Provider>
    );
};
