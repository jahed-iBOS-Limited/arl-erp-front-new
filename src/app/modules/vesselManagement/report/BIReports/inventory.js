import { Formik } from "formik";
import React, { useEffect, useState } from "react";
import { shallowEqual, useSelector } from "react-redux";
import ICustomCard from "../../../_helper/_customCard";
import Loading from "../../../_helper/_loading";
import NewSelect from "../../../_helper/_select";
import { _todayDate } from "../../../_helper/_todayDate";
import PowerBIReport from "../../../_helper/commonInputFieldsGroups/PowerBIReport";
import FromDateToDateForm from "../../../_helper/commonInputFieldsGroups/dateForm";
import useAxiosGet from "../../../_helper/customHooks/useAxiosGet";
import IButton from "../../../_helper/iButton";
import axios from "axios";
import MotherVesselInventoryReportTable from "./MVInventoryTable";
import ChallanWiseSalesReport from "./challanWiseSalesTable";
import {
  GetDomesticPortDDLWMS,
  GetShipPointDDL,
  getGodownDDL,
  getMotherVesselDDL,
  wearhouse_api,
} from "./helper";
import WareHouseInventoryReportTable from "./wareHouseInventoryReportTable";
import SearchAsyncSelect from "./../../../_helper/SearchAsyncSelect";
import ItemVsWarehouse from "./itemVsWarehouse";
import ItemVsMotherVessel from "./itemVsMotherVessel";
import G2GinventoryChart from "./g2ginventoryChart";
import BufferStockvsDelivery from "./bufferStockvsDelivery";

const types = [
  { value: 5, label: "Mother Vessel Inventory Report" },
  // { value: 1, label: "Mother Vessel Report" },
  // { value: 3, label: "Stock Wise Report" },
  { value: 4, label: "Challan Wise Sales Report" },
  { value: 6, label: "Mother Vessel Vs Warehouse" },
  { value: 7, label: "Warehouse Vs Mother Vessel" },
  { value: 8, label: "Item Vs Warehouse" },
  { value: 9, label: "Item Vs Mother Vessel" },
  { value: 10, label: "Buffer Stock vs Delivery" },
];

const InventoryG2GReportRDLC = () => {
  const groupId = `e3ce45bb-e65e-43d7-9ad1-4aa4b958b29a`;
  const reportId = `e6aa2fa0-33e0-4457-ac7c-a535717e326e`;
  const formikRef = React.useRef(null);
  const [showReport, setShowReport] = useState(false);
  const [motherVesselDDL, setMotherVesselDDL] = useState([]);
  // const [lighterVessel, setLighterVessel] = useState([]);
  // const [shippointDDL, setShippointDDL] = useState([]);
  const [godownDDL, setGodownDDL] = useState([]);
  const [rowData, getRowData, loading, setRowData] = useAxiosGet();
  const [plantDDL, getPlantDDL] = useAxiosGet();
  const [portDDL, setPortDDL] = useState([]);
  const [wareHouseDDL, setwareHouseDDL] = useState([]);
  const [shipPointDDL, setShipPointDDL] = useState([]);
  const initData = {
    type: "",
    plant: "",
    shippoint: { value: 0, label: "All" },
    motherVessel: { value: 0, label: "All" },
    lighterVessel: "",
    viewType: "",
    fromDate: _todayDate(),
    toDate: _todayDate(),
    wh: { value: 0, label: "All" },
    intG2GItemId: { value: 0, label: "All" },
    redioType: "badc",
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
    const urlTwo = `/tms/InternalTransport/GetG2gInventoryInformation?intUnit=${buId}&dteFromDate=${
      values?.fromDate
    }&dteToDate=${values?.toDate}&intPlantId=${
      values?.plant?.value
    }&intItemTypeId=${typeId}&intItemId=${values?.motherVessel?.value ||
      0}&intWareHouseId=${values?.wh?.value}&intG2GItemId=${values?.intG2GItemId
      ?.value || 0}&PageNo=${_pageNo}&PageSize=${_pageSize}`;

    const urlThree = `/tms/InternalTransport/GetG2GBufferAllotmentVsChllan?intPartid=10&intMotherVesselid=${values
      ?.motherVessel?.value || 0}&intshiptopartnerid=${
      values?.bufferName?.value
    }&intShippingPointId=${values?.shipPoint?.value}&dteFromDate=${
      values?.fromDate
    }&dteToDate=${values?.toDate}`;

    const URL = [4].includes(typeId)
      ? urlOne
      : [5, 6, 7, 8, 9].includes(typeId)
      ? urlTwo
      : [10].includes(typeId)
      ? urlThree
      : "";

    getRowData(URL);
  };

  useEffect(() => {
    getPlantDDL(
      `/wms/BusinessUnitPlant/GetOrganizationalUnitUserPermission?UserId=${userId}&AccId=${accId}&BusinessUnitId=${buId}&OrgUnitTypeId=7`,
      (resPlantData) => {
        if (formikRef.current) {
          const plant = resPlantData?.find((i) => i?.value === 130) || "";
          formikRef.current.setFieldValue("plant", plant || "");
          wearhouse_api(accId, buId, userId, plant?.value, setwareHouseDDL);
        }
      }
    );
    // getShippointDDL(accId, buId, setShippointDDL);
    getMotherVesselDDL(accId, buId, 0, setMotherVesselDDL);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [accId, buId]);

  useEffect(() => {
    if (accId && buId) {
      GetDomesticPortDDLWMS(setPortDDL);
    }
  }, [accId, buId]);
  const radioStyle = { height: "25px", width: "25px" };
  
  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={initData}
        innerRef={formikRef}
      >
        {({ values, setFieldValue, errors, touched }) => (
          <ICustomCard title='Inventory Report'>
            {loading && <Loading />}
            <form className='form form-label-right'>
              <div className='form-group row global-form'>
                {[10].includes(values?.type?.value) && (
                  <>
                    <div className='col-12 mt-3 d-flex'>
                      <div className='d-flex align-items-center mr-5'>
                        <input
                          style={radioStyle}
                          type='radio'
                          name='redioType'
                          id='badc'
                          value={values?.redioType}
                          checked={values?.redioType === "badc"}
                          onChange={() => {
                            setFieldValue("redioType", "badc");
                            setFieldValue("bufferName", "");
                            getGodownDDL(buId, 73244, setGodownDDL);
                            setRowData([]);
                          }}
                        />
                        <label htmlFor='badc' className='ml-1'>
                          <h3>BADC</h3>
                        </label>
                      </div>
                      <div className='d-flex align-items-center ml-5'>
                        <input
                          style={radioStyle}
                          type='radio'
                          name='redioType'
                          id='bcic'
                          value={values?.redioType}
                          checked={values?.redioType === "bcic"}
                          onChange={() => {
                            setFieldValue("redioType", "bcic");
                            setFieldValue("bufferName", "");
                            getGodownDDL(buId, 73245, setGodownDDL);
                            setRowData([]);
                          }}
                        />
                        <label htmlFor='bcic' className='ml-1'>
                          <h3>BCIC</h3>
                        </label>
                      </div>
                    </div>
                  </>
                )}
                <div className='col-lg-3'>
                  <NewSelect
                    name='type'
                    options={types}
                    label='Type'
                    value={values?.type}
                    onChange={(valueOption) => {
                      setShowReport(false);
                      setFieldValue("type", valueOption);
                      setFieldValue("viewType", 0);
                      setFieldValue("port", "");
                      setRowData([]);

                      if (valueOption?.value === 10) {
                        GetShipPointDDL(accId, buId, setShipPointDDL);
                        getGodownDDL(buId, 73244, setGodownDDL);
                      }
                    }}
                    placeholder='Type'
                  />
                </div>
                {[5, 6, 7, 8, 9].includes(values?.type?.value) && (
                  <>
                    <div className='col-lg-3'>
                      <NewSelect
                        name='plant'
                        options={plantDDL || []}
                        label='Plant'
                        value={values?.plant}
                        onChange={(valueOption) => {
                          setShowReport(false);
                          setFieldValue("plant", valueOption);
                          setFieldValue("wh", "");
                          setRowData([]);
                          setwareHouseDDL([]);
                          wearhouse_api(
                            accId,
                            buId,
                            userId,
                            valueOption?.value,
                            setwareHouseDDL
                          );
                        }}
                        placeholder='Plant'
                      />
                    </div>
                    <div className='col-lg-3'>
                      <NewSelect
                        name='wh'
                        options={
                          [{ value: 0, label: "All" }, ...wareHouseDDL] || []
                        }
                        value={values?.wh}
                        label='WareHouse'
                        onChange={(valueOption) => {
                          setFieldValue("wh", valueOption);
                          setRowData([]);
                        }}
                        placeholder='WareHouse'
                        errors={errors}
                        touched={touched}
                      />
                    </div>
                  </>
                )}
                {/* {[1, 3, 5, 6,7].includes(values?.type?.value) && (
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
                )} */}
                {values?.type?.value === 3 ? (
                  <div className='col-lg-3'>
                    <NewSelect
                      name='viewType'
                      options={[
                        { value: 1, label: "Summary" },
                        { value: 2, label: "Daily Unload Summary" },
                      ]}
                      label='View Type'
                      value={values?.viewType}
                      onChange={(valueOption) => {
                        setShowReport(false);
                        setFieldValue("viewType", valueOption);
                        setRowData([]);
                      }}
                      placeholder='View Type'
                    />
                  </div>
                ) : null}

                {/* if type Buffer Stock vs Delivery */}
                {[10].includes(values?.type?.value) && (
                  <>
                    <div className='col-lg-3'>
                      <NewSelect
                        name='shipPoint'
                        options={[{ value: 0, label: "All" }, ...shipPointDDL]}
                        value={values?.shipPoint}
                        label='ShipPoint'
                        onChange={(valueOption) => {
                          setFieldValue("shipPoint", valueOption);
                          setRowData([]);
                        }}
                        placeholder='ShipPoint'
                      />
                    </div>
                    <div className='col-lg-3'>
                      <NewSelect
                        name='bufferName'
                        options={[
                          {
                            value: 0,
                            label: "All",
                          },
                          ...godownDDL
                        ] || []}
                        value={values?.bufferName}
                        label='Buffer Name'
                        placeholder='Buffer Name'
                        onChange={(e) => {
                          setFieldValue("bufferName", e);
                          setRowData([]);
                        }}
                      />
                    </div>
                  </>
                )}

                {[6, 7, 8, 9, 10]?.includes(values?.type?.value) && (
                  <>
                    <div className='col-lg-3'>
                      <NewSelect
                        name='port'
                        options={portDDL || []}
                        value={values?.port}
                        label='Port'
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
                        placeholder='Port'
                        errors={errors}
                        touched={touched}
                      />
                    </div>

                    <div className='col-lg-3'>
                      <NewSelect
                        name='motherVessel'
                        options={[
                          { value: 0, label: "All" },
                          ...motherVesselDDL,
                        ]}
                        value={values?.motherVessel}
                        label='Mother Vessel'
                        onChange={(valueOption) => {
                          setFieldValue("motherVessel", valueOption);
                        }}
                        placeholder='Mother Vessel'
                      />
                    </div>
                  </>
                )}

                {[8, 9].includes(values?.type?.value) && (
                  <>
                    <div className='col-lg-3'>
                      <label>Item</label>
                      <SearchAsyncSelect
                        selectedValue={values?.intG2GItemId}
                        handleChange={(valueOption) => {
                          setFieldValue("intG2GItemId", valueOption);
                        }}
                        placeholder='Search Item'
                        loadOptions={async (v) => {
                          const searchValue = v.trim();
                          if (searchValue?.length < 3)
                            return [{ value: 0, label: "All" }];
                          return axios
                            .get(
                              `/wms/FertilizerOperation/GetItemListDDL?AccountId=${accId}&BusinessUinitId=${buId}&CorporationType=${0}&SearchTerm=${searchValue}`
                            )
                            .then((res) => [
                              { value: 0, label: "All" },
                              ...res?.data,
                            ]);
                        }}
                        // isDisabled={type}
                      />
                    </div>
                  </>
                )}
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
                    } else if (
                      [4, 5, 6, 7, 8, 9, 10].includes(values?.type?.value)
                    ) {
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
            {[6, 7].includes(values?.type?.value) && (
              <WareHouseInventoryReportTable rowData={rowData} />
            )}
            {[8].includes(values?.type?.value) && (
              <ItemVsWarehouse rowData={rowData} />
            )}
            {[9].includes(values?.type?.value) && (
              <ItemVsMotherVessel rowData={rowData} />
            )}
            {[10].includes(values?.type?.value) && (
              <BufferStockvsDelivery rowData={rowData} />
            )}

            {[5, 6, 7, 8, 9].includes(values?.type?.value) &&
              rowData?.length > 0 && (
                <G2GinventoryChart
                  rowData={rowData}
                  reportType={values?.type?.value}
                />
              )}
          </ICustomCard>
        )}
      </Formik>
    </>
  );
};

export default InventoryG2GReportRDLC;
