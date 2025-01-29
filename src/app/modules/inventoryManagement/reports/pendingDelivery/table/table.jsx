import { Formik } from "formik";
import React, { useEffect, useState } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import moment from "moment";
import {
  Card,
  CardBody,
  CardHeader,
  CardHeaderToolbar,
  ModalProgressBar,
} from "../../../../../../_metronic/_partials/controls";
import {
  _todaysEndTime,
  _todaysStartTime,
} from "../../../../_helper/_currentTime";
import InputField from "../../../../_helper/_inputField";
import { _todayDate } from "../../../../_helper/_todayDate";
import {
  getSBUDDLDelivery_Aciton,
  GetShipPointDDLAction,
  GetWarehouseDDLAction,
} from "../../../warehouseManagement/delivery/_redux/Actions";
import {
  getAreaDDL,
  getDistributionChannelDDL,
  getRegionDDL,
  GetSoldToPartyDDL,
  getTerritoryDDL,
  GetDataOfSalesOrderByTerriroryId_api,
} from "../helper";
import GridView from "./girdView";
import NewSelect from "./../../../../_helper/_select";
import { useHistory } from "react-router";
import { pendingDeliveryReportLandingAction } from "./../../../../_helper/reduxForLocalStorage/Actions";
import ReactHTMLTableToExcel from "react-html-table-to-excel";
import Loading from "../../../../_helper/_loading";

const initData = {
  reportType: "",
  sbu: "",
  shippingPoint: "",
  distributionChannel: "",
  region: "",
  area: "",
  territory: "",
  warehouse: "",
  soldToParty: "",
  fromDate: _todayDate(),
  fromTime: _todaysStartTime(),
  toDate: _todayDate(),
  toTime: _todaysEndTime(),
};

const PendingDeliveryReportTable = () => {
  const [gridData, setGridData] = useState([]);
  const [distributionChannelDDL, setDistributionChannelDDL] = useState([]);
  const [regionDDL, setRegionDDL] = useState([]);
  const [areaDDL, setAreaDDL] = useState([]);
  const [territoryDDL, setTerritoryDDL] = useState([]);
  const [soldToPartyDDL, setSoldToPartyDDL] = useState([]);
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();

  // get user profile data from store
  const {
    profileData,
    selectedBusinessUnit,
    SBUDDL,
    shipPointDDL,
    warehouseDDL,
    pendingDeliveryReportLanding,
  } = useSelector((state) => {
    return {
      profileData: state?.authData?.profileData,
      selectedBusinessUnit: state?.authData?.selectedBusinessUnit,
      SBUDDL: state.delivery.SBUDDL,
      shipPointDDL: state.delivery.shipPointDDL,
      warehouseDDL: state.delivery.warehouseDDL,
      pendingDeliveryReportLanding:
        state?.localStorage?.pendingDeliveryReportLanding,
    };
  }, shallowEqual);

  useEffect(() => {
    if (selectedBusinessUnit?.value && profileData?.accountId) {
      dispatch(
        getSBUDDLDelivery_Aciton(
          profileData.accountId,
          selectedBusinessUnit.value
        )
      );
      dispatch(
        GetShipPointDDLAction(profileData.accountId, selectedBusinessUnit.value)
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedBusinessUnit, profileData]);

  const getGridDataHandler = (values) => {
    const fromDate = moment(`${values?.fromDate} ${values?.fromTime}`).format(
      "YYYY-MM-DDTHH:mm:ss"
    );
    const toDate = moment(`${values?.toDate} ${values?.toTime}`).format(
      "YYYY-MM-DDTHH:mm:ss"
    );

    GetDataOfSalesOrderByTerriroryId_api({
      typeId: values?.reportType?.value,
      accId: profileData?.accountId,
      buId: selectedBusinessUnit?.value,
      warehouseId: values?.warehouse?.value,
      channelId: values?.distributionChannel?.value,
      regionId: values?.region?.value,
      areaId: values?.area?.value,
      territoryId: values?.territory?.value,
      soldToPartyId: values?.soldToParty?.value,
      fromDate,
      toDate,
      setter: setGridData,
      setLoading,
    });
  };

  const modifyItemList = (values) => {
    const isSelected = gridData?.filter((itm) => itm?.itemCheck);
    const modifyData = isSelected?.map((ele) => {
      return {
        ...ele.objRowData,
        warehouse: values?.warehouse?.label,
        warehouseId: values?.warehouse?.value,
        shipToParty: values?.shipToParty?.label,
        deliveryQty: ele?.objRowData?.pendingQty || "",
        salesOrderId: ele?.objRowData?.salesOrderId,
        salesOrderRowId: ele.objRowData.rowId,
        objLocation: ele?.objLocation,
        amount: ele.objRowData.numItemPrice * ele.objRowData.pendingQty,
        specification: ele.objRowData.specification,
        selectLocation: ele?.objLocation?.[0] || "",
      };
    });
    return modifyData;
  };
  const history = useHistory();

  useEffect(() => {
    if (pendingDeliveryReportLanding?.sbu) {
      getGridDataHandler(pendingDeliveryReportLanding);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (
      selectedBusinessUnit?.value &&
      profileData?.accountId &&
      pendingDeliveryReportLanding?.sbu?.value
    ) {
      pendingDeliveryReportLanding?.sbu?.value &&
        getDistributionChannelDDL(
          profileData?.accountId,
          selectedBusinessUnit?.value,
          pendingDeliveryReportLanding?.sbu?.value,
          setDistributionChannelDDL
        );
      pendingDeliveryReportLanding?.shippingPoint?.value &&
        dispatch(
          GetWarehouseDDLAction(
            profileData.accountId,
            selectedBusinessUnit.value,
            pendingDeliveryReportLanding?.shippingPoint?.value
          )
        );
      pendingDeliveryReportLanding?.distributionChannel?.value &&
        getRegionDDL(
          profileData?.accountId,
          selectedBusinessUnit?.value,
          pendingDeliveryReportLanding?.distributionChannel?.value,
          setRegionDDL
        );
      pendingDeliveryReportLanding?.region?.value &&
        getAreaDDL(
          profileData?.accountId,
          selectedBusinessUnit?.value,
          pendingDeliveryReportLanding?.distributionChannel?.value,
          pendingDeliveryReportLanding?.region?.value,
          setAreaDDL
        );
      pendingDeliveryReportLanding?.area?.value &&
        getTerritoryDDL(
          profileData?.accountId,
          selectedBusinessUnit?.value,
          pendingDeliveryReportLanding?.distributionChannel?.value,
          pendingDeliveryReportLanding?.area?.value,
          setTerritoryDDL
        );

      pendingDeliveryReportLanding?.territory?.value &&
        GetSoldToPartyDDL(
          profileData?.accountId,
          selectedBusinessUnit?.value,
          pendingDeliveryReportLanding?.territory?.value,
          setSoldToPartyDDL
        );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedBusinessUnit, profileData]);

  return (
    <Formik
      enableReinitialize={true}
      initialValues={{ ...initData, ...pendingDeliveryReportLanding }}
      onSubmit={(values, { setSubmitting, resetForm }) => {}}
    >
      {({
        handleSubmit,
        resetForm,
        values,
        errors,
        touched,
        setFieldValue,
        setValues,
      }) => (
        <>
        {loading && <Loading/>}
          <Card>
            {true && <ModalProgressBar />}
            <CardHeader title={"Pending Delivery Report"}>
              <CardHeaderToolbar>
                <button
                  className="btn btn-primary"
                  disabled={
                    gridData?.filter((item) => item?.itemCheck)?.length <= 0
                  }
                  onClick={() => {
                    const isSelected = gridData?.filter(
                      (itm) => itm?.itemCheck
                    );
                    const createValues = {
                      sbu: {
                        value: values?.sbu?.value,
                        label: values?.sbu?.label,
                      },
                      shipPoint: values?.shippingPoint,
                      distributionChannel: {
                        value: isSelected?.[0]?.objRowData?.channelId,
                        label: isSelected?.[0]?.objRowData?.channelname,
                      },
                      soldToParty: {
                        value: isSelected?.[0]?.objRowData?.soldToPartnerId,
                        label: isSelected?.[0]?.objRowData?.soldToPartnerName,
                      },
                      shipToParty: {
                        value: isSelected?.[0]?.objRowData?.shipToPartnerId,
                        label: isSelected?.[0]?.objRowData?.shipToPartnerName,
                      },
                      warehouse: values?.warehouse,
                    };
                    dispatch(pendingDeliveryReportLandingAction(values));
                    history.push({
                      pathname:
                        "/inventory-management/warehouse-management/delivery/add",
                      state: {
                        ...createValues,
                        itemLists: modifyItemList(createValues),
                      },
                    });
                  }}
                >
                  Create Delivery
                </button>
              </CardHeaderToolbar>
            </CardHeader>
            <CardBody>
              <form className="form form-label-right global-form">
                <div className="row">
                  <div className="col-lg-2">
                    <NewSelect
                      label="Select Report Type"
                      options={[
                        { value: 1, label: "Pending Delivery Report" },
                        { value: 2, label: "Pending Delivery-Shipment Report" },
                      ]}
                      value={values?.reportType}
                      name="reportType"
                      setFieldValue={setFieldValue}
                      onChange={(valueOption) => {
                        setFieldValue("reportType", valueOption);
                      }}
                      errors={errors}
                      touched={touched}
                    />
                  </div>
                  <div className="col-lg-2">
                    <NewSelect
                      label="Select SBU"
                      options={SBUDDL || []}
                      value={values?.sbu}
                      name="sbu"
                      setFieldValue={setFieldValue}
                      onChange={(valueOption) => {
                        setDistributionChannelDDL([]);
                        setValues({
                          ...values,
                          sbu: valueOption,
                          distributionChannel: "",
                          region: "",
                          area: "",
                          territory: "",
                        });
                        getDistributionChannelDDL(
                          profileData?.accountId,
                          selectedBusinessUnit?.value,
                          valueOption?.value,
                          setDistributionChannelDDL
                        );
                      }}
                      errors={errors}
                      touched={touched}
                    />
                  </div>
                  <div className="col-lg-2">
                    <NewSelect
                      label="Select Shipping Point"
                      options={shipPointDDL || []}
                      value={values?.shippingPoint}
                      name="shippingPoint"
                      setFieldValue={setFieldValue}
                      errors={errors}
                      touched={touched}
                      onChange={(valueOption) => {
                        setFieldValue("shippingPoint", valueOption);
                        setFieldValue("warehouse", "");
                        dispatch(
                          GetWarehouseDDLAction(
                            profileData.accountId,
                            selectedBusinessUnit.value,
                            valueOption?.value
                          )
                        );
                      }}
                    />
                  </div>
                  <div className="col-lg-2">
                    <NewSelect
                      label="Select Warehouse"
                      options={warehouseDDL || []}
                      value={values?.warehouse}
                      name="warehouse"
                      setFieldValue={setFieldValue}
                      errors={errors}
                      touched={touched}
                      onChange={(valueOption) => {
                        setFieldValue("warehouse", valueOption);
                      }}
                    />
                  </div>
                  <div className="col-lg-2">
                    <NewSelect
                      label="Select Distribution Channel"
                      options={
                        [
                          { value: 0, label: "All" },
                          ...distributionChannelDDL,
                        ] || []
                      }
                      value={values?.distributionChannel}
                      name="distributionChannel"
                      setFieldValue={setFieldValue}
                      onChange={(valueOption) => {
                        setRegionDDL([]);
                        setAreaDDL([]);
                        setTerritoryDDL([]);
                        const obj = { value: 0, label: "All" };
                        const ifAllSect = valueOption?.value === 0;
                        setValues({
                          ...values,
                          distributionChannel: valueOption,
                          region: ifAllSect ? obj : "",
                          area: ifAllSect ? obj : "",
                          territory: ifAllSect ? obj : "",
                          soldToParty: ifAllSect ? obj : "",
                        });
                        getRegionDDL(
                          profileData?.accountId,
                          selectedBusinessUnit?.value,
                          valueOption?.value,
                          setRegionDDL
                        );
                      }}
                      errors={errors}
                      touched={touched}
                    />
                  </div>
                  <div className="col-lg-2">
                    <NewSelect
                      label="Select Region"
                      options={[{ value: 0, label: "All" }, ...regionDDL] || []}
                      value={values?.region}
                      name="region"
                      setFieldValue={setFieldValue}
                      onChange={(valueOption) => {
                        const obj = { value: 0, label: "All" };
                        const ifAllSect = valueOption?.value === 0;
                        setAreaDDL([]);
                        setTerritoryDDL([]);
                        setValues({
                          ...values,
                          region: valueOption,
                          area: ifAllSect ? obj : "",
                          territory: ifAllSect ? obj : "",
                          soldToParty: ifAllSect ? obj : "",
                        });
                        getAreaDDL(
                          profileData?.accountId,
                          selectedBusinessUnit?.value,
                          values?.distributionChannel?.value,
                          valueOption?.value,
                          setAreaDDL
                        );
                      }}
                      errors={errors}
                      touched={touched}
                    />
                  </div>
                  <div className="col-lg-2">
                    <NewSelect
                      label="Select Area"
                      options={[{ value: 0, label: "All" }, ...areaDDL] || []}
                      value={values?.area}
                      name="area"
                      setFieldValue={setFieldValue}
                      onChange={(valueOption) => {
                        const obj = { value: 0, label: "All" };
                        const ifAllSect = valueOption?.value === 0;
                        setTerritoryDDL([]);
                        setValues({
                          ...values,
                          area: valueOption,
                          territory: ifAllSect ? obj : "",
                          soldToParty: ifAllSect ? obj : "",
                        });
                        getTerritoryDDL(
                          profileData?.accountId,
                          selectedBusinessUnit?.value,
                          values?.distributionChannel?.value,
                          valueOption?.value,
                          setTerritoryDDL
                        );
                      }}
                      errors={errors}
                      touched={touched}
                    />
                  </div>
                  <div className="col-lg-2">
                    <NewSelect
                      label="Select Territory"
                      options={
                        [{ value: 0, label: "All" }, ...territoryDDL] || []
                      }
                      value={values?.territory}
                      name="territory"
                      setFieldValue={setFieldValue}
                      onChange={(valueOption) => {
                        const obj = { value: 0, label: "All" };
                        const ifAllSect = valueOption?.value === 0;
                        setFieldValue("territory", valueOption);
                        setFieldValue("soldToParty", ifAllSect ? obj : "");

                        GetSoldToPartyDDL(
                          profileData?.accountId,
                          selectedBusinessUnit?.value,
                          valueOption?.value,
                          setSoldToPartyDDL
                        );
                      }}
                      errors={errors}
                      touched={touched}
                    />
                  </div>
                  <div className="col-lg-2">
                    <NewSelect
                      label="Select Sold To Party"
                      options={
                        [{ value: 0, label: "All" }, ...soldToPartyDDL] || []
                      }
                      value={values?.soldToParty}
                      name="soldToParty"
                      setFieldValue={setFieldValue}
                      errors={errors}
                      touched={touched}
                      onChange={(valueOption) => {
                        setFieldValue("soldToParty", valueOption);
                      }}
                    />
                  </div>
                  <div className="col-lg-4">
                    <label>From Date and Time</label>
                    <div className="d-flex">
                      <InputField
                        value={values?.fromDate}
                        type="date"
                        name="fromDate"
                      />
                      <InputField
                        value={values?.fromTime}
                        type="time"
                        name="fromTime"
                      />
                    </div>
                  </div>

                  <div className="col-lg-4">
                    <label>To Date and Time</label>
                    <div className="d-flex">
                      <InputField
                        value={values?.toDate}
                        type="date"
                        name="toDate"
                      />
                      <InputField
                        value={values?.toTime}
                        type="time"
                        name="toTime"
                      />
                    </div>
                  </div>
                  <div className="col-lg-4 mt-5">
                    <button
                      className="btn btn-primary mr-2"
                      onClick={() => {
                        getGridDataHandler(values);
                        dispatch(pendingDeliveryReportLandingAction(values));
                      }}
                      type="button"
                    >
                      View
                    </button>
                    <ReactHTMLTableToExcel
                      id="test-table-xls-button-att-reports"
                      className="btn btn-primary"
                      table="table-to-xlsx"
                      filename="Pending Delivery Report"
                      sheet="Pending Delivery Report"
                      buttonText="Export Excel"
                    />
                  </div>
                </div>
              </form>
              <GridView
                reportTypeId={values?.reportType?.value}
                gridData={gridData}
                setGridData={setGridData}
                selectedBusinessUnit={selectedBusinessUnit}
              />
            </CardBody>
          </Card>
        </>
      )}
    </Formik>
  );
};

export default PendingDeliveryReportTable;
