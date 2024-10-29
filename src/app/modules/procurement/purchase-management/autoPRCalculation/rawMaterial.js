/* eslint-disable react-hooks/exhaustive-deps */
import { Form, Formik } from "formik";
import React, { useEffect, useState } from "react";
import { shallowEqual, useSelector } from "react-redux";
import NewSelect from "../../../_helper/_select";
import IViewModal from "../../../_helper/_viewModal";
import YearMonthForm from "../../../_helper/commonInputFieldsGroups/yearMonthForm";
import useAxiosGet from "../../../_helper/customHooks/useAxiosGet";
import useAxiosPost from "../../../_helper/customHooks/useAxiosPost";
import IForm from "./../../../_helper/_form";
import Loading from "./../../../_helper/_loading";
import BreakDownModal from "./breakdownModal";

const initData = {
  purchaseOrganization: "",
};
export default function RawMaterialAutoPR() {
  const saveHandler = (values, cb) => {};
  const [
    autoRawMaterialData,
    getAutoRawMaterialData,
    loading,
    setAutoRawMaterialData,
  ] = useAxiosGet();
  const [
    landingData,
    getLandingData,
    landingLoading,
    setLandingData,
  ] = useAxiosGet();
  const [, onCreatePRHandler, loader] = useAxiosPost();
  const [
    itemTypeList,
    getItemTypeList,
    itemTypeListLoader,
    setItemTypeList,
  ] = useAxiosGet();
  const [
    itemCategoryList,
    getItemCategoryList,
    categoryLoader,
    setItemCategoryList,
  ] = useAxiosGet();
  const [
    itemSubCategoryList,
    getItemSubCategoryList,
    subCategoryLoader,
    setItemSubCategoryList,
  ] = useAxiosGet();
  const [, saveHeaderData] = useAxiosPost();
  const [singleRowData, setSingleRowData] = useState();

  const { profileData, businessUnitList } = useSelector((state) => {
    return state.authData;
  }, shallowEqual);

  const [showBreakdownModal, setShowBreakdownModal] = useState(false);

  const getData = (values) => {
    console.log("trr", values);
    getAutoRawMaterialData(
      `/procurement/AutoPurchase/GetInsertPRCalculation?BusinessUnitId=${
        values?.businessUnit?.value
      }&FromMonth=${`${values?.year?.value}-${values?.month?.value}-01`}&ItemCategoryId=0&ItemSubCategoryId=0`
      //   (data) => {
      //     getLandingData(
      //       `/procurement/AutoPurchase/GetPRCalculationLanding?MonthId=${values?.month?.value}&YearId=${values?.year?.value}&BusinessUnitId=${values?.businessUnit?.value}`
      //     );
      //   }
    );
  };
  console.log("landingData", landingData);

  useEffect(() => {
    getItemTypeList("/item/ItemCategory/GetItemTypeListDDL", (data) => {
      const modData = data?.map((itm) => {
        return {
          ...itm,
          value: itm?.itemTypeId,
          label: itm?.itemTypeName,
        };
      });
      setItemTypeList(modData);
    });
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
          {(loading || loader || itemTypeListLoader || categoryLoader,
          subCategoryLoader) && <Loading />}
          <IForm
            title="Raw Material Auto PR Calculation"
            isHiddenReset
            isHiddenBack
            isHiddenSave
            renderProps={() => {
              return (
                <div>
                  {/* <button
                    type="button"
                    disabled={!autoRawMaterialData?.length}
                    className="btn btn-primary"
                    onClick={() => {
                      console.log("save");
                        IConfirmModal({
                          message: `Are you sure to create PR ?`,
                          yesAlertFunc: () => {
                            onCreatePRHandler(
                              `/procurement/AutoPurchase/GetFormatedItemListForAutoPRCreate`,
                              payLoad,
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
                    Save
                  </button> */}
                </div>
              );
            }}
          >
            <Form>
              <>
                <div className="form-group  global-form row">
                  <div className="col-lg-3">
                    <NewSelect
                      name="businessUnit"
                      options={businessUnitList || []}
                      value={values?.businessUnit}
                      label="Business Unit"
                      onChange={(valueOption) => {
                        setFieldValue("businessUnit", valueOption || "");
                        setAutoRawMaterialData([]);
                      }}
                      errors={errors}
                      touched={touched}
                    />
                  </div>
                  <YearMonthForm
                    obj={{
                      values,
                      setFieldValue,
                      onChange: (allValues) => {
                        setAutoRawMaterialData([]);
                      },
                    }}
                  />
                  {/* <div className="col-lg-3">
                    <NewSelect
                      name="purchaseOrganization"
                      options={[
                        { value: 11, label: "Local Procurement" },
                        { value: 12, label: "Forign Procurement" },
                      ]}
                      value={values?.purchaseOrganization}
                      label="Purchase Organization"
                      onChange={(valueOption) => {
                        setFieldValue(
                          "purchaseOrganization",
                          valueOption || ""
                        );
                        setAutoRawMaterialData([]);
                      }}
                      errors={errors}
                      touched={touched}
                    />
                  </div> */}
                  <div>
                    <button
                      type="button"
                      onClick={() => {
                        // setShowBreakdownModal(true);
                        getData(values);
                      }}
                      disabled={!values?.businessUnit}
                      className="btn btn-primary mt-5"
                    >
                      Show
                    </button>
                  </div>
                  {autoRawMaterialData?.length > 0 &&
                    !autoRawMaterialData?.[0]?.prCalculationHeaderId && (
                      <div className="ml-4">
                        <button
                          type="button"
                          onClick={() => {
                            const payload = autoRawMaterialData?.map((itm) => {
                              return {
                                ...itm,
                                prCalculationHeaderId: 0,
                                intActionBy: profileData?.userId,
                              };
                            });
                            saveHeaderData(
                              `/procurement/AutoPurchase/CreatePRCalculationHeader`,
                              payload,
                              () => {
                                getAutoRawMaterialData(
                                  `/procurement/AutoPurchase/GetInsertPRCalculation?BusinessUnitId=${
                                    values?.businessUnit?.value
                                  }&FromMonth=${`${values?.year?.value}-${values?.month?.value}-01`}&ItemCategoryId=0&ItemSubCategoryId=0`
                                );
                              },
                              true
                            );
                          }}
                          disabled={!values?.businessUnit}
                          className="btn btn-primary mt-5"
                        >
                          Save
                        </button>
                      </div>
                    )}
                </div>

                <div>
                  {autoRawMaterialData?.length > 0 && (
                    <div className="table-responsive">
                      <table className="table table-striped mt-2 table-bordered bj-table bj-table-landing">
                        <thead>
                          <tr>
                            <th>SL</th>
                            <th>Item Code</th>
                            <th>Item Name</th>
                            <th>UOM</th>
                            <th>Business Unit</th>
                            <th>Budget QTY(3 Month)</th>
                            <th>Opening QTY Silo</th>
                            <th>Floating Stock</th>
                            <th>In Transit</th>
                            <th>Open PR</th>
                            <th>Available Stock</th>
                            <th>Closing Balance</th>
                            <th>Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {autoRawMaterialData?.length > 0 &&
                            autoRawMaterialData?.map((item, index) => (
                              <tr key={index}>
                                <td>{index + 1}</td>
                                <td className="text-center">
                                  {item?.itemCode}
                                </td>
                                <td>{item?.itemName}</td>
                                <td className="text-center">{item?.uomName}</td>
                                <td>{item?.businessUnitName}</td>
                                <td className="text-center">
                                  {item?.totalBudgetQty
                                    ? item?.totalBudgetQty?.toFixed(2)
                                    : ""}
                                </td>
                                <td className="text-center">
                                  {item?.stockQty?.toFixed(2) || 0}
                                </td>
                                <td className="text-center">
                                  {item?.balanceOnGhat?.toFixed(2) || 0}
                                </td>
                                <td className="text-center">
                                  {item?.inTransit?.toFixed(2) || 0}
                                </td>
                                <td className="text-center">
                                  {item?.openPRQty?.toFixed(2) || 0}
                                </td>
                                <td className="text-center">
                                  {item?.availableStock?.toFixed(2) || 0}
                                </td>
                                <td className="text-center">
                                  {item?.closingBlance?.toFixed(2) || 0}
                                </td>
                                <td className="text-center">
                                  {item?.prCalculationHeaderId && (
                                    <span
                                      style={{ cursor: "pointer" }}
                                      onClick={() => {
                                        setSingleRowData(item);
                                        setShowBreakdownModal(true);
                                      }}
                                    >
                                      <i
                                        style={{ fontSize: "16px" }}
                                        className="fa fa-plus-square text-primary mr-2"
                                      />
                                    </span>
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
            <IViewModal
              show={showBreakdownModal}
              onHide={() => {
                setShowBreakdownModal(false);
              }}
            >
              <BreakDownModal singleRowData={singleRowData} />
            </IViewModal>
          </IForm>
        </>
      )}
    </Formik>
  );
}
