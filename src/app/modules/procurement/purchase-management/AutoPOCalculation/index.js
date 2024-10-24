import { Form, Formik } from "formik";
import React, { useEffect, useState } from "react";
import IConfirmModal from "../../../_helper/_confirmModal";
import NewSelect from "../../../_helper/_select";
import useAxiosGet from "../../../_helper/customHooks/useAxiosGet";
import useAxiosPost from "../../../_helper/customHooks/useAxiosPost";
import IForm from "./../../../_helper/_form";
import Loading from "./../../../_helper/_loading";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import styles from "./Tooltip.module.css";
import { shallowEqual, useSelector } from "react-redux";
import axios from "axios";

const initData = {
  purchaseOrganization: "",
  itemSubCategory: "",
  itemCategory: "",
  itemType: "",
};
export default function AutoPOCalculation() {
  const saveHandler = (values, cb) => {};
  const [autoPOData, getAutoPOData, loading, setAutoPOData] = useAxiosGet();
  const [, onCreatePOHandler, loader] = useAxiosPost();
  const [itemTypeList, setItemTypeList] = useState("");
  const [itemCategoryList, setItemCategoryList] = useState("");
  const [itemSubCategoryList, setItemSubCategoryList] = useState("");
  const [itemTypeOption, setItemTypeOption] = useState([]);

  // get selected business unit from store
  const { selectedBusinessUnit, profileData, businessUnitList } = useSelector(
    (state) => {
      return state.authData;
    },
    shallowEqual
  );

  useEffect(() => {
    getInfoData();
  }, []);

  const getInfoData = async () => {
    try {
      const res = await axios.get("/item/ItemCategory/GetItemTypeListDDL");
      setItemTypeList(res.data);
    } catch (error) {}
  };

  useEffect(() => {
    let itemTypes = [];
    itemTypeList &&
      itemTypeList.forEach((item) => {
        let items = {
          value: item.itemTypeId,
          label: item.itemTypeName,
        };
        itemTypes.push(items);
      });
    setItemTypeOption(itemTypes);
  }, [itemTypeList]);

  const categoryApiCaller = async (typeId) => {
    const res = await axios.get(
      `/item/MasterCategory/GetItemMasterCategoryDDL?AccountId=${profileData?.accountId}&ItemTypeId=${typeId}`
    );
    if (res.data) {
      let dataList = res.data || [];
      dataList.push({ value: 0, label: "All" });
      setItemCategoryList(dataList);
    }
  };

  const subcategoryApiCaller = async (categoryId, typeId) => {
    const res = await axios.get(
      `/item/MasterCategory/GetItemMasterSubCategoryDDL?AccountId=${profileData?.accountId}&ItemMasterCategoryId=${categoryId}&ItemMasterTypeId=${typeId}`
    );
    if (res.data) {
      let dataList = res.data || [];
      dataList.push({ value: 0, label: "All" });
      setItemSubCategoryList(dataList);
    }
  };

  const getData = (values) => {
    const apiUrl = `/procurement/AutoPurchase/GetPurchaseRequestWithRateAgreement?BusinessUnitId=${values?.businessUnit?.value}&ItemMasterCategoryId=${values.itemCategory.value}&ItemMasterSubCategoryId=${values.itemSubCategory.value}`;
    getAutoPOData(apiUrl);
  };

  const payloadMapping = (data) => {
    return data.map((item) => ({
      accountId: item.accountId || 0,
      businessUnitId: item.businessUnitId || 0,
      sbuId: item.sbuId || 0,
      plantId: item.plantId || 0,
      plantName: item.plantName || "",
      warehouseId: item.warehouseId || 0,
      purchaseOrganizationId: item.purchaseOrganizationId || 0,
      supplierId: item.supplierId || 0,
      supplierName: item.supplierName || "",
      purchaseRequestId: item.purchaseRequestId || 0,
      purchaseRequestCode: item.purchaseRequestCode || "",
      restQuantity: item.restQuantity || 0,
      itemId: item.itemId || 0,
      itemName: item.itemName || "",
      uoMId: item.uoMId || 0,
      uoMName: item.uoMName || "",
      itemRate: item.itemRate || 0,
      finalPrice: item.finalPrice || 0,
    }));
  };

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
          {(loading || loader) && <Loading />}
          <IForm
            title="Auto PO Calculation"
            isHiddenReset
            isHiddenBack
            isHiddenSave
            renderProps={() => {
              return (
                <div>
                  <button
                    type="button"
                    disabled={!autoPOData?.length}
                    className="btn btn-primary"
                    onClick={() => {
                      IConfirmModal({
                        message: `Are you sure to create PO ?`,
                        yesAlertFunc: () => {
                          onCreatePOHandler(
                            `/procurement/AutoPurchase/CreateFormatedItemListForAutoPO`,
                            payloadMapping(autoPOData),
                            () => {
                              getData(values);
                            },
                            true
                          );
                        },
                        noAlertFunc: () => {},
                      });
                    }}
                  >
                    Create PO
                  </button>
                </div>
              );
            }}
          >
            <Form>
              <>
                <div className="form-group  global-form row">
                  <div className="col-lg-3">
                    <NewSelect
                      name="purchaseOrganization"
                      options={businessUnitList || []}
                      value={values?.businessUnit}
                      label="Business Unit"
                      onChange={(valueOption) => {
                        setFieldValue("businessUnit", valueOption || "");
                        setAutoPOData([]);
                      }}
                      errors={errors}
                      touched={touched}
                    />
                  </div>
                  <div className="col-lg-3">
                    <NewSelect
                      name="itemType"
                      options={itemTypeOption || []}
                      value={values?.itemType}
                      label="Select Item Type"
                      onChange={(valueOption) => {
                        categoryApiCaller(valueOption?.value);
                        setFieldValue("itemCategory", "");
                        setFieldValue("itemType", valueOption);
                      }}
                      errors={errors}
                      touched={touched}
                    />
                  </div>
                  <div className="col-lg-3">
                    <NewSelect
                      name="itemType"
                      options={itemCategoryList || []}
                      value={values?.itemCategory}
                      label="Select Item Category"
                      onChange={(valueOption) => {
                        setFieldValue("itemSubCategory", "");
                        subcategoryApiCaller(
                          valueOption?.value,
                          values.itemType.value
                        );
                        setFieldValue("itemCategory", valueOption);
                      }}
                      errors={errors}
                      touched={touched}
                    />
                  </div>
                  <div className="col-lg-3">
                    <NewSelect
                      name="itemType"
                      options={itemSubCategoryList || []}
                      value={values?.itemSubCategory}
                      label="Select Item Sub-category"
                      onChange={(valueOption) => {
                        setFieldValue("itemSubCategory", valueOption);
                      }}
                      errors={errors}
                      touched={touched}
                    />
                  </div>

                  <div>
                    <button
                      type="button"
                      onClick={() => {
                        getData(values);
                      }}
                      className="btn btn-primary mt-5"
                    >
                      Show
                    </button>
                  </div>
                </div>

                <div>
                  {autoPOData?.length > 0 && (
                    <div className="table-responsive">
                      <table className="table table-striped mt-2 table-bordered bj-table bj-table-landing">
                        <thead>
                          <tr>
                            <th>SL</th>
                            <th>Item Code</th>
                            <th>Item Name</th>
                            <th>UOM</th>
                            <th>Warehouse</th>
                            <th>Plant Name</th>
                            {/* <th>Business Unit</th> */}
                            {/* <th>Current Stock</th> */}
                            {/* <th>Open PR</th>
                            <th>Open PO</th> */}
                            {/* <th>Ghat Stock</th>
                            <th>Port Stock</th> */}
                            {/* <th>Reorder Level</th> */}
                            <th>PO Quantity</th>
                          </tr>
                        </thead>
                        <tbody>
                          {autoPOData?.length > 0 &&
                            autoPOData?.map((item, index) => (
                              <tr key={index}>
                                <td>{index + 1}</td>
                                <td className="text-center">
                                  {item?.itemCode}
                                </td>
                                <td>{item?.itemName}</td>
                                <td className="text-center">{item?.uoMName}</td>
                                <td className="text-center">
                                  {item?.warehouseName}
                                </td>
                                <td className="text-center">
                                  {item?.plantName}
                                </td>
                                {/* <td>{item?.businessUnitName}</td> */}
                                {/* <td className="text-center">
                                  {item?.inventoryStock}
                                </td> */}
                                {/* <td className="text-center">
                                  {item?.purchaseRequestStock}
                                </td>
                                <td className="text-center">
                                  {item?.purchaseOrderStock}
                                </td> */}
                                {/* <td className="text-center">
                                  {item?.balanceOnGhat || 0}
                                </td>
                                <td className="text-center">
                                  {item?.portStock || 0}
                                </td> */}
                                {/* <td className="text-center">
                                  {item?.reorderLevel}
                                </td> */}
                                <td className="text-center">
                                  {item?.restQuantity}
                                </td>
                              </tr>
                            ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </>
            </Form>
          </IForm>
        </>
      )}
    </Formik>
  );
}
