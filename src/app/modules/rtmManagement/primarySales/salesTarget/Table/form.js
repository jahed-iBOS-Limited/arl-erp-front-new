import React, { useState, useEffect } from "react";
import { Formik, Form } from "formik";
import NewSelect from "./../../../../_helper/_select";
import GridData from "./grid";
import ReactHTMLTableToExcel from "react-html-table-to-excel";
import {
  getMonthDDL_api,
  getRouteDDL_api,
  // creditNoteLandingPasignation_api
  getTerritoryDDL_api,
  SalesTargetLanding,
} from "../helper";
import { useSelector } from "react-redux";
import { shallowEqual } from "react-redux";
import {
  ModalProgressBar,
  Card,
  CardBody,
  CardHeader,
  CardHeaderToolbar,
} from "../../../../../../_metronic/_partials/controls";
import Loading from "../../../../_helper/_loading";

const initData = {
  territoryName: "",
  month: "",
  year: "",
  routeName: "",
};

export default function HeaderForm({ createHandler }) {

  const [loading, setLoading] = useState(false);
  const [territoryDDL, setTerritoryDDL] = useState([]);
  const [routeDDL, setRouteDDL] = useState([]);
  const [gridData, setGridData] = useState({});
  // eslint-disable-next-line no-unused-vars
  const [values, setValues] = useState({});
  const [monthDDL, setMonthDDL] = useState({});
  const [pageNo, setPageNo] = React.useState(0);
  const [pageSize, setPageSize] = React.useState(15);
  // get user profile data from store
  const storeData = useSelector((state) => {
    return {
      profileData: state?.authData?.profileData,
      selectedBusinessUnit: state?.authData?.selectedBusinessUnit,
    };
  }, shallowEqual);

  const { profileData, selectedBusinessUnit } = storeData;

  //FETCHING ALL DATA FROM helper.js

  useEffect(() => {
    getMonthDDL_api(setMonthDDL);
  }, []);

  useEffect(() => {
    if (profileData.accountId && selectedBusinessUnit?.value) {
      getTerritoryDDL_api(
        profileData.accountId,
        selectedBusinessUnit?.value,
        setTerritoryDDL
      );
    }
  }, [profileData, selectedBusinessUnit]);

  useEffect(() => {
    SalesTargetLanding(
      profileData?.accountId,
      selectedBusinessUnit?.value,
      territoryDDL[0]?.value,
      values?.month?.value,
      values?.year?.value,
      values?.routeName?.value,
      setGridData,
      setLoading,
      pageNo,
      pageSize
    );

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedBusinessUnit, profileData, territoryDDL]);

  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={{ ...initData, territoryDDL }}
        //validationSchema={validationSchema}
        onSubmit={(values, { setSubmitting, resetForm }) => {}}
      >
        {({ errors, touched, setFieldValue, isValid, values }) => (
          <>
            <Card>
              {true && <ModalProgressBar />}
              <CardHeader title={"Sales Target"}>
                <CardHeaderToolbar>
                  {/* <button
                    onClick={() => {
                      history.push({
                        pathname: `/rtm-management/primarySale/salesTarget/add`,
                        state: { values },
                      });
                    }}
                    className='btn btn-primary'
                  >
                    Create
                  </button> */}
                </CardHeaderToolbar>
              </CardHeader>
              <CardBody>
                {loading && <Loading />}
                <Form className='form form-label-right'>
                  <div className='row global-form'>
                    <div className='col-lg-3'>
                      <NewSelect
                        name='territoryName'
                        options={territoryDDL || []}
                        value={values?.territoryName}
                        label='Territory Name'
                        onChange={(valueOption) => {
                          setFieldValue("territoryName", valueOption);
                          setFieldValue("routeName", "");
                          getRouteDDL_api(
                            profileData?.accountId,
                            selectedBusinessUnit?.value,
                            valueOption?.value,
                            setRouteDDL
                          );
                        }}
                        placeholder='Territory Name'
                        errors={errors}
                        touched={touched}
                      />
                    </div>
                    <div className='col-lg-3'>
                      <NewSelect
                        name='routeName'
                        options={routeDDL || []}
                        value={values?.routeName}
                        label='Route Name'
                        onChange={(valueOption) => {
                          setFieldValue("routeName", valueOption);
                        }}
                        placeholder='Route Name'
                        errors={errors}
                        touched={touched}
                      />
                    </div>
                    <div className='col-lg-3'>
                      <NewSelect
                        name='Month'
                        options={monthDDL || []}
                        value={values?.month}
                        label='Month'
                        onChange={(valueOption) => {
                          setFieldValue("month", valueOption);
                        }}
                        placeholder='Month'
                        errors={errors}
                        touched={touched}
                      />
                    </div>
                    <div className='col-lg-3'>
                      <NewSelect
                        name='Year'
                        options={[
                          { value: 2020, label: "2020" },
                          { value: 2021, label: "2021" },
                          { value: 2022, label: "2022" },
                          { value: 2023, label: "2023" },
                          { value: 2024, label: "2024" },
                          { value: 2025, label: "2025" },
                        ]}
                        value={values?.year}
                        label='Year'
                        onChange={(valueOption) => {
                          setFieldValue("year", valueOption);
                        }}
                        placeholder='Year'
                        errors={errors}
                        touched={touched}
                      />
                    </div>
                    <div className='col-lg-1 mt-4 offset-lg-10'>
                      <button
                        className='btn btn-primary'
                        type='button'
                        onClick={() => {
                          setValues(values);
                          SalesTargetLanding(
                            profileData?.accountId,
                            selectedBusinessUnit?.value,
                            values?.territoryName?.value,
                            values?.month?.value,
                            values?.year?.value,
                            values?.routeName?.value,
                            setGridData,
                            setLoading,
                            pageNo,
                            pageSize
                          );
                        }}
                        disabled={
                          !values.territoryName ||
                          !values?.month ||
                          !values?.year
                        }
                      >
                        View
                      </button>
                    </div>
                    <div className='col-lg-1 mt-4 d-flex justify-content-end'>
                      <ReactHTMLTableToExcel
                        id='test-table-xls-button-att-report'
                        className='btn btn-primary pointer'
                        table='table-to-xlsx-sales-target'
                        filename='sales-target'
                        sheet='tablexls'
                        buttonText={
                          <i class='fa fa-file-excel-o' aria-hidden='true'></i>
                        }
                      />
                    </div>
                  </div>
                  <GridData
                    gridData={gridData}
                    pageNo={pageNo}
                    pageSize={pageSize}
                    setPageNo={setPageNo}
                    setPageSize={setPageSize}
                    values={values}
                    setGridData={setGridData}
                  />
                </Form>
              </CardBody>
            </Card>
          </>
        )}
      </Formik>
    </>
  );
}
