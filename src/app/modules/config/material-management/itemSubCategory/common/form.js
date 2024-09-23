import React, { useEffect, useState } from "react";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { Input } from "../../../../../../_metronic/_partials/controls";
import Axios from "axios";
import Select from "react-select";

import customStyles from "../../../../selectCustomStyle";

// Validation schema
const ProductEditSchema = Yup.object().shape({
  itemSubCategoryName: Yup.string()
    .min(2, "Minimum 2 symbols")
    .max(100, "Maximum 100 symbols")
    .required("Location is required"),
  itemTypeName: Yup.object().shape({
    label: Yup.string().required("Item Type is required"),
    value: Yup.string().required("Item Type is required"),
  }),
  itemCategoryName: Yup.object().shape({
    label: Yup.string().required("Item Category is required"),
    value: Yup.string().required("Item Category is required"),
  }),
});

export default function _Form({
  product,
  btnRef,
  saveBusinessUnit,
  resetBtnRef,
  // disableHandler,
  plantCode,
  itemSubCategoryName,
  isEdit,
  accountId,
  selectedBusinessUnit,
}) {
  // console.log(product)

  const [itemTypeList, setItemTypeList] = useState("");
  const [itemTypeOption, setItemTypeOption] = useState([]);
  const [itemCategoryOption, setItemCategoryOption] = useState([]);
  // console.log(selectedCrncOption);

  useEffect(() => {
    getInfoData();
  }, []);

  const getInfoData = async () => {
    try {
      const res = await Axios.get("/item/ItemCategory/GetItemTypeListDDL");
      setItemTypeList(res.data);
    } catch (error) {
     
    }
  };

  useEffect(() => {
    const itemTypes = [];
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

  const categoryApiCaller = async (itemTypeId) => {
    const res = await Axios.get(
      `/item/MasterCategory/GetItemMasterCategoryDDL?AccountId=${accountId}&ItemTypeId=${itemTypeId}`
    );
    setItemCategoryOption(res.data);
  };

  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={product}
        validationSchema={ProductEditSchema}
        onSubmit={(values, { setSubmitting, resetForm }) => {
          saveBusinessUnit(values, () => {
            resetForm(product);
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
           
            {/* {disableHandler(!isValid)} */}
            <Form className="form form-label-right">
              <div className="form-group row global-form">
                <div className="col-lg-4">
                  <label>Item Type Name</label>
                  <Field
                    name="itemTypeName"
                    component={() => (
                      <Select
                        options={itemTypeOption}
                        placeholder="Select Itemss Type"
                        value={values?.itemTypeName}
                        onChange={(valueOption) => {
                          setFieldValue("itemTypeName", valueOption);
                          categoryApiCaller(valueOption?.value);
                        }}
                        isSearchable={true}
                        styles={customStyles}
                        name="itemTypeName"
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
                    {errors?.itemTypeName?.value}
                  </p>
                </div>

                <div className="col-lg-4">
                  <label>Category</label>
                  <Field
                    name="itemCategoryName"
                    component={() => (
                      <Select
                        options={itemCategoryOption}
                        placeholder="Select Item Category"
                        value={values.itemCategoryName}
                        onChange={(valueOption) => {
                          setFieldValue("itemCategoryName", valueOption);
                        }}
                        isSearchable={true}
                        styles={customStyles}
                        isDisabled={!itemCategoryOption.length}
                        name="itemCategoryName"
                      />
                    )}
                    placeholder="Category"
                    label="Category"
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
                    touched.itemCategoryName &&
                    errors && errors.itemCategoryName
                      ? errors.itemCategoryName.value
                      : ""}
                  </p>
                </div>

                <div className="col-lg-4">
                  <Field
                    value={values.itemSubCategoryName || ""}
                    name="itemSubCategoryName"
                    component={Input}
                    placeholder="Item Sub-Category"
                    label="Item Sub-Category"
                    disabled={itemSubCategoryName}
                  />
                </div>
              </div>
              <button
                type="submit"
                style={{ display: "none" }}
                ref={btnRef}
                onSubmit={() => handleSubmit()}
              ></button>

              <button
                type="reset"
                style={{ display: "none" }}
                ref={resetBtnRef}
                onSubmit={() => resetForm(product)}
              ></button>
            </Form>
          </>
        )}
      </Formik>
    </>
  );
}
