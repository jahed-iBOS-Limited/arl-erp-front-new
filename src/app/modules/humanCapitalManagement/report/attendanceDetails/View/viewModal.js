/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import { Form, Formik } from "formik";
import IViewModal from "../../../../_helper/_viewModal";
import { useHistory } from "react-router-dom";
import { getEmployeeAttendenceDetailsInOutReport } from "../helper";
import { _dateFormatter } from "../../../../_helper/_dateFormate";

const initData = {};

export default function ViewForm({ id, show, onHide }) {
  const [singleData, setSingleData] = useState([]);

  console.log(singleData, 'singleData')
  const [isLoading, setLoading] = useState(false);
  const history = useHistory();
  let empId = history?.location?.state?.values?.employee?.value;
  let fromNtoDate = _dateFormatter(history?.location?.state?.td?.Attendance);
  useEffect(() => {
    if (id) {
      getEmployeeAttendenceDetailsInOutReport(
        1,
        empId,
        fromNtoDate,
        fromNtoDate,
        setSingleData,
        setLoading
      );
    }
  }, [id]);
  return (
    <div className="adjustment-journal-modal">
      <IViewModal
        show={show}
        onHide={onHide}
        isShow={false}
        title="View Attendance Details"
        style={{ fontSize: "1.2rem !important" }}
      >
        <>
          <Formik
            enableReinitialize={true}
            initialValues={id ? singleData : initData}
          >
            {({
              handleSubmit,
              resetForm,
              values,
              errors,
              touched,
              setFieldValue,
              isValid,
            }) => (
              <>
                {/* {setInitValue(values,setFieldValue)} */}
                <Form className="form form-label-right">
                  <div className="row">
                    <div className="col-lg-12">
                      <>
                        <table className="table table-striped table-bordered mt-3 bj-table bj-table-landing sales_order_landing_table mr-1">
                          <thead>
                            <tr>
                              <th>Attendance Date</th>
                              <th>In-Time</th>
                              <th>Machine Address</th>
                              <th>Out-Time</th>
                            </tr>
                          </thead>
                          {singleData.length > 0 && (
                            <tbody>
                              {singleData?.map((td, index) => (
                                <tr>
                                  <td>
                                    <div className="pl-2">{td?.Attendance}</div>
                                  </td>
                                  <td>
                                    <div className="pl-2">{td?.InTime}</div>
                                  </td>
                                  <td>
                                    <div className="pl-2">{td?.MAddress}</div>
                                  </td>
                                  <td>
                                    <div className="text-right pr-2">
                                      {td?.OutTime}
                                    </div>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          )}
                        </table>
                      </>
                    </div>
                  </div>
                </Form>
              </>
            )}
          </Formik>
        </>
      </IViewModal>
    </div>
  );
}
