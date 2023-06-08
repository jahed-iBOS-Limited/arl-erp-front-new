import React, { useState, useEffect } from "react";
import IViewModal from "../../../../_helper/_viewModal";
import Loading from "./../../../../_helper/_loading";
import { getSingleData } from "../helper";
export default function RosterModel({ id, show, onHide, modelData }) {
  const [rowDto, setRowDto] = useState([]);
  const [, setInitDataForEdit] = useState([]);
  const [isDisabled, setDisabled] = useState(false);
  useEffect(() => {
    if (modelData) {
      getSingleData(modelData, setRowDto, setInitDataForEdit, setDisabled);
    }
  }, [modelData]);
  return (
    <div>
      <IViewModal
        show={show}
        onHide={onHide}
        title={"Roster View"}
        btnText="Close"
      >
        <div className="">
          <div className="row sales-invoice-model  m-0">
            <div className="col-lg-12 p-0">
              <table className="table table-striped table-bordered mt-3 bj-table bj-table-landing">
                <thead>
                  <tr>
                    <th>SL</th>
                    <th>Calendar</th>
                    <th>No. of Change Days</th>
                    <th>Next Calendar</th>
                  </tr>
                </thead>
                <tbody>
                  {isDisabled && <Loading />}
                  {rowDto?.map((item, index) => (
                    <tr key={index}>
                      <td>{index + 1}</td>
                      <td>{item?.calender?.label}</td>
                      <td className="text-center">{item?.noOfChangeDays}</td>
                      <td>{item?.nextCalender?.label}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </IViewModal>
    </div>
  );
}
