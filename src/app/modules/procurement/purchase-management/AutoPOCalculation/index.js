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
  const [autoPOData, getAutoPOData, loading, setAutoPRData] = useAxiosGet();
  const [, onCreatePOHandler, loader] = useAxiosPost();
  const [itemTypeList, setItemTypeList] = useState("");
  const [itemCategoryList, setItemCategoryList] = useState("");
  const [itemSubCategoryList, setItemSubCategoryList] = useState("");
  const [itemTypeOption, setItemTypeOption] = useState([]);

  // get selected business unit from store
  const { selectedBusinessUnit, profileData } = useSelector((state) => {
    return state.authData;
  }, shallowEqual);

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
      setItemCategoryList(res.data);
    }
  };

  const subcategoryApiCaller = async (categoryId, typeId) => {
    const res = await axios.get(
      `/item/MasterCategory/GetItemMasterSubCategoryDDL?AccountId=${profileData?.accountId}&ItemMasterCategoryId=${categoryId}&ItemMasterTypeId=${typeId}`
    );
    if (res.data) {
      setItemSubCategoryList(res.data);
    }
  };

  const getData = (values) => {
    const apiUrl = `/procurement/AutoPurchase/GetPurchaseRequestWithRateAgreement?BusinessUnitId=${selectedBusinessUnit?.value}&ItemMasterCategoryId=${values.itemCategory.value}&ItemMasterSubCategoryId=${values.itemSubCategory.value}`;
    getAutoPOData(apiUrl);
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
                            `/procurement/AutoPurchase/GetFormatedItemListForAutoPRCreate`,
                            autoPOData,
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
                      options={[{ value: 1, label: "Local Procurement" }]}
                      value={values?.purchaseOrganization}
                      label="Purchase Organization"
                      onChange={(valueOption) => {
                        setFieldValue(
                          "purchaseOrganization",
                          valueOption || ""
                        );
                        setAutoPRData([]);
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
                            <th>Business Unit</th>
                            <th>Current Stock</th>
                            <th>Open PR</th>
                            <th>Open PO</th>
                            <th>Ghat Stock</th>
                            <th>Port Stock</th>
                            <th>Reorder Level</th>
                            <th>PR Quantity</th>
                            <th>Action</th>
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
                                <td className="text-center">{item?.uomName}</td>
                                <td className="text-center">
                                  {item?.warehouseName}
                                </td>
                                <td>{item?.businessUnitName}</td>
                                <td className="text-center">
                                  {item?.inventoryStock}
                                </td>
                                <td className="text-center">
                                  {item?.purchaseRequestStock}
                                </td>
                                <td className="text-center">
                                  {item?.purchaseOrderStock}
                                </td>
                                <td className="text-center">
                                  {item?.balanceOnGhat || 0}
                                </td>
                                <td className="text-center">
                                  {item?.portStock || 0}
                                </td>
                                <td className="text-center">
                                  {item?.reorderLevel}
                                </td>
                                <td className="text-center">
                                  {item?.reorderQuantity}
                                </td>
                                <td className="text-center">
                                  {values?.purchaseOrganization?.value ===
                                    2 && (
                                    <OverlayTrigger
                                      overlay={
                                        <Tooltip id="cs-icon">
                                          <table className={styles.table}>
                                            <tbody>
                                              {/* Top 3 fields with "+" sign */}
                                              <tr>
                                                <td>
                                                  <strong>Current Stock</strong>
                                                </td>
                                                <td>
                                                  + {item?.inventoryStock || 0}
                                                </td>
                                              </tr>
                                              <tr>
                                                <td>
                                                  <strong>Port Stock</strong>
                                                </td>
                                                <td>
                                                  + {item?.portStock || 0}
                                                </td>
                                              </tr>
                                              <tr>
                                                <td>
                                                  <strong>Ghat Stock</strong>
                                                </td>
                                                <td>
                                                  + {item?.balanceOnGhat || 0}
                                                </td>
                                              </tr>

                                              {/* Bottom 2 fields with "-" sign */}
                                              <tr>
                                                <td>
                                                  <strong>Open PO</strong>
                                                </td>
                                                <td>
                                                  -{" "}
                                                  {item?.purchaseOrderStock ||
                                                    0}
                                                </td>
                                              </tr>
                                              <tr>
                                                <td>
                                                  <strong>Open PR</strong>
                                                </td>
                                                <td>
                                                  -{" "}
                                                  {item?.purchaseRequestStock ||
                                                    0}
                                                </td>
                                              </tr>

                                              {/* Final Total */}
                                              <tr>
                                                <td>
                                                  <strong>PR Quantity</strong>
                                                </td>
                                                <td>
                                                  {(item?.inventoryStock || 0) +
                                                    (item?.portStock || 0) +
                                                    (item?.balanceOnGhat || 0) -
                                                    ((item?.purchaseOrderStock ||
                                                      0) +
                                                      (item?.purchaseRequestStock ||
                                                        0))}
                                                </td>
                                              </tr>
                                            </tbody>
                                          </table>
                                        </Tooltip>
                                      }
                                    >
                                      <span>
                                        <i className="fa fa-info-circle pointer"></i>
                                      </span>
                                    </OverlayTrigger>
                                  )}
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
