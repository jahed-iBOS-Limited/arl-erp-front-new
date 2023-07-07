import { Formik } from "formik";
import React, { useEffect, useState } from "react";
import ICard from "../../../_helper/_card";
import InputField from "../../../_helper/_inputField";
import NewSelect from "../../../_helper/_select";
import { _todayDate } from "../../../_helper/_todayDate";
import PowerBIReport from "../../../_helper/commonInputFieldsGroups/PowerBIReport";
import useAxiosGet from "../../../_helper/customHooks/useAxiosGet";

const initData = {
  date: _todayDate(),
  itemType: "",
  reportType: "",
  businessUnit: "",
};

function InventoryBalanceTreasury() {
  const [showReport, setShowReport] = useState(false);
  const [itemTypeList, getItemTypeList] = useAxiosGet();
  const [buDDL, getBuDDL] = useAxiosGet();

  useEffect(() => {
    getItemTypeList(`/wms/WmsReport/GetItemTypeListDDL`);
    getBuDDL(`/hcm/HCMDDL/GetBusinessunitDDL`);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const groupId = "e3ce45bb-e65e-43d7-9ad1-4aa4b958b29a";
  const reportId = "bb2df915-a2f8-47d8-a39d-906a547bb852";

  const parameterValues = (values) => {
    return [
      { name: "dteToDate", value: `${values?.date}` },
      { name: "intUnit", value: `${values?.businessUnit?.value}` },
      { name: "intItemTypeId", value: `${values?.itemType?.value}` },
      { name: "reportType", value: `${values?.reportType?.value}` },
    ];
  };

  return (
    <>
      <Formik enableReinitialize={true} initialValues={initData}>
        {({ values, setFieldValue, errors, touched }) => (
          <ICard title="Inventory Balance Treasury">
            <form className="form form-label-right">
              <div className="form-group row global-form">
                <div className="col-lg-3">
                  <NewSelect
                    name="businessUnit"
                    options={buDDL || []}
                    value={values?.businessUnit}
                    label="Business Unit"
                    onChange={(valueOption) => {
                      setFieldValue("businessUnit", valueOption);
                      setShowReport(false);
                    }}
                    errors={errors}
                    touched={touched}
                  />
                </div>
                <div className="col-lg-3">
                  <NewSelect
                    name="reportType"
                    options={[
                      { value: 0, label: "Summary" },
                      { value: 1, label: "Details" },
                    ]}
                    value={values?.reportType}
                    label="Report Type"
                    onChange={(valueOption) => {
                      setFieldValue("reportType", valueOption);
                      setShowReport(false);
                    }}
                    errors={errors}
                    touched={touched}
                  />
                </div>
                <div className="col-lg-3">
                  <NewSelect
                    name="itemType"
                    options={itemTypeList || []}
                    value={values?.itemType}
                    label="Item Type"
                    onChange={(valueOption) => {
                      setFieldValue("itemType", valueOption);
                      setShowReport(false);
                    }}
                    errors={errors}
                    touched={touched}
                  />
                </div>
                <div className="col-lg-3">
                  <InputField
                    value={values?.date}
                    label="Date"
                    type="date"
                    name="date"
                    onChange={(e) => {
                      setFieldValue("date", e.target.value);
                      setShowReport(false);
                    }}
                  />
                </div>
                <div className="mt-5 ml-5">
                  <button
                    type="button"
                    disabled={
                      !values?.date ||
                      !values?.businessUnit ||
                      !values?.itemType ||
                      !values?.reportType
                    }
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

export default InventoryBalanceTreasury;
