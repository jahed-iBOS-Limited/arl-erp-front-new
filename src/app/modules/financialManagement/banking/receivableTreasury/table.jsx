import { Formik } from "formik";
import React, { useEffect, useState } from "react";
import ICustomCard from "../../../_helper/_customCard";
import NewSelect from "../../../_helper/_select";
import { _todayDate } from "../../../_helper/_todayDate";
import PowerBIReport from "../../../_helper/commonInputFieldsGroups/PowerBIReport";
import useAxiosGet from "../../../_helper/customHooks/useAxiosGet";
import IButton from "../../../_helper/iButton";
import InputField from "../../../_helper/_inputField";

const groupId = `e3ce45bb-e65e-43d7-9ad1-4aa4b958b29a`;
const reportId = `d2ee852a-f129-4167-87f3-3ef0c00c9f8c`;

const initData = {
  businessUnit: "",
  viewType: "",
  transactionDate: _todayDate(),
};

const ReceivableTreasuryReport = () => {
  const [show, setShow] = useState(false);
  const [buDDL, getBuDDL] = useAxiosGet();

  const parameterValues = (values) => {
    return [
      { name: "intunit", value: values?.businessUnit?.value?.toString() },
      { name: "TransactionDate", value: values?.transactionDate },
      { name: "intpartid", value: values?.viewType?.value?.toString() || "0" },
    ];
  };

  useEffect(() => {
    getBuDDL(`/hcm/HCMDDL/GetBusinessunitDDL`);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <Formik enableReinitialize={true} initialValues={initData}>
        {({ values, setFieldValue }) => (
          <ICustomCard title="Receivable Variance Report">
            <form className="form form-label-right">
              <div className="form-group row global-form">
                <div className="col-lg-3">
                  <NewSelect
                    name="businessUnit"
                    options={[{ value: 0, label: "All" }, ...buDDL]}
                    value={values?.businessUnit}
                    label="Business Unit"
                    placeholder="Business Unit"
                    onChange={(valueOption) => {
                      setShow(false);
                      setFieldValue("businessUnit", valueOption);
                    }}
                  />
                </div>
                <div className="col-lg-3">
                  <InputField
                    value={values?.transactionDate}
                    label={`Transaction Date`}
                    name="transactionDate"
                    type="date"
                    onChange={(e) => {
                      setShow(false);
                      setFieldValue("transactionDate", e?.target?.value);
                    }}
                  />
                </div>
                <div className="col-lg-3">
                  <NewSelect
                    name="viewType"
                    options={[
                      { value: 1, label: "Details" },
                      { value: 5, label: "Top Sheet" },
                    ]}
                    value={values?.viewType}
                    label="View Type"
                    placeholder="View Type"
                    onChange={(valueOption) => {
                      setShow(false);
                      setFieldValue("viewType", valueOption);
                    }}
                  />
                </div>
                <IButton
                  colSize={"col-lg-3"}
                  onClick={() => {
                    setShow(true);
                  }}
                />
              </div>
            </form>
            {show && (
              <PowerBIReport
                reportId={reportId}
                groupId={groupId}
                parameterValues={parameterValues(values)}
                parameterPanel={false}
              />
            )}
          </ICustomCard>
        )}
      </Formik>
    </>
  );
};

export default ReceivableTreasuryReport;
