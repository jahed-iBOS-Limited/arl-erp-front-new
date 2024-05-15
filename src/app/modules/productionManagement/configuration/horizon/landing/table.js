/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import moment from "moment";
import { useSelector, shallowEqual } from "react-redux";
import { useHistory } from "react-router-dom";
import Loading from "./../../../../_helper/_loading";
import {
  ModalProgressBar,
  Card,
  CardHeader,
  CardHeaderToolbar,
  CardBody,
} from "./../../../../../../_metronic/_partials/controls";
import PaginationTable from "./../../../../_helper/_tablePagination";
import NewSelect from "../../../../_helper/_select";
import { Formik, Form } from "formik";
import {
  getHorizonSearchData,
  getHorizonPlantDDL,
  getHorizonLandingYearDDL,
} from "../helper";

const initData = {
  year: "",
  plant: "",
};

const HorizonLanding = () => {
  const history = useHistory();

  // eslint-disable-next-line no-unused-vars
  const [gridData, setGridData] = useState([]);

  // eslint-disable-next-line no-unused-vars
  const [isloading, setIsLoading] = useState(false);

  //ddl
  const [plantNameDDL, setPlantNameDDL] = useState([]);
  const [horizonYearDDL, setHorizonYearDDL] = useState([]);

  //paginationState
  const [pageNo, setPageNo] = React.useState(1);
  const [pageSize, setPageSize] = React.useState(15);
  const [plant, setPlant] = React.useState({});
  const [year, setYear] = React.useState({});

  // get user profile data from store
  const profileData = useSelector((state) => {
    return state.authData.profileData;
  }, shallowEqual);

  // get selected business unit from store
  const selectedBusinessUnit = useSelector((state) => {
    return state.authData.selectedBusinessUnit;
  }, shallowEqual);

  useEffect(() => {
    getHorizonPlantDDL(
      profileData?.accountId,
      selectedBusinessUnit?.value,
      setPlantNameDDL
    );
  }, [profileData?.accountId, selectedBusinessUnit?.value]);

  // View Grid Data
  const viewHandler = (values) => {
    if (profileData?.accountId && selectedBusinessUnit?.value) {
      getHorizonSearchData(
        profileData?.accountId,
        selectedBusinessUnit?.value,
        values?.plant.value,
        values?.year.label,
        pageNo,
        pageSize,
        setGridData
      );
    }
  };

  const setPositionHandler = (pageNo, pageSize) => {
    getHorizonSearchData(
      profileData?.accountId,
      selectedBusinessUnit?.value,
      plant.value,
      year.label,
      pageNo,
      pageSize,
      setGridData
    );
  };

  return (
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
        <>
          <Card>
            {true && <ModalProgressBar />}
            <CardHeader title="Horizon Create Basic Information">
              <CardHeaderToolbar>
                <button
                  onClick={() =>
                    history.push(
                      "/production-management/configuration/horizon/create"
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
              {/* Form */}
              <Form className="global-form form form-label-right">
                <div className="form-group row">
                  <div className="col-lg-3">
                    <NewSelect
                      name="plant"
                      options={plantNameDDL}
                      label="Plant Name"
                      onChange={(valueOption) => {
                        setFieldValue("plant", valueOption);
                        setPlant(valueOption);
                        getHorizonLandingYearDDL(
                          profileData?.accountId,
                          selectedBusinessUnit?.value,
                          valueOption?.value,
                          setHorizonYearDDL
                        );
                        setFieldValue("year", "");
                      }}
                      errors={errors}
                      touched={touched}
                    />
                  </div>
                  <div className="col-lg-3">
                    <NewSelect
                      name="year"
                      options={horizonYearDDL}
                      value={values?.year}
                      label="Year"
                      onChange={(valueOption) => {
                        setFieldValue("year", valueOption);
                        setYear(valueOption);
                      }}
                      errors={errors}
                      touched={touched}
                    />
                  </div>
                  <div className="col-lg-3 pt-7">
                    <button
                      onClick={() => viewHandler(values)}
                      type="button"
                      className="btn btn-primary"
                    >
                      View
                    </button>
                  </div>
                </div>
              </Form>
              {/* Form End */}
              <div className="table-responsive">
                <table className="table table-striped table-bordered mt-3 bj-table bj-table-landing">
                  <thead>
                    <tr>
                      <th>SL</th>
                      <th>Horizon Type</th>
                      <th>Horizon Name</th>
                      <th>From Date</th>
                      <th>To Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {gridData?.data?.length > 0 &&
                      gridData?.data?.map((item, index) => {
                        return (
                          <tr key={index}>
                            <td
                              style={{ width: "30px" }}
                              className="text-center"
                            >
                              {index + 1}
                            </td>
                            <td>
                              <span className="pl-2">
                                {item?.strPlanningHorizonType}
                              </span>
                            </td>
                            <td>
                              <span className="pl-2">
                                {item?.strPlanningHorizonName}
                              </span>
                            </td>
                            <td>
                              <span className="pl-2">
                                {moment(item?.dteStartDateTime).format(
                                  "YYYY-MM-DD"
                                )}
                              </span>
                            </td>
                            <td>
                              <span className="pl-2">
                                {moment(item?.dteEndDateTime).format(
                                  "YYYY-MM-DD"
                                )}
                              </span>
                            </td>
                          </tr>
                        );
                      })}
                  </tbody>
                </table>
              </div>

              {/* Pagination Code */}
              {gridData?.data?.length > 14 && (
                <PaginationTable
                  count={gridData?.totalCount}
                  setPositionHandler={setPositionHandler}
                  paginationState={{
                    pageNo,
                    setPageNo,
                    pageSize,
                    setPageSize,
                  }}
                />
              )}
            </CardBody>
          </Card>
        </>
      )}
    </Formik>
  );
};

export default HorizonLanding;
