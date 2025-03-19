import React, { useState } from "react";
import { shallowEqual, useSelector } from "react-redux";
import MealRequisition from "../form/mealRequsition/MealRequisition";
import MenuList from "../form/menuList/MenuList";
import ConsumeMeal from "./mealDetails/ConsumeMeal";
import ScheduleMeal from "./mealDetails/ScheduleMeal";
import "./style.css";

function FoodCornerLanding() {
  const { profileData } = useSelector((state) => {
    return state.authData;
  }, shallowEqual);

  const [rowData, setRowData] = useState([]);
  const [consumeData, setConsumeData] = useState([]);
  const [empId, setEmpId] = useState(profileData?.employeeId);
  return (
    <>
      <div className="container-fluid meal-details-css food-corner-card">
        <div className="row">
          <div className="col-md-6 w-100">
            <MealRequisition
              setRowData={setRowData}
              setConsumeData={setConsumeData}
              setEmpId={setEmpId}
            />
            <div className="row">
              <div className="col-md-6 w-100 m-0">
                <ScheduleMeal
                  rowData={rowData}
                  setRowData={setRowData}
                  setConsumeData={setConsumeData}
                  empId={empId}
                />
              </div>
              <div className="col-md-6 w-100 m-0">
                <ConsumeMeal
                  consumeData={consumeData}
                  setConsumeData={setConsumeData}
                />
              </div>
            </div>
          </div>
          <div className="col-md-6 w-100">
            <MenuList />
          </div>
        </div>
        <div></div>
      </div>
    </>
  );
}

export default FoodCornerLanding;
