import React, { useState } from "react";
import { useSelector, shallowEqual } from "react-redux";
import { useHistory } from "react-router-dom";
import { Formik } from "formik";
import * as Yup from "yup";
import { Form } from "react-bootstrap";
import IEdit from "../../../../_helper/_helperIcons/_edit";
import IView from "../../../../_helper/_helperIcons/_view";
import ICheckout from "../../../../_helper/_helperIcons/_checkout";
import Loading from "../../../../_helper/_loading";
import PaginationTable from "../../../../_helper/_tablePagination";
import { getRoutePlanLanding } from "../helper";
import InputField from "../../../../_helper/_inputField";
import { _todayDate } from "../../../../_helper/_todayDate";

// Validation schema
const validationSchema = Yup.object().shape({
  tourDate: Yup.date().required("Tour Date is required"),
});

const initData = {
  tourDate: _todayDate(),
};

export function TableRow({ saveHandler }) {
  // const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const history = useHistory();

  //paginationState
  const [pageNo, setPageNo] = useState(0);
  const [pageSize, setPageSize] = useState(15);
  const [gridData, setGridData] = useState([]);

  // get user profile data from store
  const profileData = useSelector((state) => {
    return state.authData.profileData;
  }, shallowEqual);

  // get selected business unit from store
  const selectedBusinessUnit = useSelector((state) => {
    return state.authData.selectedBusinessUnit;
  }, shallowEqual);

  //setPositionHandler
  const setPositionHandler = (pageNo, pageSize, values) => {
    getRoutePlanLanding(
      profileData.accountId,
      selectedBusinessUnit.value,
      setLoading,
      pageNo,
      pageSize,
      values?.tourDate,
      setGridData
    );
  };

  return (
    <>
      {loading && <Loading />}
      <Formik
        enableReinitialize={true}
        initialValues={initData}
        validationSchema={validationSchema}
        onSubmit={(values, { setSubmitting, resetForm }) => {
          saveHandler(values, () => {
            resetForm(initData);
          });
        }}
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
            <Form className="form form-label-right">
              <div className="row">
                <div className="col-lg-12">
                  <div className="row bank-journal bank-journal-custom bj-left">
                    <>
                      <div className="col-lg-2 mb-2">
                        <InputField
                          type="date"
                          value={values?.tourDate}
                          label="Tour Month"
                          placeholder="Tour Month"
                          name="tourDate"
                        />
                      </div>
                      <div className="col-lg-1 mt-3">
                        <button
                          type="button"
                          className="btn btn-primary"
                          onClick={() => {
                            getRoutePlanLanding(
                              profileData.accountId,
                              selectedBusinessUnit.value,
                              setLoading,
                              pageNo,
                              pageSize,
                              values?.tourDate,
                              setGridData
                            );
                          }}
                        >
                          View
                        </button>
                      </div>
                      <div className="col-lg-1 mt-3">
                        <button
                          type="button"
                          className="btn btn-primary"
                          onClick={() => {
                            history.push({
                              pathname: `/rtm-management/salesforceManagement/salesforceRouteSetup/add`,
                              state: values,
                            });
                          }}
                          disabled={!values?.tourDate}
                        >
                          Create
                        </button>
                      </div>
                    </>
                  </div>
                </div>
              </div>
            </Form>
            {/* Table Start */}
            {/* {loading && <Loading />} */}
            <div className="row cash_journal routeSetup-table">
              <div className="col-lg-12 pr-0 pl-0">
                {gridData?.data?.length > 0 && (
                  <table className="table table-striped table-bordered mt-3 bj-table bj-table-landing sales_order_landing_table">
                    <thead>
                      <tr>
                        <th style={{ width: "30px" }}>SL</th>
                        <th>Employee Name</th>
                        <th>Distribution Channel</th>
                        <th>Approve Status</th>
                        <th style={{ width: "90px" }}>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {gridData?.data?.map((td, index) => (
                        <tr key={index}>
                          <td className="text-center">{td?.sl}</td>
                          <td>
                            <div className="pl-2">{td?.employeeName}</div>
                          </td>
                          <td>
                            <div className="pl-2">
                              {td?.distributionChannelName}
                            </div>
                          </td>
                          <td>
                            <div className="pl-2">{td?.status}</div>
                          </td>
                          <td>
                            <div className="d-flex justify-content-around">
                              <button
                                type="button"
                                className="btn"
                                onClick={() => {
                                  history.push(
                                    `/rtm-management/salesforceManagement/salesforceRouteSetup/edit/${td?.employeeId}/${td?.tourId}`
                                  );
                                }}
                                disabled={td?.status === "Approved"}
                              >
                                <span className="edit">
                                  <IEdit />
                                </span>
                              </button>

                              <button type="button" className="btn">
                                <span className="view">
                                  <IView
                                    clickHandler={() => {
                                      history.push(
                                        `/rtm-management/salesforceManagement/salesforceRouteSetup/view/${td?.employeeId}/${td?.tourId}`
                                      );
                                    }}
                                  />
                                </span>
                              </button>

                              <button type="button" className="btn">
                                <span
                                  className="view"
                                  style={{ cursor: "pointer" }}
                                >
                                  <ICheckout
                                    title="Approve"
                                    checkout={() => {
                                      history.push(
                                        `/rtm-management/salesforceManagement/salesforceRouteSetup/approve/${td?.employeeId}/${td?.tourId}`
                                      );
                                    }}
                                    id={td?.tourId}
                                  />
                                </span>
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
                {gridData?.data?.length > 0 && (
                  <PaginationTable
                    count={gridData?.counts}
                    setPositionHandler={setPositionHandler}
                    paginationState={{
                      pageNo,
                      setPageNo,
                      pageSize,
                      setPageSize,
                    }}
                    values={values}
                  />
                )}
              </div>
            </div>
          </>
        )}
      </Formik>
    </>
  );
}
