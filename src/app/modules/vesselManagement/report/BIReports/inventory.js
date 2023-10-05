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
  GetDomesticPortDDLWMS,
  GetLighterVesselDDL,
  getMotherVesselDDL,
  getShippointDDL,
} from "./helper";
import ChallanWiseSalesReport from "./challanWiseSalesTable";
import useAxiosGet from "../../../_helper/customHooks/useAxiosGet";
import Loading from "../../../_helper/_loading";
import MotherVesselInventoryReportTable from "./MVInventoryTable";
import WareHouseInventoryReportTable from "./wareHouseInventoryReportTable";

const types = [
  { value: 5, label: "Mother Vessel Inventory Report" },
  { value: 1, label: "Mother Vessel Report" },
  { value: 3, label: "Stock Wise Report" },
  { value: 4, label: "Challan Wise Sales Report" },
  { value: 6, label: "Mother Vessel Vs Warehouse" },
  { value: 7, label: "Warehouse Vs Mother Vessel" },
];



const InventoryG2GReportRDLC = () => {
  const groupId = `e3ce45bb-e65e-43d7-9ad1-4aa4b958b29a`;
  const reportId = `e6aa2fa0-33e0-4457-ac7c-a535717e326e`;

  const [showReport, setShowReport] = useState(false);
  const [motherVesselDDL, setMotherVesselDDL] = useState([]);
  const [lighterVessel, setLighterVessel] = useState([]);
  const [shippointDDL, setShippointDDL] = useState([]);
  const [rowData, getRowData, loading, setRowData] = useAxiosGet();
  const [plantDDL, getPlantDDL] = useAxiosGet();
  const [portDDL, setPortDDL] = useState([]);

  const initData = {
    type: "",
    plant: { value: 130, label: "G 2 G" },
    shippoint: { value: 0, label: "All" },
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
    profileData: { accountId: accId, userId },
    selectedBusinessUnit: { value: buId },
  } = useSelector((state) => state?.authData, shallowEqual);

  const getData = (values, searchTerm = "", _pageNo = 0, _pageSize = 1500) => {

    const typeId = values?.type?.value;
    const search = searchTerm ? `&searchTerm=${searchTerm}` : "";

    // Challan Wise Sales Report
    const urlOne = `/tms/LigterLoadUnload/G2GChallanWiseSalesReport?accountId=${accId}&businessUnitId=${buId}${search}&fromDate=${values?.fromDate}&toDate=${values?.toDate}`;

    // Mother Vessel Inventory Report
    const urlTwo = `/tms/InternalTransport/GetG2gInventoryInformation?intUnit=${buId}&dteFromDate=${values?.fromDate}&dteToDate=${values?.toDate}&intPlantId=${values?.plant?.value}&intItemTypeId=${typeId}&intItemId=${values?.motherVessel?.value || 0}&intWareHouseId=${values?.shippoint?.value}&PageNo=${_pageNo}&PageSize=${_pageSize}`;

    const URL = [4].includes(typeId)
      ? urlOne
      : [5, 6,7].includes(typeId)
      ? urlTwo
      : ``;

    getRowData(URL);
  };

  useEffect(() => {
    getPlantDDL(
      `/wms/BusinessUnitPlant/GetOrganizationalUnitUserPermission?UserId=${userId}&AccId=${accId}&BusinessUnitId=${buId}&OrgUnitTypeId=7`
    );
    getShippointDDL(accId, buId, setShippointDDL);
    getMotherVesselDDL(accId, buId, 0, setMotherVesselDDL);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [accId, buId]);

  useEffect(() => {
    GetDomesticPortDDLWMS(setPortDDL);
  }, [accId, buId]);

  return (
    <>
      <Formik enableReinitialize={true} initialValues={initData}>
        {({ values, setFieldValue,errors,touched }) => (
          <ICustomCard title="Inventory Report">
            {loading && <Loading />}
            <form className="form form-label-right">
              <div className="form-group row global-form">
                <div className="col-lg-3">
                  <NewSelect
                    name="type"
                    options={types}
                    label="Type"
                    value={values?.type}
                    onChange={(valueOption) => {
                      setShowReport(false);
                      setFieldValue("type", valueOption);
                      setFieldValue("viewType", 0);
                      setFieldValue("motherVessel", "");
                      setRowData([]);
                    }}
                    placeholder="Type"
                  />
                </div>
                {[5, 6,7].includes(values?.type?.value) && (
                  <div className="col-lg-3">
                    <NewSelect
                      name="plant"
                      options={plantDDL || []}
                      label="Plant"
                      value={values?.plant}
                      onChange={(valueOption) => {
                        setShowReport(false);
                        setFieldValue("plant", valueOption);
                        setRowData([]);
                      }}
                      placeholder="Plant"
                    />
                  </div>
                )}
                {[1, 3, 5, 6,7].includes(values?.type?.value) && (
                  <>
                    <div className="col-lg-3">
                      <NewSelect
                        name="shippoint"
                        options={[{ value: 0, label: "All" }, ...shippointDDL]}
                        label={
                          [5, 6,7].includes(values?.type?.value)
                            ? "Warehouse"
                            : "ShipPoint"
                        }
                        value={values?.shippoint}
                        onChange={(valueOption) => {
                          setShowReport(false);
                          setFieldValue("shippoint", valueOption);
                          setRowData([]);
                        }}
                        placeholder={
                          [5, 6,7].includes(values?.type?.value)
                            ? "Warehouse"
                            : "ShipPoint"
                        }
                      />
                    </div>
                    {[1, 3].includes(values?.type?.value) && (
                      <>
                        <div className="col-lg-3">
                          <NewSelect
                            name="motherVessel"
                            options={
                              [
                                { value: 0, label: "All" },
                                ...motherVesselDDL,
                              ] || []
                            }
                            value={values?.motherVessel}
                            label="Mother Vessel"
                            onChange={(valueOption) => {
                              setFieldValue("motherVessel", valueOption);
                              setRowData([]);
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
                              [{ value: 0, label: "All" }, ...lighterVessel] ||
                              []
                            }
                            label="Lighter Vessel"
                            value={values?.lighterVessel}
                            onChange={(valueOption) => {
                              setShowReport(false);
                              setFieldValue("lighterVessel", valueOption);
                              setRowData([]);
                            }}
                            placeholder="Lighter Vessel"
                          />
                        </div>
                      </>
                    )}
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
                        setRowData([]);
                      }}
                      placeholder="View Type"
                    />
                  </div>
                ) : null}
                {[6, 7]?.includes(values?.type?.value) && <>
                  <div className="col-lg-3">
                    <NewSelect
                      name="port"
                      options={portDDL || []}
                      value={values?.port}
                      label="Port"
                      onChange={(valueOption) => {
                        setFieldValue("port", valueOption);
                        setFieldValue("motherVessel", "");
                        getMotherVesselDDL(
                          accId,
                          buId,
                          valueOption?.value,
                          setMotherVesselDDL
                        );
                      }}
                      placeholder="Port"
                      errors={errors}
                      touched={touched}
                    />
                  </div>

                  <div className="col-lg-3">
                    <NewSelect
                      name="motherVessel"
                      options={[{value : 0, label: "All"} , ...motherVesselDDL]}
                      value={values?.motherVessel}
                      label="Mother Vessel"
                      onChange={(valueOption) => {
                        setFieldValue("motherVessel", valueOption);
                      }}
                      placeholder="Mother Vessel"
                    />
                  </div>
                </>}
                <FromDateToDateForm
                  obj={{
                    values,
                    setFieldValue,
                    onChange: () => {
                      setShowReport(false);
                      setRowData([]);
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
                    } else if ([4, 5, 6,7].includes(values?.type?.value)) {
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
            {[5].includes(values?.type?.value) && (
              <MotherVesselInventoryReportTable obj={{ rowData }} />
            )}
             {[6,7].includes(values?.type?.value) && (
              <WareHouseInventoryReportTable rowData={rowData} />
            )}
          </ICustomCard>
        )}
      </Formik>
    </>
  );
};

export default InventoryG2GReportRDLC;
