import React, { useState } from "react";
import ExpenseReport from "./expense";
import IncomeReport from "./income";
import JVListTable from "./journals/jvList";

export default function ReportTabs() {
  const [tabs, setTabs] = useState([
    { id: 1, title: "Income Report", isActive: true },
    { id: 2, title: "Expense Report", isActive: false },
    { id: 3, title: "JV List", isActive: false },
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
      {tabs[0]?.isActive && <IncomeReport />}
      {tabs[1]?.isActive && <ExpenseReport />}
      {tabs[2]?.isActive && <JVListTable />}
    </div>
  );
}
