/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState } from "react";
import { useSelector, shallowEqual } from "react-redux";
import {
  Card,
  CardHeader,
  CardHeaderToolbar,
  CardBody,
  ModalProgressBar,
} from "../../../../../../_metronic/_partials/controls";
import { Formik } from "formik";
import GridView from "./table";
import useAxiosGet from "../../../../_helper/customHooks/useAxiosGet";
import Loading from "../../../../_helper/_loading";
import NewSelect from "../../../../_helper/_select";
import {
  monthDDL,
  yearsDDL,
} from "../../../../inventoryManagement/warehouseManagement/liftingEntry/form/addEditForm";
import { getRegionAreaTerritory } from "../../../../salesManagement/report/customerSalesTargetReport/helper";
import { useEffect } from "react";
import { getDistributionChannelDDL_api } from "../../../../transportManagement/report/transportSupplierUpdate/helper";

const initData = {
  channel: "",
  region: "",
  area: "",
  territory: "",
  month: "",
  year: "",
};

const MarketShareReport = () => {
  const [rowData, getRowData, isLoading] = useAxiosGet();
  const [loading, setLoading] = useState(false);
  const [channelList, setChannelList] = useState([]);
  const [regionList, setRegionList] = useState([]);
  const [areaList, setAreaList] = useState([]);
  const [territoryList, setTerritoryList] = useState([]);

  // get user profile data from store
  const {
    profileData: { accountId: accId, employeeId: empId },
    selectedBusinessUnit: { value: buId },
  } = useSelector((state) => state?.authData, shallowEqual);

  useEffect(() => {
    if (accId && buId) {
      getDistributionChannelDDL_api(accId, buId, setChannelList);
    }
  }, []);

  const getData = (values) => {
    const levelId = values?.territory ? 7 : values?.area ? 6 : 5;
    const ratId = values?.territory
      ? values?.territory?.value
      : values?.area
      ? values?.area?.value
      : values?.region?.value;
    const url = `/oms/SalesInformation/GetMarketShareAnalysis?intunitid=${buId}&intMonthId=${values?.month?.value}&intYearId=${values?.year?.value}&intEmployeeid=${empId}&RATId=${ratId}&LevelId=${levelId}`;

    getRowData(url);
  };

  const onChangeHandler = (fieldName, values, currentValue, setFieldValue) => {
    switch (fieldName) {
      case "channel":
        setFieldValue("channel", currentValue);
        setFieldValue("region", "");
        setFieldValue("area", "");
        setFieldValue("territory", "");
        if (currentValue) {
          getRegionAreaTerritory({
            channelId: currentValue?.value,
            setter: setRegionList,
            setLoading: setLoading,
            value: "regionId",
            label: "regionName",
          });
        }
        break;

      case "region":
        setFieldValue("region", currentValue);
        setFieldValue("area", "");
        setFieldValue("territory", "");
        if (currentValue) {
          getRegionAreaTerritory({
            channelId: values?.channel?.value,
            regionId: currentValue?.value,
            setter: setAreaList,
            setLoading: setLoading,
            value: "areaId",
            label: "areaName",
          });
        }
        break;

      case "area":
        setFieldValue("area", currentValue);
        setFieldValue("territory", "");
        if (currentValue) {
          getRegionAreaTerritory({
            channelId: values?.channel?.value,
            regionId: values?.region?.value,
            areaId: currentValue?.value,
            setter: setTerritoryList,
            setLoading: setLoading,
            value: "territoryId",
            label: "territoryName",
          });
        }
        break;

      default:
        break;
    }
  };

  return (
    <>
      <Formik enableReinitialize={true} initialValues={initData}>
        {({ values, setFieldValue, errors, touched }) => (
          <>
            <Card>
              <ModalProgressBar />
              <CardHeader title="Market Share Analysis">
                <CardHeaderToolbar></CardHeaderToolbar>
              </CardHeader>
              <CardBody>
                {(isLoading || loading) && <Loading />}
                <form className="form form-label-right">
                  <div className="global-form">
                    <div className="row">
                      <>
                        <div className="col-lg-3">
                          <NewSelect
                            name="channel"
                            options={channelList || []}
                            value={values?.channel}
                            label="Distribution Channel"
                            onChange={(e) => {
                              onChangeHandler(
                                "channel",
                                values,
                                e,
                                setFieldValue
                              );
                            }}
                            placeholder="Distribution Channel"
                            errors={errors}
                            touched={touched}
                          />
                        </div>
                        <div className="col-lg-3">
                          <NewSelect
                            name="region"
                            options={regionList || []}
                            value={values?.region}
                            label="Region"
                            onChange={(e) => {
                              onChangeHandler(
                                "region",
                                values,
                                e,
                                setFieldValue
                              );
                            }}
                            placeholder="Region"
                            errors={errors}
                            touched={touched}
                            isDisabled={!values?.channel}
                          />
                        </div>
                        <div className="col-lg-3">
                          <NewSelect
                            name="area"
                            options={areaList || []}
                            value={values?.area}
                            label="Area"
                            onChange={(e) => {
                              onChangeHandler("area", values, e, setFieldValue);
                            }}
                            placeholder="Area"
                            errors={errors}
                            touched={touched}
                            isDisabled={!values?.region}
                          />
                        </div>
                        <div className="col-lg-3">
                          <NewSelect
                            name="territory"
                            options={territoryList || []}
                            value={values?.territory}
                            label="Territory"
                            onChange={(valueOption) => {
                              setFieldValue("territory", valueOption);
                            }}
                            placeholder="Territory"
                            errors={errors}
                            touched={touched}
                            isDisabled={!values?.region || !values?.area}
                          />
                        </div>
                      </>
                      <div className="col-lg-3">
                        <NewSelect
                          name="month"
                          options={monthDDL}
                          value={values?.month}
                          label="Month"
                          onChange={(valueOption) => {
                            setFieldValue("month", valueOption);
                          }}
                          placeholder="Month"
                        />
                      </div>
                      <div className="col-lg-3">
                        <NewSelect
                          name="year"
                          options={yearsDDL}
                          value={values?.year}
                          label="Year"
                          onChange={(valueOption) => {
                            setFieldValue("year", valueOption);
                          }}
                          placeholder="Year"
                        />
                      </div>
                      <div className="col-lg-3">
                        <button
                          className="btn btn-primary btn-sm mt-5"
                          type="button"
                          onClick={() => {
                            getData(values);
                          }}
                          disabled={
                            isLoading ||
                            loading ||
                            !values?.month ||
                            !values?.year ||
                            !values?.region
                          }
                        >
                          View
                        </button>
                      </div>
                    </div>
                  </div>
                  <GridView rowData={rowData} />
                </form>
              </CardBody>
            </Card>
          </>
        )}
      </Formik>
    </>
  );
};

export default MarketShareReport;
