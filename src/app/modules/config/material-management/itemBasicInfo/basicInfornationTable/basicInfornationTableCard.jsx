import { default as Axios, default as axios } from "axios";
import { Form, Formik } from "formik";
import React, { useEffect, useState } from "react";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { toast } from "react-toastify";
import * as Yup from "yup";
import useAxiosGet from "../../../../_helper/customHooks/useAxiosGet";
import IView from "../../../../_helper/_helperIcons/_view";
import Loading from "../../../../_helper/_loading";
import NewSelect from "../../../../_helper/_select";
import {
  getItemCategoryDDLByTypeId_api,
  getItemSubCategoryDDLByCategoryId_api,
  getItemTypeListDDL_api,
} from "../helper";
import IEdit from "./../../../../_helper/_helperIcons/_edit";
import PaginationSearch from "./../../../../_helper/_search";
import PaginationTable from "./../../../../_helper/_tablePagination";
import { setItemBasicInfoInitDataAction } from "../../../../_helper/reduxForLocalStorage/Actions";
// Validation schema
const validationSchema = Yup.object().shape({});

export function BasicInfornationTable() {
  
  const initData = useSelector((state) => {
    return state.localStorage.itemBasicInfoInitData;
  }, shallowEqual);

  const [products, setProducts] = useState(null);
  const [itemTypeOption, setItemTypeOption] = useState([]);
  const [itemCategoryOption, setItemCategoryOption] = useState([]);
  const [itemSubCategoryOption, setItemSubCategoryOption] = useState([]);
  const [loading, setLoading] = useState(false);
  const [plantDDL, getPlantDDL] = useAxiosGet();
  const [warehouseDDL, getWarehouseDDL] = useAxiosGet();
  const dispatch = useDispatch();
  //paginationState
  const [pageNo, setPageNo] = React.useState(0);
  const [pageSize, setPageSize] = React.useState(15);

  const history = useHistory();
  // get user profile data from store
  // get user profile data from store
  const storeData = useSelector((state) => {
    return {
      profileData: state?.authData?.profileData,
      selectedBusinessUnit: state?.authData?.selectedBusinessUnit,
    };
  }, shallowEqual);

  const { profileData, selectedBusinessUnit } = storeData;

  const dispatchProduct = async (
    accId,
    buId,
    pageNo,
    pageSize,
    search,
    itemType,
    itemCategory,
    itemSubCategory,
    plant,
    warehouse
  ) => {
    setLoading(true);
    try {
      const searchPath = search ? `searchTerm=${search}&` : "";
      const res = await Axios.get(
        // `/item/ItemBasic/ItemPurchaseSearchPagination?BusinessunitId=${buId}&ItemType=${itemType}&ItemCategory=${itemCategory}&ItemSubCategory=${itemSubCategory}&${searchPath}&AccountId=${accId}&Status=true&viewOrder=asc&PageNo=${pageNo}&PageSize=${pageSize}`
        `/item/ItemBasic/ItemPurchaseSearchPagination?BusinessunitId=${buId}&ItemType=${itemType}&ItemCategory=${itemCategory}&ItemSubCategory=${itemSubCategory}&${searchPath}&AccountId=${accId}&Status=true&viewOrder=asc&PageNo=${pageNo}&PageSize=${pageSize}&plantId=${plant}&warehouseId=${warehouse}`
      );
      setProducts(res.data);
      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (profileData) {
      dispatchProduct(
        profileData.accountId,
        selectedBusinessUnit?.value,
        pageNo,
        pageSize,
        null,
        0,
        0,
        0,
        0,
        0
      );
      getPlantDDL(
        `/wms/Plant/GetPlantDDL?AccountId=${profileData.accountId}&BusinessUnitId=${selectedBusinessUnit?.value}`
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profileData]);

  //setPositionHandler
  const setPositionHandler = (pageNo, pageSize, values) => {
    let search = values?.search ? values.search : null;
    dispatchProduct(
      profileData.accountId,
      selectedBusinessUnit?.value,
      pageNo,
      pageSize,
      search,
      values?.itemType?.value,
      values?.itemCategory?.value,
      values?.itemSubCategory?.value,
      values?.plant?.value,
      values?.warehouse?.value
    );
  };

  const paginationSearchHandler = (search, values) => {
    dispatchProduct(
      profileData.accountId,
      selectedBusinessUnit?.value,
      0,
      pageSize,
      search,
      values?.itemType?.value,
      values?.itemCategory?.value,
      values?.itemSubCategory?.value,
      values?.plant?.value,
      values?.warehouse?.value
    );
    setPageNo(0);
  };

  useEffect(() => {
    if (profileData?.accountId && selectedBusinessUnit?.value) {
      getItemTypeListDDL_api(setItemTypeOption);
    }
  }, [profileData, selectedBusinessUnit]);

  const download = (
    selectedBusinessUnit,
    itemType,
    itemCategory,
    itemSubCategory,
    search,
    plant,
    warehouse,
    accountId
  ) => {
    setLoading(true);
    const url = `/wms/WmsReport/GetItemPurchaseListExcel?BusinessunitId=${selectedBusinessUnit}&ItemType=${itemType}&ItemCategory=${itemCategory}&ItemSubCategory=${itemSubCategory}&searchTerm=${""}&AccountId=${accountId}&Status=true&plantId=${plant}&warehouseId=${warehouse}&isDownload=true`;
    axios({
      url: url,
      method: "GET",
      responseType: "blob", // important
    })
      .then((response) => {
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", `Item Basic Info.xls`);
        document.body.appendChild(link);
        link.click();
        setLoading(false);
      })
      .catch((err) => {
        setLoading(false);
        toast.error(err?.response?.data?.message, "Something went wrong");
      });
  };

  return (
    <>
      {/* Search Start */}
      <Formik
        enableReinitialize={true}
        initialValues={{
          ...initData,
          itemType: itemTypeOption[0],
        }}
        validationSchema={validationSchema}
        onSubmit={(values, { setSubmitting, resetForm }) => {}}
      >
        {({ errors, touched, setFieldValue, isValid, values }) => (
          <>
            <Form className="form form-label-right">
              <div className="row global-form">
                <div className="col-lg-3">
                  <NewSelect
                    name="itemType"
                    options={itemTypeOption || []}
                    value={values?.itemType}
                    label="Item Type"
                    onChange={(valueOption) => {
                      setFieldValue("itemType", valueOption);
                      valueOption?.value !== 0 &&
                        setFieldValue("itemCategory", "");
                      setProducts([]);
                      getItemCategoryDDLByTypeId_api(
                        profileData.accountId,
                        selectedBusinessUnit.value,
                        valueOption?.value,
                        setItemCategoryOption
                      );
                    }}
                    placeholder="Item Type"
                    errors={errors}
                    touched={touched}
                  />
                </div>
                <div className="col-lg-3">
                  <NewSelect
                    name="itemCategory"
                    options={itemCategoryOption || []}
                    value={values?.itemCategory}
                    label="Item Category"
                    onChange={(valueOption) => {
                      setFieldValue("itemCategory", valueOption);
                      valueOption?.value !== 0 &&
                        setFieldValue("itemSubCategory", "");
                      setProducts([]);
                      getItemSubCategoryDDLByCategoryId_api(
                        profileData.accountId,
                        selectedBusinessUnit.value,
                        valueOption?.value,
                        values?.itemType?.value,
                        setItemSubCategoryOption
                      );
                    }}
                    placeholder="Item Category"
                    errors={errors}
                    touched={touched}
                  />
                </div>
                <div className="col-lg-3">
                  <NewSelect
                    name="itemSubCategory"
                    options={itemSubCategoryOption || []}
                    value={values?.itemSubCategory}
                    label="Item Sub-category"
                    onChange={(valueOption) => {
                      setFieldValue("itemSubCategory", valueOption);
                      setProducts([]);
                    }}
                    placeholder="Item Sub-category"
                    errors={errors}
                    touched={touched}
                  />
                </div>
                {/* changes for miraj bhai */}
                <div className="col-lg-3">
                  <NewSelect
                    name="plant"
                    options={[{ value: 0, label: "All" }, ...plantDDL] || []}
                    value={values?.plant}
                    label="Plant"
                    onChange={(valueOption) => {
                      setFieldValue("plant", valueOption);
                      getWarehouseDDL(
                        `/wms/ItemPlantWarehouse/GetWareHouseItemPlantWareHouseDDL?accountId=${profileData.accountId}&businessUnitId=${selectedBusinessUnit?.value}&PlantId=${valueOption?.value}`
                      );
                      setProducts([]);
                    }}
                    placeholder="Plant"
                    errors={errors}
                    touched={touched}
                  />
                </div>
                <div className="col-lg-3">
                  <NewSelect
                    name="warehouse"
                    options={
                      [{ value: 0, label: "All" }, ...warehouseDDL] || []
                    }
                    value={values?.warehouse}
                    label="warehouse"
                    onChange={(valueOption) => {
                      setFieldValue("warehouse", valueOption);
                      setProducts([]);
                    }}
                    placeholder="warehouse"
                    errors={errors}
                    touched={touched}
                  />
                </div>
                <div className="col-lg-3">
                  <button
                    type="button"
                    style={{
                      marginTop: "16px",
                    }}
                    onClick={() => {
                      setProducts([]);
                      dispatch(setItemBasicInfoInitDataAction(values))
                      dispatchProduct(
                        profileData.accountId,
                        selectedBusinessUnit?.value,
                        pageNo,
                        pageSize,
                        null,
                        values?.itemType?.value,
                        values?.itemCategory?.value,
                        values?.itemSubCategory?.value,
                        values?.plant?.value,
                        values?.warehouse?.value
                      );
                    }}
                    class="btn btn-primary ml-2"
                    disabled={
                      !values?.itemType ||
                      !values.itemCategory ||
                      !values?.itemSubCategory
                    }
                  >
                    View
                  </button>
                  <button
                    type="button"
                    style={{
                      marginTop: "16px",
                    }}
                    onClick={() => {
                      download(
                        selectedBusinessUnit?.value,
                        values?.itemType?.value,
                        values?.itemCategory?.value,
                        values?.itemSubCategory?.value,
                        values?.search || "",
                        values?.plant?.value,
                        values?.warehouse?.value,
                        profileData.accountId
                      );
                    }}
                    class="btn btn-primary ml-2"
                    disabled={products?.data?.length === 0}
                  >
                    Export Excel
                  </button>
                </div>
              </div>
            </Form>
            {/* Table Start */}
            {loading && <Loading />}
            <PaginationSearch
              placeholder="Item  Code Search"
              paginationSearchHandler={paginationSearchHandler}
              values={values}
              setter={(searchValue) => setFieldValue("search", searchValue)}
            />
            <div className="row cash_journal">
              <div className="col-lg-12">
                <div className="table-responsive">
                <table className="table table-striped table-bordered mt-1 global-table">
                  <thead>
                    <tr>
                      <th>SL</th>
                      <th>Code</th>
                      <th>Item</th>
                      <th>Item Type</th>
                      <th>Category</th>
                      <th>Sub-Category</th>
                      <th>Status</th>
                      <th style={{ width: "75px" }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products?.data?.map((item, index) => (
                      <tr key={item.taxBranchId}>
                        <td> {item?.sl}</td>
                        <td>
                          <div className="pl-2">{item.itemCode}</div>
                        </td>
                        <td>
                          <div className="pl-2">{item.itemName}</div>
                        </td>
                        <td>
                          <div className="pl-2">{item.itemTypeName}</div>
                        </td>
                        <td>
                          <div className="pl-2">{item.itemCategoryName}</div>
                        </td>
                        <td>
                          <div className="pl-2">{item.itemSubCategoryName}</div>
                        </td>
                        <td>
                          <div className="pl-2" style={{ display: "flex" }}>
                            <div class="order-md-1 p-1">
                              <OverlayTrigger
                                overlay={
                                  <Tooltip id="cs-icon">
                                    {"Basic Item Information"}
                                  </Tooltip>
                                }
                              >
                                <input
                                  type="checkbox"
                                  value={item?.itemStatus}
                                  checked={item?.itemStatus}
                                  name="itemStatus"
                                  onClick={() =>
                                    history.push({
                                      pathname: `/config/material-management/item-basic-info/edit/${item?.itemId}`,
                                      state: { item, checkBox: "itemStatus" },
                                    })
                                  }
                                />
                              </OverlayTrigger>
                            </div>

                            <div class="order-md-1 p-1">
                              <OverlayTrigger
                                overlay={
                                  <Tooltip id="cs-icon">
                                    {"Config Item Attirbute"}
                                  </Tooltip>
                                }
                              >
                                <input
                                  type="checkbox"
                                  value={item?.itemAttributeConfigStatus}
                                  checked={item?.itemAttributeConfigStatus}
                                  name="itemAttributeConfigStatus"
                                  onClick={() =>
                                    history.push({
                                      pathname: `/config/material-management/item-basic-info/edit/${item?.itemId}`,
                                      state: {
                                        item,
                                        checkBox: "itemAttributeConfigStatus",
                                      },
                                    })
                                  }
                                />
                              </OverlayTrigger>
                            </div>

                            <div class="order-md-1 p-1">
                              <OverlayTrigger
                                overlay={
                                  <Tooltip id="cs-icon">
                                    {"Item Plant Warehouse"}
                                  </Tooltip>
                                }
                              >
                                <input
                                  type="checkbox"
                                  value={item?.itemPlantWarehouseStatus}
                                  checked={item?.itemPlantWarehouseStatus}
                                  name="itemPlantWarehouseStatus"
                                  onClick={() =>
                                    history.push({
                                      pathname: `/config/material-management/item-basic-info/edit/${item?.itemId}`,
                                      state: {
                                        item,
                                        checkBox: "itemPlantWarehouseStatus",
                                      },
                                    })
                                  }
                                />
                              </OverlayTrigger>
                            </div>

                            <div class="order-md-1 p-1">
                              <OverlayTrigger
                                overlay={
                                  <Tooltip id="cs-icon">
                                    {"Purchase Information"}
                                  </Tooltip>
                                }
                              >
                                <input
                                  type="checkbox"
                                  value={item?.itemPurchaseStatus}
                                  checked={item?.itemPurchaseStatus}
                                  name="itemPurchaseStatus"
                                  onClick={() =>
                                    history.push({
                                      pathname: `/config/material-management/item-basic-info/edit/${item?.itemId}`,
                                      state: {
                                        item,
                                        checkBox: "itemPurchaseStatus",
                                      },
                                    })
                                  }
                                />
                              </OverlayTrigger>
                            </div>

                            <div class="order-md-1 p-1">
                              <OverlayTrigger
                                overlay={
                                  <Tooltip id="cs-icon">
                                    {"Sales Information"}
                                  </Tooltip>
                                }
                              >
                                <input
                                  type="checkbox"
                                  value={item?.itemSalesStatus}
                                  checked={item?.itemSalesStatus}
                                  name="itemSalesStatus"
                                  onClick={() =>
                                    history.push({
                                      pathname: `/config/material-management/item-basic-info/edit/${item?.itemId}`,
                                      state: {
                                        item,
                                        checkBox: "itemSalesStatus",
                                      },
                                    })
                                  }
                                />
                              </OverlayTrigger>
                            </div>

                            <div class="order-md-1 p-1">
                              <OverlayTrigger
                                overlay={
                                  <Tooltip id="cs-icon">
                                    {"Costing Information"}
                                  </Tooltip>
                                }
                              >
                                <input
                                  type="checkbox"
                                  value={item?.itemWareHouseCostStatus}
                                  checked={item?.itemWareHouseCostStatus}
                                  name="itemWareHouseCostStatus"
                                  onClick={() =>
                                    history.push({
                                      pathname: `/config/material-management/item-basic-info/edit/${item?.itemId}`,
                                      state: {
                                        item,
                                        checkBox: "itemWareHouseCostStatus",
                                      },
                                    })
                                  }
                                />
                              </OverlayTrigger>
                            </div>
                          </div>
                        </td>
                        <td>
                          <div className="d-flex justify-content-around">
                            <span className="view">
                              <IView
                                clickHandler={() => {
                                  history.push({
                                    pathname: `/config/material-management/item-basic-info/view/${item?.itemId}`,
                                    state: { item },
                                  });
                                }}
                              />
                            </span>
                            <span
                              className="edit"
                              onClick={() => {
                                history.push({
                                  pathname: `/config/material-management/item-basic-info/edit/${item?.itemId}`,
                                  state: { item },
                                });
                              }}
                            >
                              <IEdit />
                            </span>
                            {[4, 5].includes(item?.itemTypeId) && (
                              <span
                                className="trade-offer-setup"
                                onClick={() => {
                                  history.push({
                                    pathname: `/config/material-management/item-basic-info/itemTradeOfferSetup/${item?.itemId}`,
                                    state: { ...item },
                                  });
                                }}
                              >
                                <OverlayTrigger
                                  overlay={
                                    <Tooltip id="cs-icon">
                                      Trade Offer Setup
                                    </Tooltip>
                                  }
                                >
                                  <span>
                                    <i
                                      className={`fas fa-gears pointer`}
                                      onClick={() => {}}
                                    ></i>
                                  </span>
                                </OverlayTrigger>
                              </span>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                   </div>
                {products?.data?.length > 0 && (
                  <PaginationTable
                    count={products?.totalCount}
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
          </>
        )}
      </Formik>
    </>
  );
}
