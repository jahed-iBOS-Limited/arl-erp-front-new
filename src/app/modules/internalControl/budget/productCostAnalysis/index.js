import { Form, Formik } from "formik";
import React, { useEffect, useState } from "react";
import Loading from "../../../_helper/_loading";
import useAxiosGet from "../../../_helper/customHooks/useAxiosGet";
import NewSelect from "../../../_helper/_select";
import { useParams } from "react-router-dom";
import { useLocation, useHistory } from "react-router";
import ICustomCard from "../../../_helper/_customCard";
export default function ProductCostAnalysis() {
  const location = useLocation();
  const history = useHistory();

  const [modifiedData, setModifiedData] = useState(null);
  const { yearId, buId } = useParams();
  console.log("useParams", useParams());
  const [fiscalYearDDL, getFiscalYearDDL, fiscalYearDDLloader] = useAxiosGet();
  const [
    tableData,
    getTableData,
    tableDataLoader,
    setTableData,
  ] = useAxiosGet();

  const [objProps, setObjprops] = useState({});
  const saveHandler = (values, cb) => {};

  useEffect(() => {
    console.log("location", location?.state);
    getFiscalYearDDL(`/vat/TaxDDL/FiscalYearDDL`);
    getTableData(
      `/fino/BudgetFinancial/GetAssetLiabilityPlan?partName=GetById&businessUnitId=${location?.state?.intBusinessUnitId}&yearId=${location?.state?.intYear}&yearName=${location?.state?.strYear}&monthId=0&autoId=0&glId=0`,
      (data) => {
        setModifiedData({
          fiscalYear: {
            value: location?.state?.intYear,
            label: location?.state?.strYear,
          },
        });
      }
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [yearId, buId]);

  return (
    <ICustomCard
      title="Product Cost Analysis"
      renderProps={() => (
        <button
          className="btn btn-primary"
          onClick={() => {
            history.push({
              pathname: "/internal-control/budget/ProductCostAnalysis/create",
            });
          }}
        >
          Create
        </button>
      )}
    >
      <Formik
        enableReinitialize={true}
        initialValues={modifiedData}
        onSubmit={(values, { setSubmitting, resetForm }) => {
          saveHandler(values, () => {});
        }}
      >
        {({
          handleSubmit,
          resetForm,
          values,
          setFieldValue,
          isValid,
          errors,
          touched,
        }) => (
          <>
            {(tableDataLoader || fiscalYearDDLloader) && <Loading />}

            <Form>
              <div className="form-group  global-form row">
                <div className="col-lg-3">
                  <NewSelect
                    name="fiscalYear"
                    options={fiscalYearDDL || []}
                    value={values?.fiscalYear}
                    label="Year"
                    onChange={(valueOption) => {
                      setFieldValue("fiscalYear", valueOption);
                      setTableData([]);
                    }}
                    errors={errors}
                    touched={touched}
                    isDisabled={true}
                  />
                </div>
              </div>

              <div className="common-scrollable-table two-column-sticky mt-2">
                <div
                  style={{ maxHeight: "500px" }}
                  className="scroll-table _table"
                >
                  <table className="table table-striped table-bordered bj-table bj-table-landing">
                    <thead>
                      <tr>
                        <th style={{ minWidth: "60px" }}>SL</th>
                        <th style={{ minWidth: "200px" }}>GL Name</th>
                        <th style={{ minWidth: "100px" }}>GL Class</th>
                        <th style={{ minWidth: "80px" }}>GL Type</th>
                        <th style={{ minWidth: "80px" }}>Opening</th>
                        <th style={{ minWidth: "140px" }}>Value</th>
                        <th style={{ minWidth: "140px" }}>July</th>
                        <th style={{ minWidth: "140px" }}>August</th>
                        <th style={{ minWidth: "140px" }}>September</th>
                        <th style={{ minWidth: "140px" }}>October</th>
                        <th style={{ minWidth: "140px" }}>November</th>
                        <th style={{ minWidth: "140px" }}>December</th>
                        <th style={{ minWidth: "140px" }}>January</th>
                        <th style={{ minWidth: "140px" }}>February</th>
                        <th style={{ minWidth: "140px" }}>March</th>
                        <th style={{ minWidth: "140px" }}>April</th>
                        <th style={{ minWidth: "140px" }}>May</th>
                        <th style={{ minWidth: "140px" }}>June</th>
                      </tr>
                    </thead>
                    <tbody>
                      {tableData.length > 0 &&
                        tableData.map((item, index) => (
                          <tr key={index}>
                            <td>{index + 1}</td>
                            <td>{item?.glName}</td>
                            <td>{item?.glClassName}</td>
                            <td>{item?.entryType}</td>
                            <td>{item?.initialAmount}</td>
                            <td>
                              {item?.entryType === "Percentage"
                                ? item?.entryTypeValue
                                : ""}
                            </td>
                            <td>{item?.julAmount}</td>
                            <td>{item?.augAmount}</td>
                            <td>{item?.sepAmount}</td>
                            <td>{item?.octAmount}</td>
                            <td>{item?.novAmount}</td>
                            <td>{item?.decAmount}</td>
                            <td>{item?.janAmount}</td>
                            <td>{item?.febAmount}</td>
                            <td>{item?.marAmount}</td>
                            <td>{item?.aprAmount}</td>
                            <td>{item?.mayAmount}</td>
                            <td>{item?.junAmount}</td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <button
                type="submit"
                style={{ display: "none" }}
                ref={objProps?.btnRef}
                onSubmit={() => handleSubmit()}
              ></button>

              <button
                type="reset"
                style={{ display: "none" }}
                ref={objProps?.resetBtnRef}
                onSubmit={() => resetForm(modifiedData)}
              ></button>
            </Form>
          </>
        )}
      </Formik>
    </ICustomCard>
  );
}
