/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import { useSelector, shallowEqual } from "react-redux";
import {
  Card,
  CardHeader,
  CardHeaderToolbar,
  CardBody,
} from "./../../../../../_metronic/_partials/controls/Card";
import { Formik } from "formik";
import { _dateFormatter } from "./../../../_helper/_dateFormate";
import Loading from "./../../../_helper/_loading";
import { getFiveYearsPlanLanding, getSBUListDDL, getYearDDLAction } from "./../helper";
import NewSelect from "./../../../_helper/_select";

const initData = {
  sbu: "",
};

const TableRow = () => {
  const [gridData, setGridData] = useState();
  const [sbuDDL, setSbuDDL] = useState([]);
  const [yearDDL, setYearDDL] = useState([]);
  const [isloading, setIsLoading] = useState(false);

  const { profileData, selectedBusinessUnit } = useSelector((state) => {
    return state.authData;
  }, shallowEqual);

  useEffect(() => {
    if (profileData && selectedBusinessUnit) {
      getSBUListDDL(
        profileData?.accountId,
        selectedBusinessUnit?.value,
        setSbuDDL
      );
    }
  }, [profileData, selectedBusinessUnit]);

  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={initData}
        // validationSchema={validationSchema}
        onSubmit={(values, { setSubmitting, resetForm }) => {}}
      >
        {({ errors, touched, setFieldValue, isValid, values }) => (
          <>
            <Card>
              <CardHeader title="5 Years Strategy Plan">
                <CardHeaderToolbar></CardHeaderToolbar>
              </CardHeader>
              <CardBody>
                {isloading && <Loading />}
                <div className="global-form">
                  <div className="row">
                    <div className="col-lg-2">
                      <NewSelect
                        name="sbu"
                        options={sbuDDL || []}
                        value={values?.sbu}
                        label="SBU"
                        onChange={(valueOption) => {
                          setFieldValue("year", "");
                          setFieldValue("sbu", valueOption);
                          getYearDDLAction(
                            profileData?.accountId,
                            selectedBusinessUnit?.value,
                            valueOption?.value,
                            setYearDDL
                          );
                        }}
                        placeholder="Select SBU"
                        isSearchable={true}
                        errors={errors}
                        touched={touched}
                      />
                    </div>
                    <div className="col-lg-2">
                      <NewSelect
                        name="year"
                        options={yearDDL || []}
                        value={values?.year}
                        label="Year"
                        isDisabled={!values?.sbu}
                        onChange={(valueOption) => {
                          setFieldValue("year", valueOption);
                        }}
                        placeholder="Select Year"
                        isSearchable={true}
                        errors={errors}
                        touched={touched}
                      />
                    </div>
                    <div className="col-lg-2" style={{ marginTop: "20px" }}>
                      <button
                        type="button"
                        className="btn btn-primary"
                        onClick={() => {
                          getFiveYearsPlanLanding(
                            profileData?.accountId,
                            selectedBusinessUnit?.value,
                            values?.sbu?.value,
                            setGridData,
                            setIsLoading,
                            values?.year?.value
                          );
                        }}
                        disabled={!values?.sbu || !values?.year}
                      >
                        View
                      </button>
                    </div>
                  </div>
                </div>
                {gridData?.length >= 0 && (
                  <>
                    <div className="react-bootstrap-table table-responsive strategic-year-plan">
                      <div className="loan-scrollable-table scroll-table-auto">
                        <div
                          style={{ maxHeight: "420px" }}
                          className="scroll-table _table scroll-table-auto"
                        >
                          {gridData.length > 0 && <table className="table table-striped table-bordered global-table">
                            <thead>
                              <tr>
                                <th
                                  style={{
                                    minWidth: "30px",
                                    position: "sticky",
                                    left: "0px",
                                    zIndex: "999999999",
                                  }}
                                  rowSpan="3"
                                  className="static bg-1"
                                >
                                  Sl
                                </th>
                                <th
                                  style={{
                                    minWidth: "226px",
                                    position: "sticky",
                                    left: "30px",
                                    zIndex: "999999999",
                                  }}
                                  rowSpan="3"
                                  className="static bg-1"
                                >
                                  Objective/Project/Initiative/Milestone/program
                                </th>
                                <th
                                  rowSpan="3"
                                  style={{
                                    minWidth: "120px",
                                    position: "sticky",
                                    left: "256px",
                                    zIndex: "999999999",
                                  }}
                                  className="static bg-1"
                                >
                                  Responsible
                                </th>
                                <th
                                  style={{
                                    minWidth: "160px",
                                    position: "sticky",
                                    left: "376px",
                                    zIndex: "999999999",
                                  }}
                                  colSpan="2"
                                  className="static bg-2"
                                >
                                  Operational Objectives
                                </th>
                                <th
                                  colSpan={gridData[0]?.fiscalYears?.length * 4}
                                  className="static bg-3"
                                >
                                  Strategic Objectives
                                </th>
                              </tr>
                              <tr>
                                <th
                                  rowSpan="2"
                                  style={{
                                    minWidth: "80px",
                                    position: "sticky",
                                    zIndex: "999999999",
                                    top: "22px",
                                    left: "376px",
                                  }}
                                  className="bg-4"
                                >
                                  Timeline
                                </th>
                                <th
                                  rowSpan="2"
                                  style={{
                                    minWidth: "80px",
                                    position: "sticky",
                                    zIndex: "999999999",
                                    top: "22px",
                                    left: "456px",
                                  }}
                                  className="bg-4"
                                >
                                  Category
                                </th>
                                {gridData[0]?.fiscalYears?.map(
                                  (item, index) => (
                                    <th
                                      colSpan="4"
                                      className="static bg-4"
                                      key={index}
                                      style={{
                                        position: "sticky",
                                        zIndex: "9999999",
                                        top: "22px",
                                      }}
                                    >
                                      {item?.year}
                                    </th>
                                  )
                                )}
                              </tr>
                              <tr>
                                <th
                                  style={{
                                    minWidth: "60px",
                                    position: "sticky",
                                    zIndex: "9999999",
                                    top: "44px",
                                  }}
                                  className="bg-4"
                                >
                                  Q1
                                </th>
                                <th
                                  style={{
                                    minWidth: "60px",
                                    position: "sticky",
                                    zIndex: "9999999",
                                    top: "44px",
                                  }}
                                  className="bg-4"
                                >
                                  Q2
                                </th>
                                <th
                                  style={{
                                    minWidth: "60px",
                                    position: "sticky",
                                    zIndex: "9999999",
                                    top: "44px",
                                  }}
                                  className="bg-4"
                                >
                                  Q3
                                </th>
                                <th
                                  style={{
                                    minWidth: "60px",
                                    position: "sticky",
                                    zIndex: "9999999",
                                    top: "44px",
                                  }}
                                  className="bg-4"
                                >
                                  Q4
                                </th>
                                <th
                                  style={{
                                    minWidth: "60px",
                                    position: "sticky",
                                    zIndex: "9999999",
                                    top: "44px",
                                  }}
                                  className="bg-4"
                                >
                                  Q1
                                </th>
                                <th
                                  style={{
                                    minWidth: "60px",
                                    position: "sticky",
                                    zIndex: "9999999",
                                    top: "44px",
                                  }}
                                  className="bg-4"
                                >
                                  Q2
                                </th>
                                <th
                                  style={{
                                    minWidth: "60px",
                                    position: "sticky",
                                    zIndex: "9999999",
                                    top: "44px",
                                  }}
                                  className="bg-4"
                                >
                                  Q3
                                </th>
                                <th
                                  style={{
                                    minWidth: "60px",
                                    position: "sticky",
                                    zIndex: "9999999",
                                    top: "44px",
                                  }}
                                  className="bg-4"
                                >
                                  Q4
                                </th>
                                <th
                                  style={{
                                    minWidth: "60px",
                                    position: "sticky",
                                    zIndex: "9999999",
                                    top: "44px",
                                  }}
                                  className="bg-4"
                                >
                                  Q1
                                </th>
                                <th
                                  style={{
                                    minWidth: "60px",
                                    position: "sticky",
                                    zIndex: "9999999",
                                    top: "44px",
                                  }}
                                  className="bg-4"
                                >
                                  Q2
                                </th>
                                <th
                                  style={{
                                    minWidth: "60px",
                                    position: "sticky",
                                    zIndex: "9999999",
                                    top: "44px",
                                  }}
                                  className="bg-4"
                                >
                                  Q3
                                </th>
                                <th
                                  style={{
                                    minWidth: "60px",
                                    position: "sticky",
                                    zIndex: "9999999",
                                    top: "44px",
                                  }}
                                  className="bg-4"
                                >
                                  Q4
                                </th>
                                <th
                                  style={{
                                    minWidth: "60px",
                                    position: "sticky",
                                    zIndex: "9999999",
                                    top: "44px",
                                  }}
                                  className="bg-4"
                                >
                                  Q1
                                </th>
                                <th
                                  style={{
                                    minWidth: "60px",
                                    position: "sticky",
                                    zIndex: "9999999",
                                    top: "44px",
                                  }}
                                  className="bg-4"
                                >
                                  Q2
                                </th>
                                <th
                                  style={{
                                    minWidth: "60px",
                                    position: "sticky",
                                    zIndex: "9999999",
                                    top: "44px",
                                  }}
                                  className="bg-4"
                                >
                                  Q3
                                </th>
                                <th
                                  style={{
                                    minWidth: "60px",
                                    position: "sticky",
                                    zIndex: "9999999",
                                    top: "44px",
                                  }}
                                  className="bg-4"
                                >
                                  Q4
                                </th>
                                <th
                                  style={{
                                    minWidth: "60px",
                                    position: "sticky",
                                    zIndex: "9999999",
                                    top: "44px",
                                  }}
                                  className="bg-4"
                                >
                                  Q1
                                </th>
                                <th
                                  style={{
                                    minWidth: "60px",
                                    position: "sticky",
                                    zIndex: "9999999",
                                    top: "44px",
                                  }}
                                  className="bg-4"
                                >
                                  Q2
                                </th>
                                <th
                                  style={{
                                    minWidth: "60px",
                                    position: "sticky",
                                    zIndex: "9999999",
                                    top: "44px",
                                  }}
                                  className="bg-4"
                                >
                                  Q3
                                </th>
                                <th
                                  style={{
                                    minWidth: "60px",
                                    position: "sticky",
                                    zIndex: "9999999",
                                    top: "44px",
                                  }}
                                  className="bg-4"
                                >
                                  Q4
                                </th>
                              </tr>
                            </thead>
                            <tbody>
                              {gridData.length > 0 &&
                                gridData.map((item, index) => (
                                  <tr key={index}>
                                    <td>{index + 1}</td>
                                    <td
                                      style={{
                                        minWidth: "226px",
                                        position: "sticky",
                                        zIndex: "99999999",
                                        background: (index + 1) % 2 === 0 ? "#fff" : "#ECF0F3",
                                        left: "30px",
                                      }}
                                    >
                                      <div className="pl-2">
                                        {item?.strategicParticularsName}
                                      </div>
                                    </td>
                                    <td
                                      style={{
                                        minWidth: "120px",
                                        position: "sticky",
                                        zIndex: "99999999",
                                        left: "256px",
                                        background: (index + 1) % 2 === 0 ? "#fff" : "#ECF0F3",
                                      }}
                                    >
                                      <div className="pl-2">
                                        {item?.ownerName}
                                      </div>
                                    </td>
                                    <td
                                      style={{
                                        minWidth: "71px",
                                        position: "sticky",
                                        zIndex: "99999999",
                                        left: "376px",
                                        background: (index + 1) % 2 === 0 ? "#fff" : "#ECF0F3",
                                      }}
                                    >
                                      <div className="pl-2">
                                        {_dateFormatter(item?.timeline)}
                                      </div>
                                    </td>
                                    <td
                                      style={{
                                        minWidth: "71px",
                                        position: "sticky",
                                        zIndex: "99999999",
                                        left: "455px",
                                        background: (index + 1) % 2 === 0 ? "#fff" : "#ECF0F3",
                                      }}
                                    >
                                      <div className="pl-2">
                                        {item?.categoryName}
                                      </div>
                                    </td>

                                    {item?.fiscalYears?.length <= 0 &&
                                      gridData[0]?.fiscalYears?.map(
                                        (item, index) => (
                                          <>
                                            <td>
                                              <div className="text-right pr-2">
                                                {""}
                                              </div>
                                            </td>
                                            <td>
                                              <div className="text-right pr-2">
                                                {""}
                                              </div>
                                            </td>
                                            <td>
                                              <div className="text-right pr-2">
                                                {""}
                                              </div>
                                            </td>
                                            <td>
                                              <div className="text-right pr-2">
                                                {""}
                                              </div>
                                            </td>
                                          </>
                                        )
                                      )}

                                    {item?.fiscalYears?.map((itm, index) => (
                                      <>
                                        <td
                                          className={
                                            itm?.q1 > 0 && "fiveYearsGreen"
                                          }
                                        >
                                          <div className="text-right pr-2">
                                            {itm?.q1 > 0 && itm?.q1}
                                          </div>
                                        </td>
                                        <td
                                          className={
                                            itm?.q2 > 0 && "fiveYearsGreen"
                                          }
                                        >
                                          <div className="text-right pr-2">
                                            {itm?.q2 > 0 && itm?.q2}
                                          </div>
                                        </td>
                                        <td
                                          className={
                                            itm?.q3 > 0 && "fiveYearsGreen"
                                          }
                                        >
                                          <div className="text-right pr-2">
                                            {itm?.q3 > 0 && itm?.q3}
                                          </div>
                                        </td>
                                        <td
                                          className={
                                            itm?.q4 > 0 && "fiveYearsGreen"
                                          }
                                        >
                                          <div className="text-right pr-2">
                                            {itm?.q4 > 0 && itm?.q4}
                                          </div>
                                        </td>
                                      </>
                                    ))}
                                  </tr>
                                ))}
                            </tbody>
                          </table>}
                          
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </CardBody>
            </Card>
          </>
        )}
      </Formik>
    </>
  );
};

export default TableRow;
