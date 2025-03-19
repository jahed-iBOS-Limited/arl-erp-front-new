import React, { useEffect, useState } from "react";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { Input } from "../../../../../../_metronic/_partials/controls";
import Axios from "axios";
import Select from "react-select";
import customStyles from "../../../../selectCustomStyle";

// Validation schema
const ProductEditSchema = Yup.object().shape({
  attribute: Yup.string()
    .min(2, "Minimum 2 symbols")
    .max(100, "Maximum 100 symbols")
    .required("Item Attribute is required"),
  itemTypeName: Yup.object().shape({
    label: Yup.string().required("Item Type is required"),
    value: Yup.string().required("Item Type is required"),
  }),
  itemCategoryName: Yup.object().shape({
    label: Yup.string().required("Item Type is required"),
    value: Yup.string().required("Item Type is required"),
  }),
  uom: Yup.object().shape({
    label: Yup.string().required("UoM is required"),
    value: Yup.string().required("UoM is required"),
  }),
});

export default function _Form({
  product,
  btnRef,
  saveWarehouse,
  resetBtnRef,
  itemCategorycode,
  itemCategoryName,
  accountId,
  selectedBusinessUnit,
}) {
  // console.log(product)

  const [itemTypeList, setItemTypeList] = useState("");
  const [itemTypeOption, setItemTypeOption] = useState([]);
  const [itemCategoryOption, setItemCategoryOption] = useState([]);
  const [itemCategoryList, setItemCategoryList] = useState("");
  // update
  const [uomDDL, setUomDDL] = useState([]);
  useEffect(() => {
    getInfoData();
    getItemattibuteUomDDL(accountId, selectedBusinessUnit?.value);
  }, [accountId, selectedBusinessUnit]);
  //GetItemattibuteUomByAttributeId
  const getItemattibuteUomDDL = async (accId, buId) => {
    try {
      const res = await Axios.get(
        `/item/ItemUOM/GetItemUOMDDL?AccountId=${accId}&BusinessUnitId=${buId}`
      );
      setUomDDL(res.data);
    } catch (error) {
     
    }
  };
  //
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

  const categoryApiCaller = async (v) => {
    if (accountId && selectedBusinessUnit) {
      const res = await Axios.get(
        `/item/ItemCategory/GetItemCategoryDDLByTypeId?AccountId=${accountId}&BusinessUnitId=${selectedBusinessUnit.value}&ItemTypeId=${v}`
      );
      setItemCategoryList(res.data);
    }
  };

  useEffect(() => {
    const itemCategory = [];
    itemCategoryList &&
      itemCategoryList.forEach((item) => {
        let items = {
          value: item.itemCategoryId,
          label: item.itemCategoryName,
        };
        itemCategory.push(items);
      });
    setItemCategoryOption(itemCategory);
  }, [itemCategoryList]);

  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={product}
        validationSchema={ProductEditSchema}
        onSubmit={(values, { setSubmitting, resetForm }) => {
          saveWarehouse(values, () => {
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
            <Form className="form form-label-right">
              <div className="form-group row global-form">
                <div className="col-lg-4">
                  <Field
                    name="attribute"
                    component={Input}
                    placeholder="attribute"
                    label="attribute"
                  />
                </div>
                <div className="col-lg-4">
                  <label>UoM</label>

                  <Field
                    name="uom"
                    component={() => (
                      <Select
                        options={uomDDL}
                        placeholder="Uom"
                        value={values.uom}
                        onChange={(valueOption) => {
                          setFieldValue("uom", valueOption);
                        }}
                        isSearchable={true}
                        styles={customStyles}
                        name="uom"
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
                    {errors?.uom?.value}
                  </p>
                </div>
                <div className="col-lg-4">
                  <label>Item Type Name</label>

                  <Field
                    name="itemTypeName"
                    component={() => (
                      <Select
                        options={itemTypeOption}
                        placeholder="Select Itemss Type"
                        value={values.itemTypeName}
                        onChange={(valueOption) => {
                          setFieldValue("itemTypeName", valueOption);
                          categoryApiCaller(valueOption?.value);
                          setFieldValue("itemCategoryName", "");
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
                  <label>Select Item Category</label>
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
