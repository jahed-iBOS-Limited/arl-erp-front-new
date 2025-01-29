/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from "react";
import { useSelector, shallowEqual } from "react-redux";
import {
  ModalProgressBar,
  Card,
  CardBody,
  CardHeader,
} from "../../../../../../../_metronic/_partials/controls";
import IConfirmModal from "../../../../../_helper/_confirmModal";
import { _dateFormatter } from "../../../../../_helper/_dateFormate";
import { cancelMealPost, fetchPartOneMealDetails } from "../../helper/action";

// Part 1
function ScheduleMeal({ rowData, setRowData, empId }) {
  // get user profile data from store
  const profileData = useSelector((state) => {
    return state.authData.profileData;
  }, shallowEqual);

  useEffect(() => {
    fetchPartOneMealDetails(profileData?.employeeId, setRowData);
  }, []);

  const cancelHandler = (date) => {
    let confirmObject = {
      title: "Are you sure?",
      message: `If you delete this, it can not be undone ${_dateFormatter(
        date
      )}`,
      yesAlertFunc: async () => {
        cancelMealPost(
          date,
          empId,
          setRowData,
          profileData?.userId
        );
      },
      noAlertFunc: () => {
        "";
      },
    };
    IConfirmModal(confirmObject);
  };

  return (
    <div className="padding-free">
      <Card>
        {true && <ModalProgressBar />}
        <CardHeader title="Schedule Meal"></CardHeader>
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
                <th className="border" style={{ textAlign: "center" }}>
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {rowData.length > 0 &&
                rowData.map((item, index) => {
                  return (
                    <tr key={index}>
                      <td className="border">{index + 1}</td>
                      <td className="border text-center">
                        {_dateFormatter(item?.dteMeal)}
                      </td>
                      <td className="border text-center">{item?.MealNo}</td>
                      <td
                        onClick={() => cancelHandler(item?.dteMeal)}
                        className="border d-flex align-items-center justify-content-center"
                      >
                        <span className="deleteBtn">delete</span>
                      </td>
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

export default ScheduleMeal;
