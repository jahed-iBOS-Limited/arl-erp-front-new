import { Form, Formik } from "formik";
import React, { useEffect, useState } from "react";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { _dateFormatter } from "../../../../_helper/_dateFormate";
import IForm from "../../../../_helper/_form";
import IEdit from "../../../../_helper/_helperIcons/_edit";
import InputField from "../../../../_helper/_inputField";
import Loading from "../../../../_helper/_loading";
import NewSelect from "../../../../_helper/_select";
import IViewModal from "../../../../_helper/_viewModal";
import useAxiosGet from "../../../../_helper/customHooks/useAxiosGet";
import { SetSalesAndProductionTableLandingAction } from "../../../../_helper/reduxForLocalStorage/Actions";
import { getHorizonDDL, getLandingPlantDDL, getYearDDL } from "../helper";
import VersionModal from "./versionModal";
import PaginationTable from "../../../../_helper/_tablePagination";

const SalesAndProductionTable = () => {
  const [plantDDL, setPlantDDL] = useState([]);
  const [yearDDL, setYearDDL] = useState([]);
  const [horizonDDL, setHorizonDDL] = useState([]);
  const [channelDDL, getChannelDDL] = useAxiosGet();
  const [regionDDL, getRegionDDL, , setRegionDDL] = useAxiosGet();
  const [areaDDL, getAreaDDL, , setAreaDDL] = useAxiosGet();
  const [territoryDDL, getTerritoryDDL, , setTerritoryDDL] = useAxiosGet();
  //paginationState
  const [pageNo, setPageNo] = React.useState(0);
  const [pageSize, setPageSize] = React.useState(15);

  // eslint-disable-next-line no-unused-vars
  const [gridData, getGridData, loading, setGgidData] = useAxiosGet();
  const history = useHistory();
  const dispatch = useDispatch();

  /* Version Modal State */
  const [versionModalShow, setVersionModalShow] = useState(false);
  const [versionModalData, setVersionModalData] = useState();

  const { profileData, selectedBusinessUnit, localStorage } = useSelector(
    (state) => {
      return {
        profileData: state.authData.profileData,
        selectedBusinessUnit: state.authData.selectedBusinessUnit,
        localStorage: state.localStorage,
      };
    }
  );

  console.log(
    "salesAndProductionTableLanding",
    localStorage?.salesAndProductionTableLanding
  );
  const { plant, channel, region, area, territory, year, horizon } =
    localStorage?.salesAndProductionTableLanding || {};

  useEffect(() => {
    getLandingPlantDDL(
      profileData?.accountId,
      selectedBusinessUnit?.value,
      setPlantDDL
    );

    getChannelDDL(
      `/oms/DistributionChannel/GetDistributionChannelDDL?AccountId=${profileData?.accountId}&BUnitId=${selectedBusinessUnit?.value}`
    );

    getYearDDL(
      profileData?.accountId,
      selectedBusinessUnit?.value,
      plant?.value || 0,
      setYearDDL
    );
    if (year?.value) {
      getHorizonDDL(
        profileData?.accountId,
        selectedBusinessUnit?.value,
        plant?.value,
        year?.value,
        setHorizonDDL
      );
    }

    getRegionDDL(
      `/oms/TerritoryInfo/GetTerrotoryRegionAreaByChannel?channelId=${channel?.value ||
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

    getAreaDDL(
      `/oms/TerritoryInfo/GetTerrotoryRegionAreaByChannel?channelId=${channel?.value ||
        0}&regionId=${region?.value || 0}`,
      (res) => {
        const newDDL = res?.map((item) => ({
          ...item,
          value: item?.areaId,
          label: item?.areaName,
        }));
        setAreaDDL(newDDL);
      }
    );

    getTerritoryDDL(
      `/oms/TerritoryInfo/GetTerrotoryRegionAreaByChannel?channelId=${channel?.value ||
        0}&regionId=${region?.value || 0}&areaId=${area?.value || 0}`,
      (res) => {
        const newDDL = res?.map((item) => ({
          ...item,
          value: item?.territoryId,
          label: item?.territoryName,
        }));
        setTerritoryDDL(newDDL);
      }
    );

    getGridData(
      `mes/SalesPlanning/SalesPlanningLandingPagination?AccountId=${
        profileData?.accountId
      }&BusinessUnitId=${selectedBusinessUnit?.value}&PlantId=${plant?.value ||
        0}&IntPlanningHorizonId=${
        year?.planningHorizonId
      }&IntPlanningHorizonRowId=${horizon?.value ||
        0}&DistributionChannelId=${channel?.value ||
        0}&RegoinId=${region?.value || 0}&AreaId=${area?.value ||
        0}&TeritoryId=${territory?.value ||
        0}&PageNo=${pageNo}&PageSize=${pageSize}&ViewOrder=desc`
    );

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    profileData,
    selectedBusinessUnit,
    localStorage?.salesAndProductionTableLanding,
  ]);

  const setPositionHandler = (pageNo, pageSize, searchValue) => {
    getGridData(
      `mes/SalesPlanning/SalesPlanningLandingPagination?AccountId=${
        profileData?.accountId
      }&BusinessUnitId=${selectedBusinessUnit?.value}&PlantId=${plant?.value ||
        0}&IntPlanningHorizonId=${
        year?.planningHorizonId
      }&IntPlanningHorizonRowId=${horizon?.value ||
        0}&DistributionChannelId=${channel?.value ||
        0}&RegoinId=${region?.value || 0}&AreaId=${area?.value ||
        0}&TeritoryId=${territory?.value ||
        0}&PageNo=${pageNo}&PageSize=${pageSize}&ViewOrder=desc`
    );
  };

  return (
    <Formik
      enableReinitialize={true}
      initialValues={localStorage?.salesAndProductionTableLanding}
      // validationSchema={{}}
      onSubmit={(values, { setSubmitting, resetForm }) => {
        console.log(values);
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
            title="Sales Plan"
            isHiddenReset
            isHiddenBack
            isHiddenSave
            renderProps={() => {
              return (
                <div>
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={() => {
                      history.push(
                        "/production-management/salesAndOperationsPlanning/salesAndProductionPlan/Create"
                      );
                    }}
                  >
                    Create
                  </button>
                </div>
              );
            }}
          >
            <Form>
              <div className="global-form p-2">
                <div className="form-group row">
                  <div className="col-lg-3">
                    <NewSelect
                      name="plant"
                      options={plantDDL}
                      value={values?.plant}
                      label="Plant"
                      placeholder="Plant"
                      onChange={(valueOption) => {
                        setFieldValue("plant", valueOption);
                        setFieldValue("year", "");
                        setFieldValue("horizon", "");
                        getYearDDL(
                          profileData?.accountId,
                          selectedBusinessUnit?.value,
                          valueOption?.value || 0,
                          setYearDDL
                        );
                        if (values?.year?.value) {
                          getHorizonDDL(
                            profileData?.accountId,
                            selectedBusinessUnit?.value,
                            valueOption?.value,
                            values?.year?.value,
                            setHorizonDDL
                          );
                        }
                      }}
                      errors={errors}
                      touched={touched}
                    />
                  </div>
                  <div className="col-lg-3">
                    <NewSelect
                      name="year"
                      options={yearDDL}
                      value={values?.year}
                      label="Year"
                      placeholder="Year"
                      onChange={(valueOption) => {
                        if (valueOption) {
                          setFieldValue("year", valueOption);
                          setFieldValue("horizon", "");
                          getHorizonDDL(
                            profileData?.accountId,
                            selectedBusinessUnit?.value,
                            values?.plant?.value,
                            valueOption?.value,
                            setHorizonDDL
                          );
                        } else {
                          setFieldValue("year", "");
                          setFieldValue("horizon", "");
                          getHorizonDDL(
                            profileData?.accountId,
                            selectedBusinessUnit?.value,
                            values?.plant?.value,
                            valueOption?.value,
                            setHorizonDDL
                          );
                        }
                      }}
                      errors={errors}
                      touched={touched}
                    />
                  </div>
                  <div className="col-lg-3">
                    <NewSelect
                      name="horizon"
                      options={horizonDDL}
                      value={values?.horizon}
                      label="Planning Horizon"
                      placeholder="Planning Horizon"
                      onChange={(valueOption) => {
                        setFieldValue("horizon", valueOption);
                      }}
                      errors={errors}
                      touched={touched}
                    />
                  </div>
                  <div className="col-lg-3">
                    <NewSelect
                      name="channel"
                      options={
                        Array.isArray(channelDDL)
                          ? [{ value: 0, label: "All" }, ...channelDDL]
                          : channelDDL
                      }
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
                      options={
                        Array.isArray(regionDDL)
                          ? [{ value: 0, label: "All" }, ...regionDDL]
                          : regionDDL
                      }
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
                      options={
                        Array.isArray(areaDDL)
                          ? [{ value: 0, label: "All" }, ...areaDDL]
                          : areaDDL
                      }
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
                  <div style={{ marginTop: "17px" }}>
                    <button
                      type="button"
                      disabled={
                        !values?.plant || !values?.year || !values?.horizon
                      }
                      onClick={() => {
                        dispatch(
                          SetSalesAndProductionTableLandingAction(values)
                        );
                      }}
                      className="btn btn-primary"
                    >
                      View
                    </button>
                  </div>
                </div>
              </div>

              {gridData?.data?.length > 0 && (
                <>
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
                          <th>Production Plan Quantity</th>
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
                            <td>{item?.planQTY}</td>
                            <td>{item?.productionPlanQTY}</td>
                            <td>
                              <div className="d-flex justify-content-around">
                                {/* Edit */}
                                <span
                                  onClick={() =>
                                    history.push(
                                      `/production-management/salesAndOperationsPlanning/salesAndProductionPlan/edit/${item?.salesPlanId}`
                                    )
                                  }
                                >
                                  <IEdit />
                                </span>

                                {/* Extend */}
                                <span
                                  className="extend"
                                  onClick={() => {
                                    history.push(
                                      `/production-management/salesAndOperationsPlanning/salesAndProductionPlan/${plant.value}/${item?.salesPlanId}/createPP`
                                    );
                                  }}
                                >
                                  <OverlayTrigger
                                    overlay={
                                      <Tooltip id="cs-icon">
                                        {"Create Production Plan"}
                                      </Tooltip>
                                    }
                                  >
                                    <span>
                                      <i className={`fa fa-arrows-alt`}></i>
                                    </span>
                                  </OverlayTrigger>
                                </span>

                                {/* View */}
                                <span
                                  onClick={() =>
                                    history.push(
                                      `/production-management/salesAndOperationsPlanning/salesAndProductionPlan/view/${item?.salesPlanId}`
                                    )
                                  }
                                >
                                  <span>
                                    <i className={`fa fa-eye`}></i>
                                  </span>
                                </span>

                                {/* version */}
                                <span
                                  onClick={() => {
                                    setVersionModalShow(true);
                                    setVersionModalData(item);
                                  }}
                                >
                                  <OverlayTrigger
                                    overlay={
                                      <Tooltip id="cs-icon">
                                        {"Log Version"}
                                      </Tooltip>
                                    }
                                  >
                                    <span>
                                      <i className={`fa fa-history`}></i>
                                    </span>
                                  </OverlayTrigger>
                                </span>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </>
                  </table>
                  <PaginationTable
                    count={gridData?.totalCount}
                    setPositionHandler={setPositionHandler}
                    paginationState={{
                      pageNo,
                      setPageNo,
                      pageSize,
                      setPageSize,
                    }}
                  />
                </>
              )}

              <IViewModal
                show={versionModalShow}
                onHide={() => setVersionModalShow(false)}
              >
                <VersionModal
                  setVersionModalShow={setVersionModalShow}
                  versionModalData={versionModalData}
                  setVersionModalData={setVersionModalData}
                />
              </IViewModal>
            </Form>
          </IForm>
        </>
      )}
    </Formik>
  );
};

export default SalesAndProductionTable;
