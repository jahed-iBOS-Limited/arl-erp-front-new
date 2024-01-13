/* eslint-disable react-hooks/exhaustive-deps */
import { Form, Formik } from "formik";
import React, { useEffect, useState } from "react";
import { shallowEqual, useSelector } from "react-redux";
import IForm from "../../../_helper/_form";
import Loading from "../../../_helper/_loading";
import NewSelect from "../../../_helper/_select";
import useAxiosGet from "../../../_helper/customHooks/useAxiosGet";
import MROItemPlanningTable from "./table";
import PowerBIReport from "../../../_helper/commonInputFieldsGroups/PowerBIReport";
const initData = {
  plant: "",
  wareHouse: "",
  itemType: "",
  itemCategory: "",
  itemSubCategory: "",
  category: "",
  item: "",
};
export default function MROItemReports() {
  const [rowData, getRowData, loader] = useAxiosGet();
  const [plantDDL, getPlanDDL] = useAxiosGet();
  const [wareHouseDDL, getWareHouseDDL] = useAxiosGet();
  const [itemCategoryDDL, getItemCategoryDDL] = useAxiosGet();
  const [itemSubCategoryDDL, getItemSubCategoryDDL] = useAxiosGet();
  const [itemDDL, getItemDDL] = useAxiosGet();
  const [showReport, setShowReport] = useState(false);

  const {
    profileData: { accountId: accId, userId },
    selectedBusinessUnit: { value: buId },
  } = useSelector((state) => state?.authData, shallowEqual);

  const groupId = `e3ce45bb-e65e-43d7-9ad1-4aa4b958b29a`;
  const reportId = `4fa3fd37-58a0-4840-892f-5848f5bf4840`;

  const parameterValues = (values) => {
    return [
      { name: "unitid", value: `${+buId}` },
      { name: "itemcategoryid", value: `${+values?.category?.value}` },
      { name: "itemname", value: `${+values?.item?.value || ""}` },
      { name: "ViewType", value: `${+values?.viewType?.value}` },
    ];
  };

  const getLandingApiCall = (values, searchValue = "") => {
    getRowData(
      `/wms/ItemPlantWarehouse/MroItemNextMonthRequiredQty?partId=1&businessUnitId=${buId}&plantId=${values?.plant?.value}&warehouseId=${values?.wareHouse?.value}&categoryId=${values?.itemCategory?.value}&subCategoryId=${values?.itemSubCategory?.value}&search=${searchValue}`
    );
  };

  const paginationSearchHandler = (searchValue, values) => {
    getLandingApiCall(values, searchValue);
  };

  useEffect(() => {
    getPlanDDL(
      `/wms/BusinessUnitPlant/GetOrganizationalUnitUserPermission?UserId=${userId}&AccId=${accId}&BusinessUnitId=${buId}&OrgUnitTypeId=${7}`
    );
  }, [userId, accId, buId]);

  const getItemCategoryList = (reportNameId) => {
    const urlForPlanning = `/wms/WmsReport/GetItemCategoryListDDL?AccountId=${accId}&BusinessUnitId=${buId}&ItemTypeId=${7}`;
    // ItemTypeId 7 = Maintenance Repair and Operating Supplies

    // const urlForPrediction = `/item/ItemCategoryGL/GetItemCategoryDDLForConfig?AccountId=${accId}&BusinessUnitId=${buId}`;

    // const URL =
    //   reportNameId === 1
    //     ? urlForPlanning
    //     : reportNameId === 2
    //     ? urlForPrediction
    //     : "";
    getItemCategoryDDL(urlForPlanning);
  };

  const btnDisableHandler = (values) => {
    const reportNameId = values?.reportName?.value;
    const viewTypeId = values?.viewType?.value;
    if (reportNameId === 1) {
      return !values?.plant || !values?.wareHouse || !values?.itemSubCategory;
    }
    if (reportNameId === 2) {
      if (viewTypeId === 1) {
        return !values?.item;
      }
      if (viewTypeId === 2) {
        return !values?.category;
      }
    }
  };

  return (
    <Formik
      enableReinitialize={true}
      initialValues={initData}
      onSubmit={() => {}}
    >
      {({ values, setFieldValue, errors, touched }) => (
        <>
          {loader && <Loading />}
          <IForm
            title="MRO Item Reports"
            isHiddenReset
            isHiddenBack
            isHiddenSave
            renderProps={() => {}}
          >
            <Form>
              <div className="row global-form">
                <div className="col-lg-3 ">
                  <NewSelect
                    name="reportName"
                    options={[
                      { label: "MRO Item Planning", value: 1 },
                      { label: "MRO Item Prediction", value: 2 },
                    ]}
                    value={values?.reportName}
                    label="Report Name"
                    onChange={(valueOption) => {
                      setFieldValue("reportName", valueOption);
                      getItemCategoryList(valueOption?.value);
                      setShowReport(false);
                    }}
                    placeholder="Report Name"
                    errors={errors}
                    touched={touched}
                  />
                </div>
                {values?.reportName?.value === 1 && (
                  <>
                    <div className="col-lg-3 ">
                      <NewSelect
                        name="plant"
                        options={
                          [{ label: "All", value: 0 }, ...plantDDL] || []
                        }
                        value={values?.plant}
                        label="Plant"
                        onChange={(valueOption) => {
                          setFieldValue("plant", valueOption);
                          setFieldValue("wareHouse", "");
                          if (!valueOption) return;
                          getWareHouseDDL(
                            `/wms/BusinessUnitPlant/GetOrganizationalUnitUserPermissionforWearhouse?UserId=${userId}&AccId=${accId}&BusinessUnitId=${buId}&PlantId=${valueOption?.value}&OrgUnitTypeId=8`
                          );
                        }}
                        placeholder="Plant"
                        errors={errors}
                        touched={touched}
                      />
                    </div>
                    <div className="col-lg-3 ">
                      <NewSelect
                        name="wareHouse"
                        options={
                          [{ label: "All", value: 0 }, ...wareHouseDDL] || []
                        }
                        value={values?.wareHouse}
                        label="WareHouse"
                        onChange={(valueOption) => {
                          setFieldValue("wareHouse", valueOption);
                          setFieldValue("itemType", "");
                          if (!valueOption) return;
                        }}
                        placeholder="WareHouse"
                        disabled={!values?.plant}
                        errors={errors}
                        touched={touched}
                      />
                    </div>

                    <div className="col-lg-3 ">
                      <NewSelect
                        name="itemCategory"
                        options={itemCategoryDDL || []}
                        value={values?.itemCategory}
                        label="Item Category"
                        onChange={(valueOption) => {
                          setFieldValue("itemCategory", valueOption);
                          setFieldValue("itemSubCategory", "");
                          if (!valueOption) return;
                          getItemSubCategoryDDL(
                            `/wms/WmsReport/GetItemSubCategoryListDDL?AccountId=${accId}&BusinessUnitId=${buId}&ItemCategoryId=${valueOption?.value}`
                          );
                        }}
                        placeholder="Item Type"
                        errors={errors}
                        touched={touched}
                      />
                    </div>
                    <div className="col-lg-3 ">
                      <NewSelect
                        name="itemSubCategory"
                        options={itemSubCategoryDDL || []}
                        value={values?.itemSubCategory}
                        label="Item Sub-Category"
                        onChange={(valueOption) => {
                          setFieldValue("itemSubCategory", valueOption);
                        }}
                        placeholder="Item Type"
                        errors={errors}
                        touched={touched}
                        isDisable={!values?.itemCategory}
                      />
                    </div>
                  </>
                )}
                {values?.reportName?.value === 2 && (
                  <>
                    <div className="col-lg-3 ">
                      <NewSelect
                        name="viewType"
                        options={[
                          { label: "Item Base", value: 1 },
                          { label: "Item Category Base ", value: 2 },
                        ]}
                        value={values?.viewType}
                        label="View Type"
                        onChange={(valueOption) => {
                          setFieldValue("viewType", valueOption);
                          setShowReport(false);
                        }}
                        placeholder="View Type"
                        errors={errors}
                        touched={touched}
                      />
                    </div>
                    <div className="col-lg-3 ">
                      <NewSelect
                        name="category"
                        options={itemCategoryDDL || []}
                        value={values?.category}
                        label="Item Category"
                        onChange={(valueOption) => {
                          setFieldValue("category", valueOption);
                          setFieldValue("item", "");
                          setShowReport(false);
                          if (!valueOption) return;
                          getItemDDL(
                            `wms/ItemPlantWarehouse/ItemByCategoryDDL?CategoryId=${valueOption?.value}`
                          );
                        }}
                        placeholder="Item Category"
                        errors={errors}
                        touched={touched}
                      />
                    </div>
                    {values?.viewType?.value === 1 && (
                      <div className="col-lg-3 ">
                        <NewSelect
                          name="item"
                          options={
                            [{ value: 0, label: "All" }, ...itemDDL] || []
                          }
                          value={values?.item}
                          label="Item"
                          onChange={(valueOption) => {
                            setFieldValue("item", valueOption);
                            setShowReport(false);
                          }}
                          placeholder="Item"
                          errors={errors}
                          touched={touched}
                          isDisable={!values?.category}
                        />
                      </div>
                    )}
                  </>
                )}
                <div className="col-lg-2">
                  <button
                    type="button"
                    className="btn btn-primary mt-4"
                    onClick={() => {
                      setShowReport(false);
                      if (values?.reportName?.value === 1) {
                        getLandingApiCall(values);
                      } else {
                        setShowReport(true);
                      }
                    }}
                    disabled={btnDisableHandler(values)}
                  >
                    View
                  </button>
                </div>
              </div>

              {values?.reportName?.value === 1 && (
                <MROItemPlanningTable
                  obj={{ values, rowData, paginationSearchHandler }}
                />
              )}
              {values?.reportName?.value === 2 && showReport && (
                <PowerBIReport
                  reportId={reportId}
                  groupId={groupId}
                  parameterValues={parameterValues(values)}
                  parameterPanel={false}
                />
              )}
            </Form>
          </IForm>
        </>
      )}
    </Formik>
  );
}
