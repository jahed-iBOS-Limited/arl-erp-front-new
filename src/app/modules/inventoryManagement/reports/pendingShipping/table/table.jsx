import { Formik } from "formik";
import React, { useEffect, useState } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import moment from "moment";
import {
  _todaysEndTime,
  _todaysStartTime,
} from "../../../../_helper/_currentTime";
import InputField from "../../../../_helper/_inputField";
import { _todayDate } from "../../../../_helper/_todayDate";
import Loading from "./../../../../_helper/_loading";
import {
  getAreaDDL,
  getDistributionChannelDDL,
  getRegionDDL,
  GetSoldToPartyDDL,
  getTerritoryDDL,
  getPendingShippingReportLandingData,
} from "../helper";
import GridView from "./girdView";
import NewSelect from "./../../../../_helper/_select";
import {
  getSBUDDLDelivery_Aciton,
  GetShipPointDDLAction,
  // GetWarehouseDDLAction,
} from "../../../warehouseManagement/delivery/_redux/Actions";
import ReactHTMLTableToExcel from "react-html-table-to-excel";
import ICard from "../../../../_helper/_card";

const initData = {
  sbu: "",
  shippingPoint: "",
  distributionChannel: "",
  region: "",
  area: "",
  territory: "",
  // warehouse: "",
  soldToParty: "",
  fromDate: _todayDate(),
  fromTime: _todaysStartTime(),
  toDate: _todayDate(),
  toTime: _todaysEndTime(),
};

const PendingShippingReportTable = () => {
  const [gridData, setGridData] = useState([]);
  const [distributionChannelDDL, setDistributionChannelDDL] = useState([]);
  const [regionDDL, setRegionDDL] = useState([]);
  const [areaDDL, setAreaDDL] = useState([]);
  const [territoryDDL, setTerritoryDDL] = useState([]);
  const [soldToPartyDDL, setSoldToPartyDDL] = useState([]);
  const [loading, setLoading] = useState(false);
  const obj = { value: 0, label: "All" };

  const dispatch = useDispatch();

  // get user profile data from store
  const {
    profileData,
    selectedBusinessUnit,
    SBUDDL,
    shipPointDDL,
    // warehouseDDL,
  } = useSelector((state) => {
    return {
      profileData: state?.authData?.profileData,
      selectedBusinessUnit: state?.authData?.selectedBusinessUnit,
      SBUDDL: state.delivery.SBUDDL,
      shipPointDDL: state.delivery.shipPointDDL,
      // warehouseDDL: state.delivery.warehouseDDL,
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

    getPendingShippingReportLandingData(
      profileData.accountId,
      selectedBusinessUnit.value,
      // values?.warehouse?.value,
      values?.distributionChannel?.value,
      values?.region?.value,
      values?.area?.value,
      values?.territory?.value,
      values?.soldToParty?.value,
      fromDate,
      toDate,
      values?.shippingPoint?.value,
      setGridData,
      setLoading
    );
  };

  return (
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
        setValues,
      }) => (
        <>
          <ICard title="Pending Shipping Report">
            {loading && <Loading />}
            <form className="form form-label-right global-form">
              <div className="row">
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
                      // setFieldValue("warehouse", "");
                      // dispatch(
                      //   GetWarehouseDDLAction(
                      //     profileData.accountId,
                      //     selectedBusinessUnit.value,
                      //     valueOption?.value
                      //   )
                      // );
                    }}
                  />
                </div>
                {/* <div className="col-lg-2">
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
                  </div> */}
                {console.log("Values", values)}
                <div className="col-lg-2">
                  <NewSelect
                    label="Select Distribution Channel"
                    options={
                      [{ value: 0, label: "All" }, ...distributionChannelDDL] ||
                      []
                    }
                    value={values?.distributionChannel}
                    name="distributionChannel"
                    setFieldValue={setFieldValue}
                    onChange={(valueOption) => {
                      setRegionDDL([]);
                      setAreaDDL([]);
                      setTerritoryDDL([]);
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
                      setAreaDDL([]);
                      setTerritoryDDL([]);
                      const ifAllSect = valueOption?.value === 0;
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
                      setTerritoryDDL([]);
                      const ifAllSect = valueOption?.value === 0;
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
                      setFieldValue("territory", valueOption);
                      setFieldValue("soldToParty", "");
                      const ifAllSect = valueOption?.value === 0;
                      setValues({
                        ...values,
                        territory: valueOption,
                        soldToParty: ifAllSect ? obj : "",
                      });
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
                <div className="col-lg-2 mr-0 ml-0 p-0 mt-5 d-flex">
                  <button
                    className="btn btn-primary"
                    disabled={
                      !values?.sbu?.label ||
                      !values?.shippingPoint?.label ||
                      !values?.distributionChannel?.label ||
                      !values?.region?.label ||
                      !values?.area?.label ||
                      !values?.territory?.label ||
                      !values?.soldToParty?.label
                    }
                    onClick={() => {
                      getGridDataHandler(values);
                    }}
                    type="button"
                  >
                    View
                  </button>
                  <div className="pl-1">
                    <ReactHTMLTableToExcel
                    id="test-table-xls-button-att-reports"
                    className="btn btn-primary"
                    table="table-to-xlsx"
                    filename="Pending Shipping Report"
                    sheet="Pending Shipping Report"
                    buttonText="Export Excel"
                  />
                  </div>
                  
                </div>
              </div>
            </form>
            <GridView gridData={gridData} setGridData={setGridData} />
            {/* </CardBody> */}
          </ICard>
        </>
      )}
    </Formik>
  );
};

export default PendingShippingReportTable;
