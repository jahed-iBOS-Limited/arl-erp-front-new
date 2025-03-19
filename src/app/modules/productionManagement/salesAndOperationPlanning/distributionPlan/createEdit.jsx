import { Form, Formik } from "formik";
import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import Loading from "../../../_helper/_loading";
import IForm from "../../../_helper/_form";
import NewSelect from "../../../_helper/_select";
import { shallowEqual, useSelector } from "react-redux";
import useAxiosGet from "../../../_helper/customHooks/useAxiosGet";
import useAxiosPost from "../../../_helper/customHooks/useAxiosPost";
import { toast } from "react-toastify";
import EntryTable from "./entryTable";
// import ViewTable from "./viewTable";
import { modifyRowDto, saveHandler, validationSchema } from "./helper";

const initData = {
  channel: "",
  region: "",
  area: "",
  territory: "",
  fromDate: "",
  toDate: "",
  plant: "",
  warehouse: "",
  year: "",
  horizon: "",
};

export default function DistributionPlanCreateEdit() {
  const location = useLocation();
  const [objProps, setObjprops] = useState({});
  const [channelDDL, getChannelDDL, channelLoading] = useAxiosGet();
  const [plantDDL, getPlantDDL, plantLoading] = useAxiosGet();
  const [warehouseDDL, getWarehouseDDL, warehouseLoading] = useAxiosGet();
  const [yearDDL, getYearDDL, yearLoading] = useAxiosGet();
  const [horizonDDL, getHorizonDDL, horizonLoading] = useAxiosGet();
  const [regionDDL, getRegionDDL, regionLoading, setRegionDDL] = useAxiosGet();
  const [areaDDL, getAreaDDL, areaLoading, setAreaDDl] = useAxiosGet();

  const [
    territoryDDL,
    getTerritoryDDL,
    territoryLoading,
    setTerritoryDDL,
  ] = useAxiosGet();
  const [tableData, setTableData] = useState({});
  const [, getRowDto, rowDtoLoading, setRowDto] = useAxiosGet();
  const [, saveDistributionPlan, saveDistributionLoading] = useAxiosPost();

  // get user data from redux store
  const {
    profileData: { accountId: accId, userId },
    selectedBusinessUnit: { value: buId },
  } = useSelector((state) => state?.authData, shallowEqual);

  // get regionDDL api handler
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
        `/wms/BusinessUnitPlant/GetOrganizationalUnitUserPermissionforWearhouse?UserId=${userId}&AccId=${accId}&BusinessUnitId=${buId}&PlantId=${plantId}&OrgUnitTypeId=8`
      );
    }
  };

  // get yearDDL api handler
  const getYearDDLHandler = (plantId) => {
    if (plantId) {
      getYearDDL(
        `/mes/MesDDL/GetYearDDL?AccountId=${accId}&BusinessUnitId=${buId}&PlantId=${plantId}`
      );
    }
  };
  // get horizonDDL api handler
  const getHorizonDDLHandler = (plantId, yearId) => {
    if (plantId && yearId) {
      getHorizonDDL(
        `/mes/MesDDL/GetPlanningHorizonDDL?AccountId=${accId}&BusinessUnitId=${buId}&PlantId=${plantId}&YearId=${yearId}`
      );
    }
  };

  useEffect(() => {
    getPlantDDL(
      `/wms/BusinessUnitPlant/GetOrganizationalUnitUserPermission?UserId=${userId}&AccId=${accId}&BusinessUnitId=${buId}&OrgUnitTypeId=7`
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId, accId, buId]);

  useEffect(() => {
    getChannelDDL(
      `/oms/DistributionChannel/GetDistributionChannelDDL?AccountId=${accId}&BUnitId=${buId}`
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [accId, buId]);

  const handleWarehouseChange = (values, valueOption, setFieldValue) => {
    if (valueOption) {
      const isExist = tableData?.itemList?.find(
        (item) => item?.intWareHouseId === valueOption?.value
      );
      if (isExist) {
        return toast.warn("Already Exist this entry!");
      } else {
        setFieldValue("warehouse", valueOption);
        getRowDto(
          `/oms/DistributionChannel/GetDistributionPlanningItemList?buisnessUnitId=${buId}&territoryid=${values?.territory?.value}&plantId=${values?.plant?.value}&warehouseId=${valueOption?.value}&year=${values?.year?.value}&month=${values?.horizon?.monthId}`,
          (res) => {
            try {
              const isExistWareHouse = tableData?.itemList?.find(
                (item) => item?.intWareHouseId === valueOption?.value
              );

              if (isExistWareHouse) {
                return toast.warn("already exists");
              } else {
                const modifyResForWarehouse = res?.itemList?.map((item) => {
                  return {
                    ...item,
                    intWareHouseId: valueOption?.value,
                    strWareHouseName: valueOption?.label,
                    intPlantHouseId: values?.plant?.value,
                    strPlantHouseName: values?.plant?.label,
                    intRestQty: +item?.salesPlanQty || 0,
                    salesPlanQty: +item?.salesPlanQty || 0,
                  };
                });
                const currentItemList = [
                  ...(tableData?.itemList || []),
                  ...modifyResForWarehouse,
                ];
                const modifyItemList = modifyRowDto(currentItemList);
                setTableData({
                  ...tableData,
                  itemList: modifyItemList,
                });
              }
            } catch (error) {
              console.log(error);
            }
            // const modifyResForWarehouse = res?.itemList?.map((item) => {
            //   const restQty = rowDto?.itemList?.filter(
            //     (itm) => itm?.itemId === item?.itemId
            //   );
            //   return {
            //     ...item,
            //     intWareHouseId: valueOption?.value,
            //     strWareHouseName: valueOption?.label,
            //     intPlantHouseId: values?.plant?.value,
            //     strPlantHouseName: values?.plant?.label,
            //     intRestQty: +item?.salesPlanQty - (+item?.planQty || 0),
            //     salesPlanQty:
            //       restQty?.length > 0
            //         ? restQty[restQty?.length - 1]?.intRestQty || 0
            //         : item?.salesPlanQty,
            //   };
            // });
            // const newResData = [...modifyResForWarehouse];
            // setRowDto({
            //   ...rowDto,
            //   itemList: rowDto?.itemList?.length
            //     ? [...rowDto?.itemList, ...newResData]
            //     : [...newResData],
            // });
            // if (res?.response === "Already Exists") {
            //   toast.warn("Already Exist this entry!");
            // }
          }
        );
      }
    } else {
      setFieldValue("warehouse", "");
    }
  };

  return (
    <Formik
      enableReinitialize={true}
      initialValues={initData}
      validationSchema={validationSchema}
      onSubmit={(values, { setSubmitting, resetForm }) => {
        saveHandler({
          values,
          tableData,
          buId,
          userId,
          location,
          saveDistributionPlan,
          cb: () => {
            // setRowDto({});
          },
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
            saveDistributionLoading ||
            plantLoading ||
            channelLoading ||
            territoryLoading ||
            areaLoading ||
            regionLoading ||
            warehouseLoading ||
            yearLoading ||
            horizonLoading) && <Loading />}
          <IForm
            title={"Distribution Plan Create"}
            getProps={setObjprops}
            isHiddenSave={tableData?.response === "Already Exists"}
            isHiddenReset
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
                        setFieldValue("warehouse", "");
                        getRegionDDLHandler(valueOption);
                        setTableData({});
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
                        setFieldValue("warehouse", "");
                        getAreaDDLHandler(values, valueOption);
                        setTableData({});
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
                        setFieldValue("warehouse", "");
                        getTerritoryDDLHandler(values, valueOption);
                        setTableData({});
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
                        setFieldValue("warehouse", "");
                        setRowDto({});
                        setTableData({});
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
                        setRowDto({});
                        setTableData({});
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
                      isDisabled={!values?.territory}
                    />
                  </div>

                  <div className="col-lg-3">
                    <NewSelect
                      name="year"
                      options={yearDDL || []}
                      value={values?.year}
                      label="Year"
                      onChange={(valueOption) => {
                        setRowDto({});
                        setTableData({});
                        setFieldValue("year", valueOption);
                        setFieldValue("horizon", "");
                        setFieldValue("warehouse", "");
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
                        setTableData({});
                        setFieldValue("warehouse", "");
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
                </div>
              </div>
              <div className="global-form row">
                <div className="col-lg-3">
                  <NewSelect
                    name="warehouse"
                    options={warehouseDDL || []}
                    value={values?.warehouse}
                    label="Warehouse"
                    onChange={(valueOption) => {
                      handleWarehouseChange(values, valueOption, setFieldValue);
                    }}
                    placeholder="Select Warehouse"
                    errors={errors}
                    touched={touched}
                    isDisabled={
                      !values?.territory ||
                      !values?.plant ||
                      !values?.year ||
                      !values?.horizon
                    }
                  />
                </div>
              </div>

              <div className="row">
                <div className="col-lg-12">
                  <EntryTable
                    tableData={tableData}
                    setTableData={setTableData}
                  />
                </div>
              </div>

              <button
                type="submit"
                style={{ display: "none" }}
                ref={objProps?.btnRef}
                onSubmit={() => handleSubmit()}
              ></button>

              <button
                type="reset"
                style={{ display: "none" }}
                ref={objProps?.resetBtnRef}
                onSubmit={() => {}}
              ></button>
            </Form>
          </IForm>
        </>
      )}
    </Formik>
  );
}
