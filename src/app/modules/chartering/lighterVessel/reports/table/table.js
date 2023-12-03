import React, { useState } from "react";
import { useHistory } from "react-router-dom";

export default function LighterVesselReportsTable() {
  const history = useHistory();
  const [tabs, setTabs] = useState([
    {
      id: 1,
      title: "Monthly Voyage Statement",
      path:
        "/chartering/lighterVessel/lighterVesselReport/monthlyVoyageStatement",
      isActive: false,
    },
    {
      id: 2,
      title: "Diesel Statement (monthly)",
      path: "/chartering/lighterVessel/lighterVesselReport/dieselStatement",
      isActive: false,
    },
    {
      id: 3,
      title: "Line Expense",
      path: "/chartering/lighterVessel/lighterVesselReport/lineExpense",
      isActive: false,
    },
    {
      id: 4,
      title: "Store Expense",
      path: "/chartering/lighterVessel/lighterVesselReport/storeExpense",
      isActive: false,
    },
    {
      id: 5,
      title: "Diesel Statement (for supplier)",
      path: "/chartering/lighterVessel/lighterVesselReport/dieselStatementTwo",
      isActive: false,
    },
    {
      id: 6,
      title: "Dispatch and Demurrage",
      path:
        "/chartering/lighterVessel/lighterVesselReport/lighterDispatchDemurrage",
      isActive: false,
    },
  ]);

  const changeStatus = (id) => {
    setTabs(
      tabs.map((tab) => {
        if (tab.id === id) {
          tab.isActive = true;
        } else {
          tab.isActive = false;
        }
        return tab;
      })
    );
  };

  return (
    <div>
      <div className="marine-form-card-content mb-2">
        <div className="row px-1">
          {tabs?.map((tab, index) => {
            return (
              <div className="col-lg-3 my-2" key={index}>
                <div
                  onClick={() => {
                    changeStatus(tab?.id);
                    history.push(tab?.path);
                  }}
                  className="p-3 shadow-sm rounded cursor-pointer"
                  style={{
                    backgroundColor: `${tab?.isActive ? "#bfdbfe" : "#fff"}`,
                  }}
                >
                  <h5 className="p-1 mb-0"> {tab?.title} </h5>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
