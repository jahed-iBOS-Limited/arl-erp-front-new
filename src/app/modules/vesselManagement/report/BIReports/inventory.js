import { Formik } from "formik";
import React, { useEffect, useState } from "react";
import { shallowEqual, useSelector } from "react-redux";
import FromDateToDateForm from "../../../_helper/commonInputFieldsGroups/dateForm";
import PowerBIReport from "../../../_helper/commonInputFieldsGroups/PowerBIReport";
import IButton from "../../../_helper/iButton";
import ICustomCard from "../../../_helper/_customCard";
import NewSelect from "../../../_helper/_select";
import { _todayDate } from "../../../_helper/_todayDate";
import {
  GetLighterVesselDDL,
  getMotherVesselDDL,
  getShippointDDL,
} from "./helper";
import ChallanWiseSalesReport from "./challanWiseSalesTable";
import useAxiosGet from "../../../_helper/customHooks/useAxiosGet";
import Loading from "../../../_helper/_loading";

const InventoryG2GReportRDLC = () => {
  const groupId = `e3ce45bb-e65e-43d7-9ad1-4aa4b958b29a`;
  const reportId = `e6aa2fa0-33e0-4457-ac7c-a535717e326e`;

  const [showReport, setShowReport] = useState(false);
  const [motherVesselDDL, setMotherVesselDDL] = useState([]);
  const [lighterVessel, setLighterVessel] = useState([]);
  const [shippointDDL, setShippointDDL] = useState([]);
  const [rowData, getRowData, loading] = useAxiosGet();

  const initData = {
    type: "",
    shippoint: "",
    motherVessel: "",
    lighterVessel: "",
    viewType: "",
    fromDate: _todayDate(),
    toDate: _todayDate(),
  };

  const parameterValues = (values) => {
    return [
      { name: "intpartid", value: `${values?.type?.value}` },
      { name: "intshippingPointid", value: `${values?.shippoint?.value}` },
      { name: "intMotherVesselId", value: `${values?.motherVessel?.value}` },
      { name: "intlighterid", value: `${values?.lighterVessel?.value}` },
      { name: "ViewType", value: `${values?.viewType?.value || 0}` },
      { name: "fromdate", value: `${values?.fromDate}` },
      { name: "todate", value: `${values?.toDate}` },
    ];
  };

  const {
    profileData: { accountId: accId },
    selectedBusinessUnit: { value: buId },
  } = useSelector((state) => state?.authData, shallowEqual);

  const getData = (values, searchTerm = "") => {
    const search = searchTerm ? `&searchTerm=${searchTerm}` : "";
    getRowData(
      `/tms/LigterLoadUnload/G2GChallanWiseSalesReport?accountId=${accId}&businessUnitId=${buId}${search}&fromDate=${values?.fromDate}&toDate=${values?.toDate}`
    );
  };

  useEffect(() => {
    getShippointDDL(accId, buId, setShippointDDL);
    getMotherVesselDDL(accId, buId, 0, setMotherVesselDDL);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [accId, buId]);

  return (
    <>
      <Formik enableReinitialize={true} initialValues={initData}>
        {({ values, setFieldValue }) => (
          <ICustomCard title="Inventory Report">
            {loading && <Loading />}
            <form className="form form-label-right">
              <div className="form-group row global-form">
                <div className="col-lg-3">
                  <NewSelect
                    name="type"
                    options={[
                      { value: 1, label: "Mother Vessel Report" },
                      { value: 3, label: "Stock Wise Report" },
                      { value: 4, label: "Challan Wise Sales Report" },
                    ]}
                    label="Type"
                    value={values?.type}
                    onChange={(valueOption) => {
                      setShowReport(false);
                      setFieldValue("type", valueOption);
                      setFieldValue("viewType", 0);
                    }}
                    placeholder="Type"
                  />
                </div>
                {[1, 3].includes(values?.type?.value) && (
                  <>
                    <div className="col-lg-3">
                      <NewSelect
                        name="shippoint"
                        options={
                          [{ value: 0, label: "All" }, ...shippointDDL] || []
                        }
                        label="Shippoint"
                        value={values?.shippoint}
                        onChange={(valueOption) => {
                          setShowReport(false);
                          setFieldValue("shippoint", valueOption);
                        }}
                        placeholder="Shippoint"
                      />
                    </div>
                    <div className="col-lg-3">
                      <NewSelect
                        name="motherVessel"
                        options={
                          [{ value: 0, label: "All" }, ...motherVesselDDL] || []
                        }
                        value={values?.motherVessel}
                        label="Mother Vessel"
                        onChange={(valueOption) => {
                          setFieldValue("motherVessel", valueOption);
                          valueOption &&
                            GetLighterVesselDDL(
                              valueOption?.value,
                              setLighterVessel
                            );
                          setShowReport(false);
                          setFieldValue("lighterVessel", "");
                        }}
                        placeholder="Mother Vessel"
                      />
                    </div>
                    <div className="col-lg-3">
                      <NewSelect
                        name="lighterVessel"
                        options={
                          [{ value: 0, label: "All" }, ...lighterVessel] || []
                        }
                        label="Lighter Vessel"
                        value={values?.lighterVessel}
                        onChange={(valueOption) => {
                          setShowReport(false);
                          setFieldValue("lighterVessel", valueOption);
                        }}
                        placeholder="Lighter Vessel"
                      />
                    </div>
                  </>
                )}
                {values?.type?.value === 3 ? (
                  <div className="col-lg-3">
                    <NewSelect
                      name="viewType"
                      options={[
                        { value: 1, label: "Summary" },
                        { value: 2, label: "Daily Unload Summary" },
                      ]}
                      label="View Type"
                      value={values?.viewType}
                      onChange={(valueOption) => {
                        setShowReport(false);
                        setFieldValue("viewType", valueOption);
                      }}
                      placeholder="View Type"
                    />
                  </div>
                ) : null}
                <FromDateToDateForm
                  obj={{
                    values,
                    setFieldValue,
                    onChange: () => {
                      setShowReport(false);
                    },
                    colSize: "col-lg-3",
                  }}
                />
                <IButton
                  colSize={"col-lg-1"}
                  onClick={() => {
                    if ([1, 3].includes(values?.type?.value)) {
                      setShowReport(false);
                      setShowReport(true);
                    } else if ([4].includes(values?.type?.value)) {
                      getData(values, "");
                    }
                  }}
                />
              </div>
            </form>
            {showReport && [1, 3].includes(values?.type?.value) && (
              <PowerBIReport
                reportId={reportId}
                groupId={groupId}
                parameterValues={parameterValues(values)}
                parameterPanel={false}
              />
            )}
            {[4].includes(values?.type?.value) && (
              <ChallanWiseSalesReport obj={{ rowData }} />
            )}
          </ICustomCard>
        )}
      </Formik>
    </>
  );
};

export default InventoryG2GReportRDLC;
