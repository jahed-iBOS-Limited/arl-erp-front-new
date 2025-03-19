/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from "react";
import {
  ModalProgressBar,
  Card,
  CardBody,
  CardHeader,
} from "../../../../../../../_metronic/_partials/controls";
import { useSelector, shallowEqual } from "react-redux";
import { fetchPartTwoMealDetails } from "../../helper/action";
import { _dateFormatter } from "../../../../../_helper/_dateFormate";

// Part 2
function ConsumeMeal({ setConsumeData, consumeData }) {
  // get user profile data from store
  const profileData = useSelector((state) => {
    return state.authData.profileData;
  }, shallowEqual);

  useEffect(() => {
    fetchPartTwoMealDetails(profileData.employeeId, setConsumeData);
  }, []);

  return (
    <div className="padding-free">
      <Card>
        {true && <ModalProgressBar />}
        <CardHeader title="Consume Meal"></CardHeader>
        <CardBody>
        <div className="table-responsive">
          <table className="global-table border">
            <thead className="border">
              <tr>
                <th className="border" style={{ textAlign: "center" }}>
                  SL
                </th>
                <th className="border" style={{ textAlign: "center" }}>
                  Date
                </th>
                <th className="border" style={{ textAlign: "center" }}>
                  No of Meal
                </th>
              </tr>
            </thead>
            <tbody>
              {consumeData.length > 0 &&
                consumeData.map((item, index) => {
                  return (
                    <tr key={index}>
                      <td className="border">{index + 1}</td>
                      <td className="border text-center">
                        {_dateFormatter(item.dteMeal)}
                      </td>
                      <td className="border text-center">{item.MealNo}</td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}

export default ConsumeMeal;
