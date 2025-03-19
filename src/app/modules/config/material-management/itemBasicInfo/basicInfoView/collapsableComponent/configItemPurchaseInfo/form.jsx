import React, { useEffect, useState } from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import Axios from "axios";


const DataValiadtionSchema = Yup.object().shape({
  maxLeadDays: Yup.number()
    .required("Maximum lead days is required")
    .integer()
    .min(1, "Maximum lead days is required"),

  minOrderQuantity: Yup.number()
    .integer()
    .min(1)
    .required("Minimum order quantity is required")
    .integer()
    .min(1, "Minimum order quantity is required"),
  lotSize: Yup.number()
    .integer()
    .min(1)
    .required("Lot Size is required")
    .integer()
    .min(1, "Lot Size is required"),
  org: Yup.object().shape({
    label: Yup.string().required("Item Organization is required"),
    value: Yup.string().required("Item Organization is required"),
  }),
});
// const initValue = {
//   org: { label: "", value: "" },
//   maxLeadDays: 0,
//   minLeadDays: 0,
//   minOrderQuantity: 0,
//   desc: "",
//   isMrp: false,
//   hsCode: "",
//   lotSize: 0,
//   purchaseDescription: basicItemInfo[0]?.itemName,
// };

export default function _Form({
  initData,
  saveBtnRef,
  saveData,
  resetBtnRef,
  disableHandler,
  selectedBusinessUnit,
  accountId,
  basicItemInfo,
}) {
  const [, setOrgList] = useState("");
  useEffect(() => {
    if (selectedBusinessUnit && accountId) {
      getInfoData(selectedBusinessUnit.value, accountId);
    }
  }, [selectedBusinessUnit, accountId]);

  const getInfoData = async (buId, accId) => {
    try {
      const res = await Axios.get(
        `/item/ItemPurchaseInfo/GetPurchaseOrganizationDDL?AccountId=${accId}&BusinessUnitId=${buId}`
      );
      const { data: resData, status } = res;
      if (status === 200 && resData.length) {
        let orgs = [];
        resData.forEach((item) => {
          let items = {
            value: item?.value,
            label: item?.label,
          };
          orgs.push(items);
        });
        setOrgList(orgs);
        orgs = null;
      }
    } catch (error) {
     
    }
  };

  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={{
          ...initData,
          purchaseDescription: basicItemInfo
            ? basicItemInfo[0]?.itemName
            : initData?.purchaseDescription,
        }}
        validationSchema={DataValiadtionSchema}
        onSubmit={(values, { resetForm }) => {
          saveData(values, () => {
            resetForm(initData);
          });
        }}
      >
        {({
          handleSubmit,
          resetForm,
          values,
          handleChange,
          errors,
          touched,
          setFieldValue,
          isValid,
        }) => (
          <>
            {disableHandler(!isValid)}
            <Form className="form form-label-right">
            <div className="row mb-1">
                <div className="col-lg-3">
                  <label>Purchase Organization</label>
                  <div>{values?.org?.label || "......."}</div>
                </div>

                <div className="col-lg-3">
                  <label>Purchase Description</label>
                  <div>{values?.purchaseDescription || "......."}</div>
                </div>

                <div className="col-lg-3">
                  <label>HS Code</label>
                  <div>{values?.hscode || "......."}</div>
                </div>

                <div className="col-lg-3">
                  <label>Maximum Lead Days</label>
                  <div>{values?.maxLeadDays || "......."}</div>
                </div>

                <div className="col-lg-3">
                <label>Minimum Order Quantity</label>
                  <div>{values?.minOrderQuantity || "......."}</div>
                </div>

                <div className="col-lg-3">
                <label>Lot Size</label>
                  <div>{values?.lotSize || "......."}</div>
                </div>
              </div>

              <button
                type="submit"
                style={{ display: "none" }}
                ref={saveBtnRef}
                onSubmit={() => handleSubmit()}
              ></button>

              <button
                type="reset"
                style={{ display: "none" }}
                ref={resetBtnRef}
                onSubmit={() => resetForm(initData)}
              ></button>
            </Form>
          </>
        )}
      </Formik>
    </>
  );
}
