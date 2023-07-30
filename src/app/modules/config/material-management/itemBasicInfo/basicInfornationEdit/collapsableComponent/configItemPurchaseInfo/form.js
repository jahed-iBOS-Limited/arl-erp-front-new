import React, { useEffect, useState } from "react";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { Input } from "../../../../../../../../_metronic/_partials/controls";
import Axios from "axios";
import InputField from "../../../../../../_helper/_inputField";
// import Select from "react-select";
// import customStyles from "../../../../../../selectCustomStyle";

const DataValiadtionSchema = Yup.object().shape({
  // maxLeadDays: Yup.number()
  //   .required("Maximum lead days is required")
  //   .integer()
  //   .min(1, "Maximum lead days is required"),

  // minOrderQuantity: Yup.number()
  //   .integer()
  //   .min(1)
  //   .required("Minimum order quantity is required")
  //   .integer()
  //   .min(1, "Minimum order quantity is required"),
  // lotSize: Yup.number()
  //   .integer()
  //   .min(1)
  //   .required("Lot Size is required")
  //   .integer()
  //   .min(1, "Lot Size is required"),
  // org: Yup.object().shape({
  //   label: Yup.string().required("Item Organization is required"),
  //   value: Yup.string().required("Item Organization is required"),
  // }),
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
  const [orgList, setOrgList] = useState("");
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
              <div className="form-group row global-form">
                {/* <div className="col-lg-3">
                  <label>Select Purchase Organization</label>
                  <Field
                    name="org"
                    component={() => (
                      <Select
                        options={orgList || { value: "", label: "" }}
                        placeholder="Select Purchase Organization"
                        defaultValue={values.org || { value: "", label: "" }}
                        onChange={(valueOption) => {
                          setFieldValue("org", valueOption);
                        }}
                        isSearchable={true}
                        styles={customStyles}
                        name="org"
                        isDisabled={!orgList}
                      />
                    )}
                    placeholder="Select Plant"
                    label="Select Plant"
                  />
                  <p
                    style={{
                      fontSize: "0.9rem",
                      fontWeight: 400,
                      width: "100%",
                      marginTop: "0.25rem",
                    }}
                    className="text-danger"
                  >
                    {errors && errors.org && touched && touched.org
                      ? errors.org.value
                      : ""}
                  </p>
                </div> */}

                <div className="col-lg-3">
                  <Field
                    value={values.purchaseDescription || ""}
                    name="purchaseDescription"
                    component={Input}
                    placeholder="Purchase Description"
                    label="Purchase Description"
                    disabled={!orgList}
                  />
                </div>

                <div className="col-lg-3">
                  <Field
                    value={values.hscode || ""}
                    name="hscode"
                    component={Input}
                    placeholder="HS Code"
                    label="HS Code"
                    disabled={!orgList}
                  />
                </div>

                <div className="col-lg-3">
                  <Field
                    value={values.maxLeadDays || ""}
                    name="maxLeadDays"
                    component={Input}
                    placeholder="Maximum Lead Days"
                    label="Maximum Lead Days"
                    type="number"
                    disabled={!orgList}
                    min="0"
                  />
                </div>

                <div className="col-lg-3">
                  <Field
                    value={values.minOrderQuantity || ""}
                    name="minOrderQuantity"
                    component={Input}
                    placeholder="Minimum Order Quantity"
                    label="Minimum Order Quantity"
                    type="number"
                    disabled={!orgList}
                    min="0"
                  />
                </div>

                <div className="col-lg-3">
                  <Field
                    value={values.lotSize || ""}
                    name="lotSize"
                    component={Input}
                    placeholder="Lot Size "
                    label="Lot Size "
                    type="number"
                    disabled={!orgList}
                    min="0"
                  />
                </div>
                <div className="col-lg-3">
                  <InputField
                    name="minimumStockQuantity"
                    value={values?.minimumStockQuantity}
                    label="Minimum Stock Quantity"
                    step='any'
                    onChange={(e) => {
                      if(+e.target.value <= 0){
                        setFieldValue("minimumStockQuantity", "");
                        return;
                      }
                      setFieldValue("minimumStockQuantity", e.target.value);
                    }}
                    type="number"
                    errors={errors}
                    touched={touched}
                  />
                </div>
                <div className="col-lg-3">
                  <InputField
                    name="safetyStockQuantity"
                    value={values?.safetyStockQuantity}
                    label="Safety Stock Quantity"
                    step='any'
                    onChange={(e) => {
                      if(+e.target.value <= 0){
                        setFieldValue("safetyStockQuantity", "");
                        return ;
                      }
                      setFieldValue("safetyStockQuantity", e.target.value);
                    }}
                    type="number"
                    errors={errors}
                    touched={touched}
                  />
                </div>
                <div className="col-lg-3">
                  <InputField
                    name="maximumQuantity"
                    value={values?.maximumQuantity}
                    label="Maximum Quantity"
                    step='any'
                    onChange={(e) => {
                      if(+e.target.value <= 0){
                        setFieldValue("maximumQuantity", "");
                        return ;
                      }
                      setFieldValue("maximumQuantity", e.target.value);
                    }}
                    type="number"
                    errors={errors}
                    touched={touched}
                  />
                </div>
                <div className="col-lg-3">
                  <InputField
                    name="reorderQuantity"
                    value={values?.reorderQuantity}
                    label="Reorder Quantity"
                    step='any'
                    onChange={(e) => {
                      if(+e.target.value <= 0){
                        setFieldValue("reorderQuantity", "");
                        return ;
                      }
                      setFieldValue("reorderQuantity", e.target.value);
                    }}
                    type="number"
                    errors={errors}
                    touched={touched}
                  />
                </div>
                <div className="col-lg-3">
                  <InputField
                    name="reorderLevel"
                    value={values?.reorderLevel}
                    label="Reorder Level"
                    step='any'
                    onChange={(e) => {
                      setFieldValue("reorderLevel", e.target.value);
                    }}
                    type="text"
                    errors={errors}
                    touched={touched}
                  />
                </div>
                <div
                  style={{
                    marginTop: "27px",
                  }}
                  className="col-lg-3"
                >
                  <Field
                    name="isMrp"
                    component={() => (
                      <input
                        style={{
                          position: "absolute",
                          top: "7px",
                        }}
                        id="isMrp"
                        type="checkbox"
                        value={values?.isMrp || false}
                        checked={values?.isMrp || false}
                        name="isMrp"
                        disabled={!orgList}
                        onChange={(e) => {
                          setFieldValue("isMrp", e.target.checked);
                        }}
                      />
                    )}
                  />
                  <label htmlFor="isMrp" className="ml-5">
                    Include in MRP Planning?
                  </label>
                </div>
                <p className="text-danger my-2">
                  {!orgList && "Not found any purchase organization"}
                </p>
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
