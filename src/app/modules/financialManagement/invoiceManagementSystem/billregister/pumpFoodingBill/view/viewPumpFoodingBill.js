/* eslint-disable react-hooks/exhaustive-deps */
import { Formik } from "formik";
import React, { useEffect, useRef, useState } from "react";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import {
  Card,
  CardBody,
  CardHeader,
  ModalProgressBar,
} from "../../../../../../../_metronic/_partials/controls";
import { _dateFormatter } from "../../../../../_helper/_dateFormate";
import Loading from "../../../../../_helper/_loading";
import { getDownlloadFileView_Action } from "../../../../../_helper/_redux/Actions";
import { _timeFormatter } from "../../../../../_helper/_timeFormatter";
import useAxiosGet from "../../../../../_helper/customHooks/useAxiosGet";

function ViewPumpFoodingBill({ billRegisterId }) {
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  // get profile data from store
  const {
    selectedBusinessUnit: { value: buId, label: buName, address: buAddress },
  } = useSelector((state) => state.authData, shallowEqual);
  const [rowData, getRowData, rowDataLoading] = useAxiosGet();
  const printRef = useRef();
  useEffect(() => {
    getRowData(
      `hcm/MenuListOfFoodCorner/GetPumpFoodingBillByBillRegisterId?businessUnitId=${buId}&billRegisterId=${billRegisterId}`
    );
  }, [buId]);
  const totalBillAmount = () => {
    if(rowData?.data?.length > 0){
      return rowData?.data?.reduce((acc,curr)=>acc+curr?.billAmount,0)
    }
  }
  return (
    <>
      <Formik>
        {({ handleSubmit, resetForm, values }) => (
          <Card>
            {(rowDataLoading || loading) && <Loading />}
            {true && <ModalProgressBar />}
            <CardHeader title={`Pump Fooding Bill`}></CardHeader>
            <CardBody>
              <form
                className="form form-label-right approveBillRegisterView"
                componentRef={printRef}
                ref={printRef}
              >
                <div className="row">
                  <div className="col-lg-12 ">
                    <div
                      className="text-center "
                      style={{ position: "relative" }}
                    >
                      <h2>{buName}</h2>
                      <h5>{buAddress} </h5>
                      <h3>{"Pump Fooding Bill"}</h3>

                      <button
                        type="button"
                        className="btn btn-primary printSectionNone"
                        style={{
                          padding: "2px 5px",
                          position: "absolute",
                          top: "0",
                          right: "0",
                        }}
                        onClick={(e) => {
                          e.stopPropagation();
                          if (rowData?.attachment) {
                            dispatch(
                              getDownlloadFileView_Action(
                                rowData?.attachment.attachment,
                                null,
                                null,
                                setLoading
                              )
                            );
                          } else {
                            toast.warn("No Attachment Found");
                          }
                        }}
                      >
                        <OverlayTrigger
                          overlay={
                            <Tooltip id="cs-icon">View Attachment</Tooltip>
                          }
                        >
                          <span className="ml-2">
                            <i
                              style={{ fontSize: "16px" }}
                              className={`fa pointer fa-eye`}
                              aria-hidden="true"
                            ></i>
                          </span>
                        </OverlayTrigger>
                        View Attachment
                      </button>
                    </div>
                  </div>
                </div>
                <div className="row mt-3">
                  <div className="col-lg-12 ">
                    <div className="table-responsive">
                      <table className="table table-striped table-bordered mt-3 global-table">
                        <thead>
                          <tr>
                            <th>SL</th>
                            <th>Employee Name</th>
                            <th>Designation</th>
                            <th>Position Name</th>
                            <th>Department</th>
                            <th>Workplace Name</th>
                            <th>Start Date</th>
                            <th>End Date</th>
                            <th>Bill Amount</th>
                            <th>Remarks</th>
                          </tr>
                        </thead>
                        <tbody>
                          {rowData?.data?.map((item, index) => {
                            return (
                              <tr key={index}>
                              <td
                                style={{ width: "30px" }}
                                className="text-center"
                              >
                                {index + 1}
                              </td>
                              <td>{item?.employeeName}</td>
                              <td>{item?.empDesignation}</td>
                              <td>{item?.positionName}</td>
                              <td>{item?.empDepartment}</td>
                              <td>{item?.workplaceName}</td>
                              <td>
                                <span>{_dateFormatter(item?.date)}</span>{" "}
                                <span>
                                  {_timeFormatter(item?.startTime)}
                                </span>
                              </td>
                              <td>
                                <span>{_dateFormatter(item?.endDate)}</span>{" "}
                                <span>{_timeFormatter(item?.endTime)}</span>
                              </td>
                              <td>{item?.billAmount}</td>
                              <td>{item?.remarks}</td>
                            </tr>
                            );
                          })}
                          <tr>
                            <td colSpan={8}>Total Bill Amount</td>
                             <td>{totalBillAmount()}</td>
                            <td/>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </form>
            </CardBody>
          </Card>
        )}
      </Formik>
    </>
  );
}

export default ViewPumpFoodingBill;
