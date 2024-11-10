import { Form, Formik } from "formik";
import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import IForm from "./../../../_helper/_form";
import Loading from "./../../../_helper/_loading";
import useAxiosGet from "../../../_helper/customHooks/useAxiosGet";
import { shallowEqual, useSelector } from "react-redux";
import IView from "../../../_helper/_helperIcons/_view";
import PaginationTable from "../../../_helper/_tablePagination";
import IViewModal from "../../../_helper/_viewModal";
import DetailsDistributionView from "./detailsView";
import IEdit from "../../../_helper/_helperIcons/_edit";
import NewSelect from "../../../_helper/_select";
import DistributionPlantEditModal from "./distributionPlantEditModal";

const initData = {};

export default function DistributionPlanLanding() {
  const history = useHistory();
  const [pageNo, setPageNo] = useState(0);
  const [pageSize, setPageSize] = useState(300);
  const [isShowModel, setIsShowModel] = useState(false);
  const [detailsView, setDetailsView] = useState([]);
  const [rowDto, getRowDto, rowDtoLoading, setRowDto] = useAxiosGet();
  const [channelDDL, getChannelDDL, channelDDLloader] = useAxiosGet();
  const [
    regionDDL,
    getRegionDDL,
    regionDDLloader,
    setRegionDDL,
  ] = useAxiosGet();
  const [areaDDL, getAreaDDL, areaDDLloader, setAreaDDl] = useAxiosGet();
  const [
    territoryDDL,
    getTerritoryDDL,
    territoryDDLloader,
    setTerritoryDDL,
  ] = useAxiosGet();
  const [plantDDL, getPlantDDL, plantDDLloader] = useAxiosGet();
  const [warehouseDDL, getWarehouseDDL, warehouseDDLloader] = useAxiosGet();
  const [yearDDL, getYearDDL, yearDDLloader] = useAxiosGet();
  const [horizonDDL, getHorizonDDL, horizonDDLloader] = useAxiosGet();

  // get user data from store
  const {
    selectedBusinessUnit: { value: buId },
    profileData: { accountId, userId },
  } = useSelector((state) => state?.authData, shallowEqual);

  const saveHandler = (values, cb) => {};

  const setPositionHandler = (pageNo, pageSize, values) => {
    getRowDto(
      // `/oms/DistributionChannel/GetDistributionPlanningLanding?buisnessUnitId=${buId}&pageNo=${pageNo}&pageSize=${pageSize}`
      `/oms/DistributionChannel/GetDistributionPlanningLanding?buisnessUnitId=${buId}&plantId=${values
        ?.plant?.value || 0}&yearId=${values?.year?.value}&monthId=${
        values?.horizon?.monthId
      }&warehosueId=${values?.warehouse?.value || 0}&channelId=${values?.channel
        ?.value || 0}&regionId=${values?.region?.value || 0}&areaId=${values
        ?.area?.value || 0}&territoryId=${values?.territory?.value ||
        0}&pageNo=${pageNo}&pageSize=${pageSize}`
    );
  };

  // get landing data on mount
  useEffect(() => {
    getPlantDDL(
      `/wms/BusinessUnitPlant/GetOrganizationalUnitUserPermission?UserId=${userId}&AccId=${accountId}&BusinessUnitId=${buId}&OrgUnitTypeId=7`
    );

    getChannelDDL(
      `/oms/DistributionChannel/GetDistributionChannelDDL?AccountId=${accountId}&BUnitId=${buId}`
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [buId]);

  const getRegionDDLHandler = (valueOption) => {
    if (valueOption?.label) {
      getRegionDDL(
        `/oms/TerritoryInfo/GetTerrotoryRegionAreaByChannel?channelId=${valueOption?.value}`,
        (res) => {
          const newDDL = res?.map((item) => ({
            ...item,
            value: item?.regionId,
            label: item?.regionName,
          }));
          setRegionDDL(newDDL);
        }
      );
    }
  };

  // get areaDDLHandler api handler
  const getAreaDDLHandler = (values, valueOption) => {
    if (valueOption?.label) {
      getAreaDDL(
        `/oms/TerritoryInfo/GetTerrotoryRegionAreaByChannel?channelId=${values?.channel?.value}&regionId=${valueOption?.value}`,
        (res) => {
          const newDDL = res?.map((item) => ({
            ...item,
            value: item?.areaId,
            label: item?.areaName,
          }));
          setAreaDDl(newDDL);
        }
      );
    }
  };

  // get territoryDDL api handler
  const getTerritoryDDLHandler = (values, valueOption) => {
    if (valueOption?.label) {
      getTerritoryDDL(
        `/oms/TerritoryInfo/GetTerrotoryRegionAreaByChannel?channelId=${values?.channel?.value}&regionId=${values?.region?.value}&areaId=${valueOption?.value}`,
        (res) => {
          const newDDL = res?.map((item) => ({
            ...item,
            value: item?.territoryId,
            label: item?.territoryName,
          }));
          setTerritoryDDL(newDDL);
        }
      );
    }
  };

  // get warehouseDDL api handler
  const getWarehouseDDLHandler = (plantId) => {
    if (plantId) {
      getWarehouseDDL(
        `/wms/BusinessUnitPlant/GetOrganizationalUnitUserPermissionforWearhouse?UserId=${userId}&AccId=${accountId}&BusinessUnitId=${buId}&PlantId=${plantId}&OrgUnitTypeId=8`
      );
    }
  };

  // get yearDDL api handler
  const getYearDDLHandler = (plantId) => {
    if (plantId) {
      getYearDDL(
        `/mes/MesDDL/GetYearDDL?AccountId=${accountId}&BusinessUnitId=${buId}&PlantId=${plantId}`
      );
    }
  };
  // get horizonDDL api handler
  const getHorizonDDLHandler = (plantId, yearId) => {
    if (plantId && yearId) {
      getHorizonDDL(
        `/mes/MesDDL/GetPlanningHorizonDDL?AccountId=${accountId}&BusinessUnitId=${buId}&PlantId=${plantId}&YearId=${yearId}`
      );
    }
  };

  const [isEditModal, setIsEditModal] = useState(false);
  const [editData, setEditData] = useState(null);

  return (
    <Formik
      enableReinitialize={true}
      initialValues={{}}
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
          {(rowDtoLoading ||
            channelDDLloader ||
            regionDDLloader ||
            areaDDLloader ||
            plantDDLloader ||
            warehouseDDLloader ||
            yearDDLloader ||
            territoryDDLloader ||
            horizonDDLloader) && <Loading />}
          <IForm
            title="Distribution Plan"
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
                        "/internal-control/budget/DistributionPlanning/create"
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
              <div className="global-form">
                <div className="row">
                  <div className="col-lg-3">
                    <NewSelect
                      name="channel"
                      options={channelDDL || []}
                      value={values?.channel}
                      label="Distribution Channel"
                      onChange={(valueOption) => {
                        setFieldValue("channel", valueOption);
                        setFieldValue("region", "");
                        setFieldValue("area", "");
                        setFieldValue("territory", "");
                        getRegionDDLHandler(valueOption);
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
                        setFieldValue("region", valueOption);
                        setFieldValue("area", "");
                        setFieldValue("territory", "");
                        getAreaDDLHandler(values, valueOption);
                      }}
                      placeholder="Select Region"
                      errors={errors}
                      touched={touched}
                      isDisabled={!values?.channel}
                    />
                  </div>
                  <div className="col-lg-3">
                    <NewSelect
                      name="area"
                      options={areaDDL || []}
                      value={values?.area}
                      label="Area"
                      onChange={(valueOption) => {
                        setFieldValue("area", valueOption);
                        setFieldValue("territory", "");
                        getTerritoryDDLHandler(values, valueOption);
                      }}
                      placeholder="Select Area"
                      errors={errors}
                      touched={touched}
                      isDisabled={!values?.region}
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
                      placeholder="Select Territory"
                      errors={errors}
                      touched={touched}
                      isDisabled={!values?.area}
                    />
                  </div>
                  <div className="col-lg-3">
                    <NewSelect
                      name="plant"
                      options={plantDDL || []}
                      value={values?.plant}
                      label="Plant"
                      onChange={(valueOption) => {
                        setRowDto([]);
                        setFieldValue("plant", valueOption);
                        setFieldValue("warehouse", "");
                        setFieldValue("year", "");
                        setFieldValue("horizon", "");
                        getWarehouseDDLHandler(valueOption?.value);
                        getYearDDLHandler(valueOption?.value);
                      }}
                      placeholder="Select plant"
                      errors={errors}
                      touched={touched}
                    />
                  </div>
                  {/* <div className="col-lg-3">
                    <NewSelect
                      name="warehouse"
                      options={warehouseDDL || []}
                      value={values?.warehouse}
                      label="Warehouse"
                      onChange={(valueOption) => {
                        setRowDto({});
                        setFieldValue("warehouse", valueOption);
                      }}
                      placeholder="Select Warehouse"
                      errors={errors}
                      touched={touched}
                      isDisabled={!values?.plant}
                    />
                  </div> */}
                  <div className="col-lg-3">
                    <NewSelect
                      name="year"
                      options={yearDDL || []}
                      value={values?.year}
                      label="Year"
                      onChange={(valueOption) => {
                        setRowDto({});
                        setFieldValue("year", valueOption);
                        setFieldValue("horizon", "");
                        getHorizonDDLHandler(
                          values.plant?.value,
                          valueOption?.value
                        );
                      }}
                      placeholder="Select year"
                      errors={errors}
                      touched={touched}
                      isDisabled={!values?.plant}
                    />
                  </div>
                  <div className="col-lg-3">
                    <NewSelect
                      name="horizon"
                      options={horizonDDL || []}
                      value={values?.horizon}
                      label="Planning Horizon"
                      onChange={(valueOption) => {
                        setRowDto({});
                        setFieldValue("horizon", valueOption);
                        setFieldValue(
                          "fromDate",
                          valueOption?.startdatetime || ""
                        );
                        setFieldValue("toDate", valueOption?.enddatetime || "");
                      }}
                      placeholder="Select horizon"
                      errors={errors}
                      touched={touched}
                      isDisabled={!values?.year}
                    />
                  </div>

                  <div className="col-lg-1">
                    <button
                      type="button"
                      className="btn btn-primary"
                      style={{ marginTop: "18px" }}
                      disabled={
                        !values?.plant || !values?.year || !values?.horizon
                      }
                      onClick={() => {
                        getRowDto(
                          `/oms/DistributionChannel/GetDistributionPlanningLanding?buisnessUnitId=${buId}&plantId=${values
                            ?.plant?.value || 0}&yearId=${
                            values?.year?.value
                          }&monthId=${
                            values?.horizon?.monthId
                          }&warehosueId=${values?.warehouse?.value ||
                            0}&channelId=${values?.channel?.value ||
                            0}&regionId=${values?.region?.value ||
                            0}&areaId=${values?.area?.value ||
                            0}&territoryId=${values?.territory?.value ||
                            0}&pageNo=${pageNo}&pageSize=${pageSize}`
                        );
                      }}
                    >
                      View
                    </button>
                  </div>
                </div>
              </div>
              <div className="row">
                <div className="col-lg-12">
                  <div className="table-responsive">
                    <table className="table table-striped table-bordered mt-3 bj-table bj-table-landing">
                      <thead>
                        <tr>
                          <th>SL</th>
                          <th>Distribution Channel Name</th>
                          <th>Region Name</th>
                          <th>Area Name</th>
                          <th>Territory Name</th>
                          <th>Sales Plan Qty</th>
                          <th>Distribution Plan Qty</th>
                          {/* <th>Plant</th> */}
                          {/* <th>Warehouse</th> */}
                          <th>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {rowDto?.data?.length > 0 &&
                          rowDto?.data?.map((item, index) => (
                            <tr key={index}>
                              <td>{item?.sl}</td>
                              <td>{item?.distributionChannelName}</td>
                              <td>{item?.regionName}</td>
                              <td>{item?.areaName}</td>
                              <td>{item?.territoryName}</td>
                              <td className="text-center">
                                {item?.salesPlanQty}
                              </td>
                              <td className="text-center">
                                {item?.distributionPlanQty}
                              </td>
                              {/* <td>{item?.plantHouseName}</td> */}
                              {/* <td>{item?.wareHouseName}</td> */}
                              <td className="text-center">
                                <div
                                  style={{
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "space-around",
                                  }}
                                >
                                  <IView
                                    styles={{ fontSize: "16px" }}
                                    clickHandler={(e) => {
                                      setDetailsView(item);
                                      setIsShowModel(true);
                                    }}
                                  />
                                  <IEdit
                                    onClick={() => {
                                      setIsEditModal(true);
                                      setEditData(item);
                                    }}
                                  />
                                </div>
                              </td>
                            </tr>
                          ))}
                      </tbody>
                    </table>
                  </div>

                  {rowDto?.data?.length > 0 && (
                    <PaginationTable
                      count={rowDto?.totalCount}
                      setPositionHandler={setPositionHandler}
                      paginationState={{
                        pageNo,
                        setPageNo,
                        pageSize,
                        setPageSize,
                      }}
                      values={values}
                    />
                  )}
                </div>
              </div>
            </Form>
          </IForm>
          <IViewModal
            title="Distribution details view"
            modelSize="xl"
            show={isShowModel}
            onHide={() => {
              setIsShowModel(false);
            }}
          >
            <DetailsDistributionView singleData={detailsView} />
          </IViewModal>
          <IViewModal
            title="Distribution Plan Edit"
            modelSize="xl"
            show={isEditModal}
            onHide={() => {
              setIsEditModal(false);
            }}
          >
            <DistributionPlantEditModal
              editData={editData}
              landingValues={values}
              setIsEditModal={setIsEditModal}
            />
          </IViewModal>
        </>
      )}
    </Formik>
  );
}
