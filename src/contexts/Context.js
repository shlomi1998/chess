import {createContext,useContext} from 'react';

const AppContext = createContext();

export function useAppContext() {
    // מחזירה את הערכים של AppContext
    return useContext(AppContext);
}

export default AppContext;
