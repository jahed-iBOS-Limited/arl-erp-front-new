/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from "react";
import IViewModal from "../../../../_helper/_viewModal";
import { getSaleForceTerritoryById } from "../_redux/Actions";
import { useSelector, shallowEqual, useDispatch } from "react-redux";

export default function ViewForm({ id, show, onHide }) {
  const dispatch = useDispatch();

  useEffect(() => {
    if (id) {
      dispatch(getSaleForceTerritoryById(id));
    }
  }, [id]);

  // get view modal data from store
  const modalData = useSelector((state) => {
    return state.salesForceTerritoryConig?.singleData;
  }, shallowEqual);

  return (
    <div>
      <IViewModal
        show={show}
        onHide={onHide}
        title={modalData?.objHeader?.territoryTypeName || ""}
        isShow={modalData && false}
      >
        {console.log(modalData?.objHeader?.territoryTypeName)}
        <div className="row">
          <div className="col">
            {modalData?.objRow?.length ? (
              <div className="table-responsive">
                <table className="table table-striped table-bordered mt-3 bj-table bj-table-landing sales_order_landing_table">
                  <thead>
                    <tr>
                      <th>Sl</th>
                      <th>Territory</th>
                      <th>Sales Person</th>
                      <th>Email</th>
                    </tr>
                  </thead>
                  <tbody>
                    {modalData?.objRow?.map((itm, idx) => (
                      <tr>
                        <td>{idx + 1}</td>
                        <td>{itm.territoryName}</td>
                        <td>{`${itm.employeeName}-${itm.employeeCode}`}</td>
                        <td>{itm.email}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>{" "}
              </div>
            ) : (
              <h3>No Data Found</h3>
            )}
          </div>
        </div>
      </IViewModal>
    </div>
  );
}
