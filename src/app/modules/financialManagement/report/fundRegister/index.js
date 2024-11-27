import { Formik } from "formik";
import React, { useEffect, useState } from "react";
import ICard from "../../../_helper/_card";
import InputField from "../../../_helper/_inputField";
import { _todayDate } from "../../../_helper/_todayDate";
import PowerBIReport from "../../../_helper/commonInputFieldsGroups/PowerBIReport";
import { shallowEqual, useSelector } from "react-redux";
import Loading from "../../../_helper/_loading";
import useAxiosGet from "../../../_helper/customHooks/useAxiosGet";
import NewSelect from "../../../_helper/_select";
import { YearDDL } from "../../../_helper/_yearDDL";

const initData = {
  type: {
    value: 1,
    label: "Cash Position",
  },
  date: _todayDate(),
  businessUnit: "",
  year: "",
};

function FundRegisterLanding() {
  const profileData = useSelector((state) => {
    return state.authData.profileData;
  }, shallowEqual);

  const [busisnessUnitDDL, getBusinessUnitDDL, businessUnitDDlloader] = useAxiosGet();
  const [showReport, setShowReport] = useState(false);
  const groupId = "218e3d7e-f3ea-4f66-8150-bb16eb6fc606";

  const getReportId = (values) => {
    let reportId = "";
    if ([1, 2].includes(values?.type?.value)) {
      reportId = "1c58a47c-1783-438c-ac3c-f718a2bbb13a";
    } else if ([3].includes(values?.type?.value)) {
      reportId = "f46ad25c-816b-447a-8e93-57e9156799c6";
    }

    return reportId;
  }


  const parameterValues = (values) => {
    let paramList = [];
    if ([1, 2].includes(values?.type?.value)) {
      paramList = [
        { name: "ReportType", value: `${values?.type?.value || 0}` },
        { name: "businessUnitId", value: `${values?.busisnessUnit?.value || 0}` },
        { name: "dteDate", value: `${values?.date || _todayDate()}` }
      ]
    } else if ([3].includes(values?.type?.value)) {
      paramList = [
        { name: "businessUnitId", value: `${values?.busisnessUnit?.value || 0}` },
        { name: "ExpiryDate", value: `${values?.year?.label}` }
      ]
    }
    return paramList;
  };
  useEffect(() => {
    getBusinessUnitDDL(`/hcm/HCMDDL/GetBusinessUnitByAccountDDL?AccountId=${profileData?.accountId}`)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      {businessUnitDDlloader && <Loading />}
      <Formik enableReinitialize={true} initialValues={initData}>

        {({ values, setFieldValue }) => (
          <ICard title="Fund Register">
            <form className="form form-label-right">
              <div className="form-group row global-form">
                <div className="col-lg-3">
                  <NewSelect
                    name="type"
                    placeholder=""
                    label="Select type"
                    value={values?.type}
                    onChange={(v) => {
                      if (v) {
                        setFieldValue("type", v);
                        setShowReport(false);
                      } else {
                        setFieldValue("type", "");
                        setShowReport(false);
                      }
                    }}
                    options={[
                      {
                        value: 1,
                        label: "Cash Position",
                      },
                      {
                        value: 2,
                        label: "Group  Liability Position",
                      },
                      {
                        value: 3,
                        label: "Group Liability For Bank",
                      }
                    ]}
                  />
                </div>
                {[2, 3].includes(values?.type?.value) && (<div className="col-lg-3">
                  <NewSelect
                    name="busisnessUnit"
                    placeholder=""
                    label="Select Busisness Unit"
                    value={values?.busisnessUnit}
                    onChange={(v) => {
                      if (v) {
                        setFieldValue("busisnessUnit", v);
                        setShowReport(false);
                      } else {
                        setFieldValue("busisnessUnit", "");
                        setShowReport(false);
                      }
                    }}
                    options={[{ value: 0, label: "All" }, ...busisnessUnitDDL] || []}
                  />
                </div>)}
                {[3].includes(values?.type?.value) && (<div className="col-lg-3">
                  <NewSelect
                    name="year"
                    placeholder=""
                    label="Select Year"
                    value={values?.year}
                    onChange={(v) => {
                      setFieldValue("year", v || "");
                      setShowReport(false);
                    }}
                    options={YearDDL()}
                  />
                </div>)}
                {
                  values?.type?.value === 1 && (
                    <div className="col-lg-3">
                      <label>Date</label>
                      <InputField
                        value={values?.date}
                        placeholder="Date"
                        type="date"
                        name="date"
                        onChange={(e) => {
                          setFieldValue("date", e.target.value);
                          setShowReport(false);
                        }}
                      />
                    </div>
                  )

                }
                <div>
                  <button
                    type="button"
                    style={{
                      marginTop: "17px",
                    }}
                    onClick={() => {
                      setShowReport(false);
                      setTimeout(() => {
                        setShowReport(true);
                      }, 1000);
                    }}
                    className="btn btn-primary"
                  >
                    View
                  </button>
                </div>
              </div>
            </form>
            {showReport && (
              <PowerBIReport
                reportId={getReportId(values)}
                groupId={groupId}
                parameterValues={parameterValues(values)}
                parameterPanel={false}
              />
            )}
          </ICard>
        )}
      </Formik>
    </>
  );
}

export default FundRegisterLanding;
