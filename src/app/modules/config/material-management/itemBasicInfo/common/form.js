import React, { useEffect, useState } from "react";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { Input } from "../../../../../../_metronic/_partials/controls";
import Axios from "axios";
import Select from "react-select";
import customStyles from "../../../../selectCustomStyle";

// Validation schema
const DataValiadtionSchema = Yup.object().shape({
  itemName: Yup.string().when("businessUnit", {
    is: (businessUnit) =>
      businessUnit === 12 ||
      businessUnit === 17 ||
      businessUnit === 102 ||
      businessUnit === 117,
    then: Yup.string()
      .min(2, "Minimum 2 symbols")
      .max(500, "Maximum 500 symbols")
      .required("Item Name is required"),
    otherwise: Yup.string()
      .min(2, "Minimum 2 symbols")
      .max(150, "Maximum 150 symbols")
      .required("Item Name is required"),
  }),
  itemType: Yup.object().shape({
    label: Yup.string().required("Item Type is required"),
    value: Yup.string().required("Item Type is required"),
  }),
  itemCategory: Yup.object().shape({
    label: Yup.string().required("Category is required"),
    value: Yup.string().required("Category is required"),
  }),
  itemSubCategory: Yup.object().shape({
    label: Yup.string().required("Sub-category is required"),
    value: Yup.string().required("Sub-category is required"),
  }),
  purchaseOrg: Yup.object().shape({
    label: Yup.string().required("Purchase Organization is required"),
    value: Yup.string().required("Purchase Organization is required"),
  }),
});

export default function _Form({
  data,
  saveBtnRef,
  saveConfigBtnRef,
  saveData,
  resetBtnRef,
  isEdit,
  selectedBusinessUnit,
  accountId,
  setSaveConfigBtn,
  id,
  isWorkable,
  purchaseOrg,
}) {
  const [itemTypeList, setItemTypeList] = useState("");
  const [itemCategoryList, setItemCategoryList] = useState("");
  const [itemSubCategoryList, setItemSubCategoryList] = useState("");
  const [itemTypeOption, setItemTypeOption] = useState([]);
  useEffect(() => {
    getInfoData();
  }, []);

  const getInfoData = async () => {
    try {
      const res = await Axios.get("/item/ItemCategory/GetItemTypeListDDL");
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
    const res = await Axios.get(
      `/item/MasterCategory/GetItemMasterCategoryDDL?AccountId=${accountId}&ItemTypeId=${typeId}`
    );
    if (res.data) {
      setItemCategoryList(res.data);
    }
  };

  const subcategoryApiCaller = async (categoryId, typeId) => {
    const res = await Axios.get(
      `/item/MasterCategory/GetItemMasterSubCategoryDDL?AccountId=${accountId}&ItemMasterCategoryId=${categoryId}&ItemMasterTypeId=${typeId}`
    );
    if (res.data) {
      setItemSubCategoryList(res.data);
    }
  };
  // /item/MasterCategory/GetItemMasterCategoryDDL?AccountId=1

  // useEffect(() => {
  //   if (isEdit && accountId && selectedBusinessUnit.value) {
  //     categoryApiCaller(data.itemTypeId);
  //     subcategoryApiCaller(data.itemCategoryId, data.itemTypeId);
  //   }
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [accountId, selectedBusinessUnit]);

  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={{ ...data, businessUnit: selectedBusinessUnit?.value }}
        validationSchema={DataValiadtionSchema}
        onSubmit={(values, { setSubmitting, resetForm }) => {
          saveData(values, () => {
            resetForm(data);
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
            <Form className="form form-label-right">
              <div className="form-group row global-form">
                <div className="col-lg-3">
                  <Field
                    value={values?.itemName || ""}
                    name="itemName"
                    component={Input}
                    placeholder="Item Name"
                    label="Item Name"
                  />
                </div>
                {selectedBusinessUnit?.value === 102 && (
                  <>
                    <div className="col-lg-3">
                      <Field
                        value={values.itemCode || ""}
                        name="itemCode"
                        component={Input}
                        placeholder="IMPA Code"
                        label="IMPA Code"
                      />
                    </div>
                    <div className="col-lg-3">
                      <Field
                        value={values.drawingCode || ""}
                        name="drawingCode"
                        component={Input}
                        placeholder="Drawing Code"
                        label="Drawing Code"
                      />
                    </div>
                    <div className="col-lg-3">
                      <Field
                        value={values.partNo || ""}
                        name="partNo"
                        component={Input}
                        placeholder="Part No"
                        label="Part No"
                      />
                    </div>
                  </>
                )}
                <div className="col-lg-3">
                  <label>Select Item Type</label>
                  <Field
                    name="itemType"
                    component={() => (
                      <Select
                        options={itemTypeOption}
                        placeholder="Select Item Type"
                        value={values?.itemType}
                        onChange={(valueOption) => {
                          categoryApiCaller(valueOption?.value);
                          setFieldValue("itemCategory", "");
                          setFieldValue("itemType", valueOption);
                        }}
                        isSearchable={true}
                        styles={customStyles}
                      />
                    )}
                    placeholder="Select Item Type"
                    label="Select Item Type"
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
                    {errors && errors.itemType && touched && touched.itemType
                      ? errors.itemType.value
                      : ""}
                  </p>
                </div>
                <div className="col-lg-3">
                  <label>Select Item Category</label>
                  <Field
                    component={() => (
                      <Select
                        options={itemCategoryList}
                        placeholder="Select Item Category"
                        value={values?.itemCategory}
                        onChange={(valueOption) => {
                          setFieldValue("itemSubCategory", "");
                          subcategoryApiCaller(
                            valueOption?.value,
                            values.itemType.value
                          );
                          setFieldValue("itemCategory", valueOption);
                        }}
                        isSearchable={true}
                        styles={customStyles}
                        isDisabled={!values?.itemType}
                      />
                    )}
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
                    {errors &&
                    errors.itemCategory &&
                    touched &&
                    touched.itemCategory
                      ? errors.itemCategory.value
                      : ""}
                  </p>
                </div>
                <div className="col-lg-3">
                  <label>Select Item Sub-category</label>
                  <Field
                    component={() => (
                      <Select
                        value={values?.itemSubCategory}
                        options={itemSubCategoryList}
                        placeholder="Select Item Sub-category"
                        onChange={(valueOption) => {
                          setFieldValue("itemSubCategory", valueOption);
                        }}
                        isSearchable={true}
                        styles={customStyles}
                        name="itemSubCategory"
                        isDisabled={!values?.itemCategory || !values?.itemType}
                      />
                    )}
                  />
                  <p
                    style={{
                      fontSize: "0.9rem",
                      fontWeight: 400,
                      marginTop: "0.25rem",
                      width: "100%",
                    }}
                    className="text-danger"
                  >
                    {touched &&
                    touched?.itemSubCategory &&
                    errors &&
                    errors?.itemSubCategory
                      ? errors?.itemSubCategory.value
                      : ""}
                  </p>
                </div>
                <div className="col-lg-3">
                  <label>Select Purchase Organization</label>
                  <Field
                    component={() => (
                      <Select
                        value={values?.purchaseOrg}
                        options={purchaseOrg}
                        placeholder="Purchase Organization"
                        onChange={(valueOption) => {
                          setFieldValue("purchaseOrg", valueOption);
                        }}
                        styles={customStyles}
                        name="purchaseOrg"
                      />
                    )}
                  />
                  <p
                    style={{
                      fontSize: "0.9rem",
                      fontWeight: 400,
                      marginTop: "0.25rem",
                      width: "100%",
                    }}
                    className="text-danger"
                  >
                    {touched &&
                    touched?.purchaseOrg &&
                    errors &&
                    errors?.purchaseOrg
                      ? errors?.purchaseOrg.value
                      : ""}
                  </p>
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
                onSubmit={() => resetForm(data)}
              ></button>

              <button
                type="submit"
                style={{ display: "none" }}
                ref={saveConfigBtnRef}
                onClick={() => setSaveConfigBtn(true)}
              ></button>
            </Form>
          </>
        )}
      </Formik>
    </>
  );
}
