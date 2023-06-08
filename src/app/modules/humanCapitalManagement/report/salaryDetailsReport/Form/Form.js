import React, { useEffect, useState } from "react";
import { Formik, Form } from "formik";
import { ISelect } from "../../../../_helper/_inputDropDown";
import { shallowEqual, useSelector } from "react-redux";
import { getSalaryDetailsReport, getWorkplaceGroupDDL } from "../helper";
import Loading from "../../../../_helper/_loading";
import { downloadFile } from "../../../../_helper/downloadFile";
import { monthDDL } from "../utils";
import { YearDDL } from "../../../../_helper/_yearDDL";
import DetailsTable from "./DetailsTable";
import { toast } from "react-toastify";
import { getBuDDLForEmpDirectoryAndSalaryDetails } from "../../helper";

export default function _Form({ initData, btnRef, resetBtnRef }) {
  const { profileData, selectedBusinessUnit } = useSelector((state) => {
    return state.authData;
  }, shallowEqual);

  const [workPlaceGroupDDL, setWorkplaceGroupDDL] = useState([]);
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(false);
  const [tableSize, setTableSize] = useState("Small");
  const [buDDL, setBuDDL] = useState([]);

  useEffect(() => {
    getWorkplaceGroupDDL(profileData?.accountId, setWorkplaceGroupDDL);
    getBuDDLForEmpDirectoryAndSalaryDetails(profileData?.accountId, setBuDDL);
  }, [profileData, selectedBusinessUnit]);

  const yearList = YearDDL();

  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={initData}
        onSubmit={(values, { setSubmitting, resetForm }) => {}}
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
              {console.log("values", values)}
              {loading && <Loading />}
              <div className="form-group row global-form">
                <div className="col-lg-12">
                  <ISelect
                    options={[{ value: 0, label: "All" }, ...buDDL]}
                    label="Business Unit"
                    placeholder="Business Unit"
                    isMulti={true}
                    value={values?.bu}
                    onChange={(valueOption) => {
                      const isExistAll = valueOption?.filter(
                        (item) => item?.label === "All"
                      );
                      if (isExistAll?.length > 0) {
                        let filterArr = valueOption?.filter(
                          (item) => item?.label === "All"
                        );
                        setFieldValue("bu", filterArr);
                      } else {
                        setFieldValue("bu", valueOption);
                      }
                    }}
                  />
                </div>
                <div className="col-lg-2">
                  <ISelect
                    options={[{ value: 0, label: "All" }, ...workPlaceGroupDDL]}
                    label="Work Place Group"
                    placeholder="Work Place Group"
                    value={values?.workplaceGroup}
                    onChange={(valueOption) => {
                      setFieldValue("workplaceGroup", valueOption);
                    }}
                  />
                </div>
                <div className="col-lg-2">
                  <ISelect
                    options={monthDDL}
                    label="Month"
                    placeholder="Month"
                    value={values?.month}
                    onChange={(valueOption) => {
                      setFieldValue("month", valueOption);
                    }}
                  />
                </div>
                <div className="col-lg-2">
                  <ISelect
                    options={yearList}
                    label="Year"
                    placeholder="Year"
                    value={values?.year}
                    onChange={(valueOption) => {
                      setFieldValue("year", valueOption);
                    }}
                  />
                </div>

                <div style={{ marginTop: "13px" }} className="col-lg-4">
                  <button
                    onClick={(e) =>
                      getSalaryDetailsReport(
                        values?.bu,
                        values?.workplaceGroup?.value,
                        values?.month?.value,
                        values?.year?.value,
                        setReports,
                        setLoading
                      )
                    }
                    disabled={
                      !values?.bu ||
                      !values?.workplaceGroup ||
                      !values?.year ||
                      !values?.month
                    }
                    type="button"
                    className="btn btn-primary mr-2"
                  >
                    View
                  </button>
                  {reports?.length > 0 && (
                    <>
                      <button
                        type="button"
                        className="btn btn-primary mr-2"
                        onClick={() =>
                          setTableSize(
                            tableSize === "Small" ? "Large" : "Small"
                          )
                        }
                      >
                        {tableSize === "Small" ? "Large" : "Small"} View
                      </button>
                      <button
                        className="btn btn-primary my-1"
                        type="button"
                        onClick={(e) => {
                          if (
                            !values?.bu ||
                            !values?.workplaceGroup ||
                            !values?.year ||
                            !values?.month
                          )
                            return toast.warn("Please select all fields");
                          let str = "";
                          for (let i = 0; i < values?.bu?.length; i++) {
                            str = `${str}${str && ","}${values?.bu[i]?.value}`;
                          }
                          downloadFile(
                            `/hcm/HCMReport/GetSalaryDetailsReport?businessUnitId=${str}&workPlaceGroupId=${values?.workplaceGroup?.value}&monthId=${values?.month?.value}&yearId=${values?.year?.value}&isDownload=true`,
                            "Salary Details Report",
                            "xlsx"
                          );
                        }}
                      >
                        Export Excel
                      </button>
                    </>
                  )}
                </div>
              </div>

              {/* Table */}

              {reports?.length > 0 && <DetailsTable reports={reports} />}

              <button
                type="submit"
                style={{ display: "none" }}
                ref={btnRef}
                onSubmit={() => handleSubmit()}
              ></button>

              <button
                type="reset"
                style={{ display: "none" }}
                ref={resetBtnRef}
                onSubmit={() => resetForm(initData)}
              ></button>
            </Form>
          </>
        )}
      </Formik>
    </>
  );
}
