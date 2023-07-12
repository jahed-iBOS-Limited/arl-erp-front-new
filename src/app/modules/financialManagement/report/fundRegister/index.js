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

const initData = {
  type: {
    value: 1,
    label: "Cash Position",
  },
  date: _todayDate(),
  businessUnit: "",
};

function FundRegisterLanding() {
  const profileData = useSelector((state) => {
    return state.authData.profileData;
  }, shallowEqual);

  const [busisnessUnitDDL, getBusinessUnitDDL, businessUnitDDlloader] = useAxiosGet();
  const [showReport, setShowReport] = useState(false);
  const groupId = "218e3d7e-f3ea-4f66-8150-bb16eb6fc606";
  const reportId = "1c58a47c-1783-438c-ac3c-f718a2bbb13a";

  const parameterValues = (values) => {
    // dteDate, ReportType, businessUnitId
    return [
      { name: "ReportType", value: `${values?.type?.value || 0}` },
      { name: "businessUnitId", value: `${values?.busisnessUnit?.value || 0}` },
      // { name: "dteDate", value: `${values?.date}` }
    ];
  };
  useEffect(() => {
    getBusinessUnitDDL(`/hcm/HCMReport/GetOnboardedBusinessUnitList?accountId=${profileData?.accountId}`)
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
                      }
                    ]}
                  />
                </div>
                {values?.type?.value === 2 && (<div className="col-lg-3">
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
                      setShowReport(true);
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
                reportId={reportId}
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
