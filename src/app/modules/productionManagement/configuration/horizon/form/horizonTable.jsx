/* eslint-disable react-hooks/exhaustive-deps */
import React from "react";
import { Formik } from "formik";

const HorizonTable = ({ gridData }) => {
  return (
    <Formik>
      {() => (
        <>
          <div className="table-responsive">
            <table className="table table-striped table-bordered mt-3 bj-table bj-table-landing">
              <thead>
                <tr>
                  <th>SL</th>
                  <th>Month Name</th>
                  <th>Start Date</th>
                  <th>End Date</th>
                </tr>
              </thead>
              <tbody>
                {gridData.length > 0 &&
                  gridData.map((item, index) => {
                    return (
                      <tr key={index}>
                        <td style={{ width: "30px" }} className="text-center">
                          {item.intSubHorizonId}
                        </td>
                        <td>
                          <span className="pl-2">
                            {item?.strPlanningHorizonName}
                          </span>
                        </td>
                        <td>
                          <span className="pl-2">{item?.dteStartDateTime}</span>
                        </td>
                        <td>
                          <span className="pl-2">{item?.dteEndDateTime}</span>
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </div>
        </>
      )}
    </Formik>
  );
};

export default HorizonTable;
