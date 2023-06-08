/* eslint-disable react-hooks/exhaustive-deps */
import React, {useState } from "react";
import { useSelector, shallowEqual } from "react-redux";
import { useHistory } from "react-router-dom";
import { getLandingData } from "../helper";
import Loading from "./../../../../_helper/_loading";
import {
  Card,
  CardHeader,
  CardHeaderToolbar,
  CardBody,
  ModalProgressBar,
} from "./../../../../../../_metronic/_partials/controls";
import PaginationTable from "./../../../../_helper/_tablePagination";
import InputField from "../../../../_helper/_inputField";
import { Formik } from "formik";
import { _todayDate } from "../../../../_helper/_todayDate";
import { _dateFormatter } from '../../../../_helper/_dateFormate';

const initData = {
  outletName: "", // DDL
  fromDate: _todayDate(),
  toDate: "",
};

const OutletSurveyLanding = () => {
  const history = useHistory();

  const [gridData, setGridData] = useState();
  const [isloading, setIsLoading] = useState(false);

  //paginationState
  const [pageNo, setPageNo] = React.useState(0);
  const [pageSize, setPageSize] = React.useState(15);

  // get user profile data from store
  const profileData = useSelector((state) => {
    return state.authData.profileData;
  }, shallowEqual);

  // get selected business unit from store
  const selectedBusinessUnit = useSelector((state) => {
    return state.authData.selectedBusinessUnit;
  }, shallowEqual);

  // useEffect(() => {
  //   getLandingData(
  //     profileData?.accountId,
  //     selectedBusinessUnit?.value,
  //     isContinue,
  //     fromDate,
  //     setIsLoading,
  //     setGridData,
  //     pageNo,
  //     pageSize
  //   );
  // }, []);

  //setPositionHandler
  const setPositionHandler = (pageNo, pageSize, values) => {
    getLandingData(
      profileData?.accountId,
      selectedBusinessUnit?.value,
      values?.toDate ? false : true,
      values?.fromDate,
      setIsLoading,
      setGridData,
      pageNo,
      pageSize
    );
  };

  return (
    <>
      <Formik enableReinitialize={true} initialValues={initData}>
        {({
          handleSubmit,
          resetForm,
          values,
          errors,
          touched,
          setFieldValue,
          isValid,
        }) => (
          <Card>
            {true && <ModalProgressBar />}
            <CardHeader title="Survey List">
              <CardHeaderToolbar>
                <button
                  onClick={() =>
                    history.push(
                      "/rtm-management/configuration/outletsurvey/create"
                    )
                  }
                  className="btn btn-primary"
                >
                  Create
                </button>
              </CardHeaderToolbar>
            </CardHeader>
            <CardBody>
              {isloading && <Loading />}
              <div className="form-group global-form row">
                <div className="col-lg-3">
                  <label>From Date</label>
                  <InputField
                    value={values?.fromDate}
                    name="fromDate"
                    placeholder="From Date"
                    type="date"
                  />
                </div>
                {/* <div className="col-lg-3">
                  <label>To Date</label>
                  <InputField
                    value={values?.toDate}
                    name="toDate"
                    placeholder="To Date"
                    type="date"
                  />
                </div> */}
                <div className="col-lg-3 mt-5">
                  <button
                    onClick={() => {
                      getLandingData(
                        profileData?.accountId,
                        selectedBusinessUnit?.value,
                        values?.toDate ? false : true,
                        values?.fromDate,
                        setIsLoading,
                        setGridData,
                        pageNo,
                        pageSize
                      );
                    }}
                    type="button"
                    className="btn btn-primary px-3 py-1"
                  >
                    Show
                  </button>
                </div>
              </div>
              {gridData?.objdata?.length > 0 && (
                <div className="table-responsive">
                  <table className="table global-table table-striped table-bordered mt-3 bj-table bj-table-landing">
                    <thead>
                      <tr>
                        <th>SL</th>
                        <th>Survey Name</th>
                        <th>To Date</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {gridData?.objdata?.map((item, index) => (
                        <>
                          <tr>
                            <td className="text-center">{index + 1}</td>
                            <td>{item?.surveyName}</td>
                            <td className="text-center">{item?.valiedTo ? _dateFormatter(item?.valiedTo) : "-"}</td>
                            <td>
                              <div className="text-center">
                                <button
                                  type="button"
                                  onClick={() => {
                                    history.push(
                                      `/rtm-management/configuration/outletsurvey/view/${item?.surveyId}`
                                    );
                                  }}
                                  className="btn btn-light btn-sm"
                                >
                                  View
                                </button>
                              </div>
                            </td>
                          </tr>
                        </>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {/* Pagination Code */}
              {gridData?.objdata?.length > 0 && (
                <PaginationTable
                  count={gridData?.counts}
                  setPositionHandler={setPositionHandler}
                  paginationState={{ pageNo, setPageNo, pageSize, setPageSize }}
                  values={values}
                />
              )}
            </CardBody>
          </Card>
        )}
      </Formik>
    </>
  );
};

export default OutletSurveyLanding;
