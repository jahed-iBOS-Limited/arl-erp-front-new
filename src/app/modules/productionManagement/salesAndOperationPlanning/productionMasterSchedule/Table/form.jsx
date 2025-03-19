import React, { useState, useEffect } from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { useHistory } from "react-router-dom";
import { useSelector } from "react-redux";
import GridData from "./grid";
import { shallowEqual } from "react-redux";

import {
  ModalProgressBar,
  Card,
  CardBody,
  CardHeader,
  CardHeaderToolbar,
} from "./../../../../../../_metronic/_partials/controls";
import PaginationTable from "../../../../_helper/_tablePagination";
import NewSelect from "./../../../../_helper/_select";
import {
  getMasterSchedulingLandingPlant,
  getMasterSchedulingLandingYear,
  getMasterSchedulingLandingHorizon,
  getMasterSchedulingLandingPageData,
} from "../helper";

// Validation schema
const validationSchema = Yup.object().shape({});

const initData = {
  id: undefined,
  plant: "",
  year: "",
  horizon: "",
};

export default function HeaderForm() {
  const [rowData] = useState([]);
  const [loading] = useState(false);
  const [pageNo, setPageNo] = React.useState(0);
  const [pageSize, setPageSize] = React.useState(15);
  const [plantDDL, setPlantDDL] = React.useState([]);
  const [yearDDL, setYearDDL] = React.useState([]);
  const [gridData, setGridData] = React.useState([]);
  const [shedulingHorizonDDL, setShedulingHorizonDDL] = React.useState([]);

  const history = useHistory();
  // get user profile data from store
  const profileData = useSelector((state) => {
    return state.authData.profileData;
  }, shallowEqual);

  // get selected business unit from store
  const selectedBusinessUnit = useSelector((state) => {
    return state.authData.selectedBusinessUnit;
  }, shallowEqual);

  useEffect(() => {
    if (selectedBusinessUnit?.value && profileData?.accountId) {
    }
  }, [selectedBusinessUnit, profileData]);

  const setPositionHandler = (pageNo, pageSize) => {};

  useEffect(() => {
    getMasterSchedulingLandingPlant(
      profileData?.accountId,
      selectedBusinessUnit?.value,
      setPlantDDL
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={initData}
        validationSchema={validationSchema}
        onSubmit={(values, { setSubmitting, resetForm }) => {}}
      >
        {({ errors, touched, setFieldValue, isValid, values }) => (
          <>
            <Card>
              {true && <ModalProgressBar />}
              <CardHeader title={"Production Master Schedule"}>
                <CardHeaderToolbar>
                  <button
                    onClick={() => {
                      history.push(
                        "/production-management/salesAndOperationsPlanning/productionMasterSchedule/add"
                      );
                    }}
                    className="btn btn-primary"
                  >
                    Create
                  </button>
                </CardHeaderToolbar>
              </CardHeader>
              <CardBody>
                <Form className="form form-label-right">
                  <div className="row global-form">
                    <div className="col-lg-3">
                      <NewSelect
                        name="plant"
                        options={plantDDL}
                        value={values?.plant}
                        label="Plant"
                        onChange={(valueOption) => {
                          setFieldValue("plant", valueOption);
                          setFieldValue("year", "");
                          setFieldValue("horizon", "");
                          getMasterSchedulingLandingYear(
                            profileData?.accountId,
                            selectedBusinessUnit?.value,
                            valueOption?.value,
                            setYearDDL
                          );
                        }}
                        placeholder="Plant"
                        errors={errors}
                        touched={touched}
                      />
                    </div>
                    <div className="col-lg-3">
                      <NewSelect
                        name="year"
                        options={yearDDL}
                        value={values?.year}
                        label="Year"
                        onChange={(valueOption) => {
                          setFieldValue("year", valueOption);
                          setFieldValue("horizon", "");
                          getMasterSchedulingLandingHorizon(
                            profileData?.accountId,
                            selectedBusinessUnit?.value,
                            values?.plant?.value,
                            valueOption?.label,
                            setShedulingHorizonDDL
                          );
                        }}
                        placeholder="Year"
                        errors={errors}
                        touched={touched}
                      />
                    </div>
                    <div className="col-lg-3">
                      <NewSelect
                        name="horizon"
                        options={shedulingHorizonDDL}
                        value={values?.horizon}
                        label="Horizon"
                        onChange={(valueOption) => {
                          setFieldValue("horizon", valueOption);
                        }}
                        placeholder="Horizon"
                        errors={errors}
                        touched={touched}
                      />
                    </div>
                    <div className="col-lg-3 mt-5">
                      <button
                        onClick={() => {
                          getMasterSchedulingLandingPageData(
                            profileData?.accountId,
                            selectedBusinessUnit?.value,
                            values?.plant?.value,
                            values?.year?.label,
                            values?.horizon?.value,
                            setGridData
                          );
                        }}
                        className="btn btn-primary"
                        type="button"
                        disabled={
                          !values?.plant || !values?.year
                        }
                      >
                        View
                      </button>
                    </div>
                  </div>
                  <GridData
                    gridData={gridData}
                    loading={loading}
                    plant={values?.plant?.value}
                    year={values?.year?.label}
                    horizon={values?.horizon?.value}
                    setGridData={setGridData}
                  />
                </Form>
              </CardBody>
              {rowData?.data?.length > 0 && (
                <PaginationTable
                  count={rowData?.totalCount}
                  setPositionHandler={setPositionHandler}
                  paginationState={{ pageNo, setPageNo, pageSize, setPageSize }}
                />
              )}
            </Card>
          </>
        )}
      </Formik>
    </>
  );
}
