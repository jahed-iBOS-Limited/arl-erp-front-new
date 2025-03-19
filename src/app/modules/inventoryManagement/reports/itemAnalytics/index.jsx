/* eslint-disable react-hooks/exhaustive-deps */
import { Form, Formik } from "formik";
import React, { useEffect, useState } from "react";
import { shallowEqual, useSelector } from "react-redux";
import IForm from "../../../_helper/_form";
import Loading from "../../../_helper/_loading";
import PaginationSearch from "../../../_helper/_search";
import NewSelect from "../../../_helper/_select";
import PaginationTable from "../../../_helper/_tablePagination";
import useAxiosGet from "../../../_helper/customHooks/useAxiosGet";
import { insertDataInExcel } from "./helper";
const initData = {
  plant: "",
  wareHouse: "",
  itemType: "",
  itemCategory: "",
  itemSubCategory: "",
};
export default function ItemAnalytics() {
  const [pageNo, setPageNo] = useState(0);
  const [pageSize, setPageSize] = useState(20);
  const [
    itemAnalyticsReport,
    getItemAnalyticsReport,
    itemAnalyticsReportLoader,
  ] = useAxiosGet();
  const [plantDDL, getPlanDDL] = useAxiosGet();
  const [wareHouseDDL, getWareHouseDDL] = useAxiosGet();
  const [itemTypeDDL, getItemTypeDDL] = useAxiosGet();
  const [itemCategoryDDL, getItemCategoryDDL] = useAxiosGet();
  const [itemSubCategoryDDL, getItemSubCategoryDDL] = useAxiosGet();

  const {
    profileData: { accountId: accId, userId },
    selectedBusinessUnit: { value: buId },
  } = useSelector((state) => state?.authData, shallowEqual);

  const saveHandler = (values, cb) => {};
  //   const history = useHistory();

  const getLandingApiCall = (
    values,
    pageNo,
    pageSize,
    searchValue = "",
    cb
  ) => {
    getItemAnalyticsReport(
      `/item/ItemBasic/GetItemAnalyticsReport?AccountId=${accId}&BusinessunitId=${buId}&plantId=${
        values?.plant?.value
      }&warehouseId=${values?.wareHouse?.value}&ItemType=${
        values?.itemType?.value
      }&ItemCategory=${values?.itemCategory?.value ||
        0}&ItemSubCategory=${values?.itemSubCategory?.value ||
        0}&searchTerm=${searchValue}&viewOrder=asc&PageNo=${pageNo}&PageSize=${pageSize}`,
      cb
    );
  };
  const setPositionHandler = (pageNo, pageSize, values) => {
    console.log(pageNo, pageSize, values);
    getLandingApiCall(values, pageNo, pageSize);
  };

  const handleView = (values) => {
    getLandingApiCall(values, pageNo, pageSize);
  };

  const paginationSearchHandler = (searchValue, values) => {
    getLandingApiCall(values, pageNo, pageSize, searchValue);
  };
  const generateExcel = (values, pageSize) => {
    getLandingApiCall(values, pageNo, pageSize, "", insertDataInExcel);
  };
  useEffect(() => {
    getPlanDDL(
      `/wms/BusinessUnitPlant/GetOrganizationalUnitUserPermission?UserId=${userId}&AccId=${accId}&BusinessUnitId=${buId}&OrgUnitTypeId=${7}`
    );
  }, [userId, accId, buId]);
  useEffect(() => {
    getItemTypeDDL(`/wms/WmsReport/GetItemTypeListDDL`);
  }, []);
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
          {itemAnalyticsReportLoader && <Loading />}
          <IForm
            title="Item Analytics Report"
            isHiddenReset
            isHiddenBack
            isHiddenSave
            renderProps={() => {}}
          >
            <Form>
              <div className="row global-form">
                <div className="col-lg-3 ">
                  <NewSelect
                    name="plant"
                    options={[{ label: "All", value: 0 }, ...plantDDL] || []}
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
                    name="itemType"
                    options={itemTypeDDL || []}
                    value={values?.itemType}
                    label="Item Type"
                    onChange={(valueOption) => {
                      setFieldValue("itemType", valueOption);
                      setFieldValue("itemCategory", "");
                      if (!valueOption) return;
                      getItemCategoryDDL(
                        `/wms/WmsReport/GetItemCategoryListDDL?AccountId=${accId}&BusinessUnitId=${buId}&ItemTypeId=${valueOption?.value}`
                      );
                    }}
                    disabled={!values?.wareHouse}
                    placeholder="Item Type"
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
                    disabled={!values?.itemType}
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
                  />
                </div>
                <div className="col-lg-2">
                  <button
                    type="button"
                    className="btn btn-primary mt-4"
                    onClick={() => handleView(values)}
                    disabled={
                      !values?.plant || !values?.wareHouse || !values?.itemType
                    }
                  >
                    View
                  </button>
                </div>
              </div>

              {itemAnalyticsReport?.data?.length > 0 && (
                <div>
                  {values?.plant &&
                    values?.wareHouse &&
                    values?.itemType &&
                    itemAnalyticsReport?.totalCount > 0 && (
                      <div className="my-1 d-flex justify-content-between">
                        <PaginationSearch
                          values={values}
                          placeholder="Item Name And Code Search"
                          paginationSearchHandler={paginationSearchHandler}
                        />
                        <button
                          className="btn btn-primary"
                          type="button"
                          onClick={(e) =>
                            generateExcel(
                              values,
                              itemAnalyticsReport?.totalCount
                            )
                          }
                        >
                          Export Excel
                        </button>
                      </div>
                    )}
                  <div className="common-scrollable-table two-column-sticky">
                    <div className="scroll-table _table">
                      <div className="table-responsive">
                        <table className="table table-striped table-bordered global-table">
                          <thead>
                            <tr>
                              <th>SL No</th>
                              <th>Plant</th>
                              <th>Warehouse</th>
                              <th>Item Name</th>
                              <th>Item Code</th>
                              <th>UOM Name</th>
                              <th>Inventory Location</th>
                              <th>Bin Number</th>
                              <th>Minimum Stock Quantity</th>
                              <th>Safety Stock Quantity</th>
                              <th>Maximum Stock Quantity</th>
                              <th>Reorder Level</th>
                              <th>Reorder Quantity</th>
                              <th>Avg Daily Consumption</th>
                              <th>Max Lead Days</th>
                              <th>Min Lead Days</th>
                              <th>ABC</th>
                              <th>FNS</th>
                              <th>VED</th>
                            </tr>
                          </thead>
                          <tbody>
                            {itemAnalyticsReport?.data?.length > 0 &&
                              itemAnalyticsReport?.data?.map((item, index) => (
                                <tr>
                                  <td>{index + 1}</td>
                                  <td>{item?.plantName}</td>
                                  <td>{item?.wareHouseName}</td>
                                  <td>{item?.itemName}</td>
                                  <td>{item?.itemCode}</td>
                                  <td>{item?.baseUom}</td>
                                  <td>{item?.inventoryLocationName}</td>
                                  <td>{item?.binNumber}</td>
                                  <td>{item?.nMinimumStockQuantity}</td>
                                  <td>{item?.safetyStockQuantity}</td>
                                  <td>{item?.maximumQuantity}</td>
                                  <td>{item?.reorderLevel}</td>
                                  <td>{item?.reorderQuantity}</td>
                                  <td>{item?.averageDailyConsumption}</td>
                                  <td>{item?.maxLeadDays}</td>
                                  <td>{item?.minLeadDays}</td>
                                  <td>{item?.abc}</td>
                                  <td>{item?.fns}</td>
                                  <td>{item?.ved}</td>
                                </tr>
                              ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                  <div>
                    {itemAnalyticsReport?.data?.length > 0 && (
                      <PaginationTable
                        count={itemAnalyticsReport?.totalCount}
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
              )}
            </Form>
          </IForm>
        </>
      )}
    </Formik>
  );
}
