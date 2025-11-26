import { createContext, useContext } from "react";
import { useDashboardData } from "../../hooks/useDashboardData";

const DashboardDataContext = createContext();

export const DashboardDataProvider = ({ children }) => {
  const dashboardData = useDashboardData();

  return (
    <DashboardDataContext.Provider value={dashboardData}>
      {children}
    </DashboardDataContext.Provider>
  );
};

export const useDashboard = () => {
  const context = useContext(DashboardDataContext);
  if (!context) {
    throw new Error("useDashboard debe usarse dentro de DashboardDataProvider");
  }
  return context;
};

