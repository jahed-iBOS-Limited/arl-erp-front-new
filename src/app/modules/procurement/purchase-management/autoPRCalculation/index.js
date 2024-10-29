/* eslint-disable react-hooks/exhaustive-deps */
import { Form, Formik } from "formik";
import React, { useEffect } from "react";
import { shallowEqual, useSelector } from "react-redux";
import IConfirmModal from "../../../_helper/_confirmModal";
import NewSelect from "../../../_helper/_select";
import useAxiosGet from "../../../_helper/customHooks/useAxiosGet";
import useAxiosPost from "../../../_helper/customHooks/useAxiosPost";
import IForm from "./../../../_helper/_form";
import Loading from "./../../../_helper/_loading";
import { useState } from "react";
import { Tab, Tabs } from "react-bootstrap";
import OthersItem from "./othersItem";
import RawMaterialAutoPR from "./rawMaterial";

const initData = {
  purchaseOrganization: "",
};
export default function AutoPRCalculation() {
  const [objProps, setObjprops] = useState({});
  const saveHandler = (values, cb) => {};
  const [autoPRData, getAutoPRData, loading, setAutoPRData] = useAxiosGet();
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

  const { profileData, businessUnitList } = useSelector((state) => {
    return state.authData;
  }, shallowEqual);

  const getData = (values) => {
    // const apiUrl =
    //   values?.purchaseOrganization?.value === 1
    //     ? `/procurement/AutoPurchase/GetReorderStockSummaryData`
    //     : `/procurement/AutoPurchase/sprGetReorderStockSummaryForeign`;
    // getAutoPRData(apiUrl);
    getAutoPRData(
      `/procurement/AutoPurchase/GetPurchaseRequestCalculation?BusinessUnitId=${values?.businessUnit?.value}&ItemMasterCategoryId=${values?.itemCategory?.value}&ItemMasterSubCategoryId=${values?.itemSubCategory?.value}&PurchaseOrganizationId=${values?.purchaseOrganization?.value}`
    );
  };

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

  //   const saveHandlerH = (values, cb) => {
  //     const payLoad = autoPRData?.map((item) => {
  //       return {
  //         accountId: profileData?.accountId,
  //         itemId: item?.intItemId,
  //         uomId: item?.intUoMId,
  //         uomName: item?.strUoMName,
  //         itemCode: item?.strItemCode,
  //         itemName: item?.strItemName,
  //         itemTypeId: item?.intItemTypeId,
  //         itemTypeName: item?.strItemTypeName,
  //         warehouseId: item?.intWarehouseId,
  //         warehouseName: item?.strWarehouseName,
  //         plantId: item?.intPlantId,
  //         plantName: item?.strPlantName,
  //         businessUnitId: item?.intBusinessUnitId,
  //         businessUnitName: item?.strBusinessUnitName,
  //         reorderLevel: 0, // no need
  //         reorderQuantity:
  //           item?.openingQTYSilo +
  //           item?.balanceOnGhat +
  //           (item?.openPOQty - item?.balanceOnGhat) -
  //           item?.totalMonthlyRequirement,
  //         inventoryStock: item?.openingQTYSilo || 0,
  //         currentTotalStock:
  //           item?.openingQTYSilo +
  //             item?.balanceOnGhat +
  //             (item?.openPOQty - item?.balanceOnGhat) || 0,
  //         purchaseRequestStock: item?.openPRQty || 0,
  //         purchaseOrderStock: item?.openPOQty || 0,
  //         intItemMasterCategoryId: item?.intItemMasterCategoryId,
  //         intItemMasterSubCategoryId: item?.intItemMasterSubCategoryId,
  //         intPurchaseOrganizationId: item?.intPurchaseOrganizationId,
  //         strPurchaseOrganizationName: item?.strPurchaseOrganizationName,
  //       };
  //     });
  //   };

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
            isHiddenBack
            isHiddenSave
            isHiddenReset
            title="Auto PR Calculation"
            getProps={setObjprops}
            renderProps={() => {
              return (
                <div className="d-flex align-items-center justify-content-between">
                  {/* <h1
                style={{
                  marginRight: isMobile ? 0 : "320px",
                  background: "rgb(27, 197, 189)",
                  padding: "10px 20px",
                  borderRadius: "4px",
                }}
              >
                <b>Weight: {weight || 0} Kg</b>
              </h1>
              {connectedPort ? (
                <div>
                  <b className="mx-2">
                    Status : <span className="text-success">Connected</span>
                  </b>
                  {connectedPortInfo && (
                    <b className="mr-2">
                      Port :{" "}
                      <span className="text-success">{portTitleHandler()}</span>
                    </b>
                  )}
                </div>
              ) : (
                <div>
                  <b className="mx-2">
                    Status : <span className="text-danger">Disconnected</span>
                  </b>
                </div>
              )}

              <ButtonStyleOne
                className="btn btn-primary"
                style={{ padding: "0.65rem 1rem" }}
                onClick={(e) => {
                  connectHandler();
                }}
                label="Connect"
              /> */}
                </div>
              );
            }}
          >
            <Tabs
              defaultActiveKey="raw-material"
              id="uncontrolled-tab-example"
              className="mb-3"
            >
              <Tab unmountOnExit eventKey="raw-material" title="Raw Material">
                <RawMaterialAutoPR />
              </Tab>
              <Tab unmountOnExit eventKey="others" title="Others Item">
                <OthersItem />
              </Tab>
            </Tabs>
          </IForm>
        </>
      )}
    </Formik>
  );
}
