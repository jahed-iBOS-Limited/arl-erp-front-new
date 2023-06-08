import React, { useEffect,useState } from "react";
import { useDispatch } from "react-redux";
import { _dateFormatter } from "../../../../_helper/_dateFormate";
import IView from "../../../../_helper/_helperIcons/_view";
import Loading from "../../../../_helper/_loading";
import { getDownlloadFileView_Action } from "../../../../_helper/_redux/Actions";
import {
  leaveAppLandingPagintaion_api,
  OfficialMoveLandingPagination_api,
} from "../helper";

const ApplicationTable = ({empId}) => {
  const [loading, setLoading] = useState(false);
  const [rowDto, setRowDto] = useState([]);
  const [, setRowDtoTwo] = useState([]);
  const dispatch = useDispatch();

  useEffect(() => {
    if (empId) {
      leaveAppLandingPagintaion_api(empId, setRowDto, setLoading);
      OfficialMoveLandingPagination_api(empId, setRowDtoTwo, setLoading);
    }
  }, [empId]);

  return (
    <>
      {loading && <Loading />}
      <h6 className="my-2">Leave Application Table</h6>
      <table className="table table-striped table-bordered mt-3 bj-table bj-table-landing sales_order_landing_table mr-1">
        <thead>
          <tr>
            <th style={{ width: "35px" }}>SL</th>
            <th style={{ width: "95px" }}>Application Type</th>
            <th style={{ width: "90px" }}>Submitted Date</th>
            <th style={{ width: "90px" }}>From Date</th>
            <th style={{ width: "90px" }}>To Date</th>
            <th>Reason</th>
            <th style={{ width: "60px" }}>Status</th>
            <th style={{ width: "62px" }}>Attachment</th>
          </tr>
        </thead>
        <tbody>
          {rowDto?.map((td, index) => (
            <tr key={index}>
              <td> {td?.sl} </td>
              <td>
                <div className="pl-2">{td?.leaveType}</div>
              </td>
              <td>
                <div className="text-center">
                  {_dateFormatter(td?.applicationDate)}
                </div>
              </td>
              <td>
                <div className="text-center">
                  {_dateFormatter(td?.appliedFromDate)}
                </div>
              </td>
              <td>
                <div className="text-center">
                  {_dateFormatter(td?.appliedToDate)}
                </div>
              </td>
              <td>
                <div className="text-left pl-2">{td?.reason}</div>
              </td>
              <td>
                <div className="pl-2">{td?.status}</div>
              </td>
              <td
                style={{
                  verticalAlign: "middle",
                  textAlign: "center",
                }}
              >
                <div className="">
                  {td?.documentFile && (
                    <IView
                      clickHandler={() => {
                        dispatch(getDownlloadFileView_Action(td?.documentFile));
                      }}
                    />
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
};

export default ApplicationTable;
