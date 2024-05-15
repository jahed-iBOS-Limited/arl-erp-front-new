import { Form, Formik } from "formik";
import React, { useEffect, useState } from "react";
import { shallowEqual, useSelector } from "react-redux";
import { useHistory, useLocation } from "react-router-dom";
import { _dateFormatter } from "../../../_helper/_dateFormate";
import IEdit from "../../../_helper/_helperIcons/_edit";
import InputField from "../../../_helper/_inputField";
import NewSelect from "../../../_helper/_select";
import IViewModal from "../../../_helper/_viewModal";
import useAxiosGet from "../../../_helper/customHooks/useAxiosGet";
import IForm from "./../../../_helper/_form";
import Loading from "./../../../_helper/_loading";
import ViewModal from "./viewModal";

const initData = {
  plant: "",
  channel: "",
  region: "",
  area: "",
  territory: "",
  year: "",
  horizon: "",
  startDate: "",
  endDate: "",
};
export default function DetailsSalesPlanLanding() {
  const { profileData, selectedBusinessUnit } = useSelector((state) => {
    return state.authData;
  }, shallowEqual);

  const history = useHistory();
  const [gridData, getGridData, loading] = useAxiosGet();
  const [channelDDL, getChannelDDL] = useAxiosGet();
  const [regionDDL, getRegionDDL, , setRegionDDL] = useAxiosGet();
  const [areaDDL, getAreaDDL, , setAreaDDL] = useAxiosGet();
  const [territoryDDL, getTerritoryDDL, , setTerritoryDDL] = useAxiosGet();
  const location = useLocation();
  const [isShowModal, setIsShowModal] = useState(false);

  useEffect(() => {
    getChannelDDL(
      `/oms/DistributionChannel/GetDistributionChannelDDL?AccountId=${profileData?.accountId}&BUnitId=${selectedBusinessUnit?.value}`
    );
    getGridData(
      `/mes/SalesPlanning/DetailsSalesPlanLandingPagination?SalesPlanId=${location?.state?.monthlyItem?.salesPlanId}&AccountId=${profileData?.accountId}&BusinessUnitId=${selectedBusinessUnit?.value}&PlantId=${location?.state?.monthlyValues?.plant?.value}&Year=${location?.state?.monthlyValues?.year?.label}&PlanningHorizonId=${location?.state?.monthlyItem?.horizonId}&PlanningHorizonRowId=${location?.state?.monthlyItem?.planningHorizonRowId}&DistributionChannelId=0&RegoinId=0&AreaId=0&TeritoryId=0&PageNo=1&PageSize=500&ViewOrder=desc`
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profileData, selectedBusinessUnit]);

  const saveHandler = (values, cb) => {};
  return (
    <Formik
      enableReinitialize={true}
      initialValues={{
        ...initData,
        ...location?.state?.monthlyValues,
        horizon: {
          value: location?.state?.monthlyItem?.horizonId,
          label: location?.state?.monthlyItem?.horizonName,
          planningHorizonRowId:
            location?.state?.monthlyItem?.planningHorizonRowId,
        },
        startDate: _dateFormatter(location?.state?.monthlyItem?.startDate),
        endDate: _dateFormatter(location?.state?.monthlyItem?.endDate),
      }}
      // validationSchema={{}}
      onSubmit={(values, { setSubmitting, resetForm }) => {
        saveHandler(values, () => {
          resetForm(initData);
        });
      }}
    >
      {({
        handleSubmit,
        resetForm,
        values,
        setFieldValue,
        isValid,
        errors,
        touched,
      }) => (
        <>
          {loading && <Loading />}
          <IForm
            title="Details Sales Plan"
            isHiddenReset
            isHiddenSave
            isPositionRight
            renderProps={() => {
              return (
                <div className="ml-2">
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={() => {
                      history.push({
                        pathname: `/internal-control/budget/detailsalseplan/details/create`,
                        state: {
                          monthlyValues: location?.state?.monthlyValues,
                          monthlyItem: location?.state?.monthlyItem,
                        },
                      });
                    }}
                  >
                    Create
                  </button>
                </div>
              );
            }}
          >
            <Form>
              <div className="global-form row">
                <div className="col-lg-3">
                  <NewSelect
                    name="plant"
                    options={[]}
                    value={values?.plant}
                    label="Plant"
                    placeholder="Plant"
                    errors={errors}
                    touched={touched}
                    isDisabled={true}
                  />
                </div>
                <div className="col-lg-3">
                  <NewSelect
                    name="year"
                    options={[]}
                    value={values?.year}
                    label="Year"
                    placeholder="Year"
                    errors={errors}
                    touched={touched}
                    isDisabled={true}
                  />
                </div>
                <div className="col-lg-3">
                  <NewSelect
                    name="horizon"
                    options={[]}
                    value={values?.horizon}
                    label="Planning Horizon"
                    placeholder="Planning Horizon"
                    errors={errors}
                    touched={touched}
                    isDisabled={true}
                  />
                </div>
                <div className="col-lg-3">
                  <NewSelect
                    name="channel"
                    options={channelDDL || []}
                    value={values?.channel}
                    label="Distribution Channel"
                    onChange={(valueOption) => {
                      if (valueOption) {
                        setFieldValue("channel", valueOption);
                        setFieldValue("region", "");
                        setFieldValue("area", "");
                        setFieldValue("territory", "");
                        getRegionDDL(
                          `/oms/TerritoryInfo/GetTerrotoryRegionAreaByChannel?channelId=${valueOption?.value ||
                            0}`,
                          (res) => {
                            const newDDL = res?.map((item) => ({
                              ...item,
                              value: item?.regionId,
                              label: item?.regionName,
                            }));
                            setRegionDDL(newDDL);
                          }
                        );
                        setAreaDDL([]);
                        setTerritoryDDL([]);
                      } else {
                        setFieldValue("channel", "");
                        setFieldValue("region", "");
                        setFieldValue("area", "");
                        setFieldValue("territory", "");
                        setRegionDDL([]);
                        setAreaDDL([]);
                        setTerritoryDDL([]);
                      }
                    }}
                    placeholder="Select Distribution Channel"
                    errors={errors}
                    touched={touched}
                  />
                </div>
                <div className="col-lg-3">
                  <NewSelect
                    name="region"
                    options={regionDDL || []}
                    value={values?.region}
                    label="Region"
                    onChange={(valueOption) => {
                      if (valueOption) {
                        setFieldValue("region", valueOption);
                        setFieldValue("area", "");
                        setFieldValue("territory", "");
                        getAreaDDL(
                          `/oms/TerritoryInfo/GetTerrotoryRegionAreaByChannel?channelId=${
                            values?.channel?.value
                          }&regionId=${valueOption?.value || 0}`,
                          (res) => {
                            const newDDL = res?.map((item) => ({
                              ...item,
                              value: item?.areaId,
                              label: item?.areaName,
                            }));
                            setAreaDDL(newDDL);
                          }
                        );
                        setTerritoryDDL([]);
                      } else {
                        setFieldValue("region", "");
                        setFieldValue("area", "");
                        setFieldValue("territory", "");
                        setAreaDDL([]);
                        setTerritoryDDL([]);
                      }
                    }}
                    placeholder="Region"
                    isDisabled={!values?.channel}
                    errors={errors}
                    touched={touched}
                  />
                </div>
                <div className="col-lg-3">
                  <NewSelect
                    name="area"
                    options={areaDDL || []}
                    value={values?.area}
                    label="Area"
                    onChange={(valueOption) => {
                      if (valueOption) {
                        setFieldValue("area", valueOption);
                        setFieldValue("territory", "");
                        getTerritoryDDL(
                          `/oms/TerritoryInfo/GetTerrotoryRegionAreaByChannel?channelId=${
                            values?.channel?.value
                          }&regionId=${
                            values?.region?.value
                          }&areaId=${valueOption?.value || 0}`,
                          (res) => {
                            const newDDL = res?.map((item) => ({
                              ...item,
                              value: item?.territoryId,
                              label: item?.territoryName,
                            }));
                            setTerritoryDDL(newDDL);
                          }
                        );
                      } else {
                        setFieldValue("area", "");
                        setFieldValue("territory", "");
                        setTerritoryDDL([]);
                      }
                    }}
                    placeholder="Area"
                    isDisabled={!values?.region}
                    errors={errors}
                    touched={touched}
                  />
                </div>
                <div className="col-lg-3">
                  <NewSelect
                    name="territory"
                    options={territoryDDL || []}
                    value={values?.territory}
                    label="Territory"
                    onChange={(valueOption) => {
                      setFieldValue("territory", valueOption);
                    }}
                    placeholder="Territory"
                    isDisabled={!values?.area}
                    errors={errors}
                    touched={touched}
                  />
                </div>
                <div className="col-lg-3">
                  <label>Start Date</label>
                  <InputField
                    value={values?.startDate}
                    name="startDate"
                    type="text"
                    disabled
                  />
                </div>
                <div className="col-lg-3">
                  <label>End Date</label>
                  <InputField
                    value={values?.endDate}
                    name="endDate"
                    type="text"
                    disabled
                  />
                </div>
                <div className="">
                  <button
                    onClick={() => {
                      getGridData(
                        `/mes/SalesPlanning/DetailsSalesPlanLandingPagination?SalesPlanId=${
                          location?.state?.monthlyItem?.salesPlanId
                        }&AccountId=${profileData?.accountId}&BusinessUnitId=${
                          selectedBusinessUnit?.value
                        }&PlantId=${
                          location?.state?.monthlyValues?.plant?.value
                        }&Year=${
                          location?.state?.monthlyValues?.year?.label
                        }&PlanningHorizonId=${
                          location?.state?.monthlyItem?.horizonId
                        }&PlanningHorizonRowId=${
                          location?.state?.monthlyItem?.planningHorizonRowId
                        }&DistributionChannelId=${values?.channel?.value ||
                          0}&RegoinId=${values?.region?.value ||
                          0}&AreaId=${values?.area?.value ||
                          0}&TeritoryId=${values?.territory?.value ||
                          0}&PageNo=1&PageSize=500&ViewOrder=desc`
                      );
                    }}
                    style={{ marginTop: "18px" }}
                    className="btn btn-primary"
                  >
                    View
                  </button>
                </div>
                <div className="mt-5 ml-5">
                  <h4>
                    Monthly Total Sales Plan Quantity :{" "}
                    <span
                      onClick={() => {
                        setIsShowModal(true);
                      }}
                      style={{
                        color: "blue",
                        cursor: "pointer",
                        textDecoration: "underline",
                      }}
                    >
                      {location?.state?.monthlyItem?.planQTY}
                    </span>
                  </h4>
                </div>
              </div>

              {gridData?.data?.length > 0 && (
                          <div className="table-responsive">
<table className="global-table table">
                  <>
                    <thead>
                      <tr>
                        <th>SL</th>
                        <th>Horizon Name</th>
                        <th>Distribuation Channel</th>
                        <th>Region</th>
                        <th>Area</th>
                        <th>Territory</th>
                        <th>Start Date</th>
                        <th>End Date</th>
                        <th>Sales Plan Quantity</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {gridData?.data?.map((item, index) => (
                        <tr key={index}>
                          <td>{item?.sl}</td>
                          <td>{item?.horizonName}</td>
                          <td>{item?.strDistributionChannelName}</td>
                          <td>{item?.strRegionName}</td>
                          <td>{item?.strAreaName}</td>
                          <td>{item?.strTeritoryName}</td>
                          <td>{_dateFormatter(item?.startDate)}</td>
                          <td>{_dateFormatter(item?.endDate)}</td>
                          <td className="text-center">{item?.planQTY}</td>
                          <td>
                            <div className="d-flex justify-content-around">
                              <span
                                onClick={() =>
                                  history.push({
                                    pathname: `/internal-control/budget/detailsalseplan/details/edit`,
                                    state: {
                                      monthlyValues:
                                        location?.state?.monthlyValues,
                                      monthlyItem: location?.state?.monthlyItem,
                                      detailsItem: item,
                                    },
                                  })
                                }
                              >
                                <IEdit />
                              </span>
                            </div>
                          </td>
                        </tr>
                      ))}
                      <tr>
                        <td colSpan={8}>Total</td>
                        <td className="text-center">
                          {gridData?.data?.reduce(
                            (accumulator, currentValue) =>
                              accumulator + (currentValue?.planQTY || 0),
                            0
                          )}
                        </td>
                        <td></td>
                      </tr>
                    </tbody>
                  </>
                </table>
                          </div>
                
              )}
            </Form>
          </IForm>
          <IViewModal
            show={isShowModal}
            backdrop={false}
            onHide={() => {
              setIsShowModal(false);
            }}
          >
            <ViewModal id={location?.state?.monthlyItem?.salesPlanId} />
          </IViewModal>
        </>
      )}
    </Formik>
  );
}
