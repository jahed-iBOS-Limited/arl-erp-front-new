import React, { useEffect, useState } from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import Axios from "axios";

// Validation schema
const DataValiadtionSchema = Yup.object().shape({
  itemName: Yup.string()
    .min(2, "Minimum 2 symbols")
    .max(100, "Maximum 100 symbols")
    .required("Business Unit is required"),
  // itemCode: Yup.string()
  //   .min(2, "Minimum 2 symbols")
  //   .max(50, "Maximum 50 symbols")
  //   .required("Code is required"),
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
});

export default function ItemForm({
  data,
  saveBtnRef,
  saveConfigBtnRef,
  saveData,
  resetBtnRef,
  // disableHandler,
  isEdit,
  // isDisabledCode,
  selectedBusinessUnit,
  accountId,
  setSaveConfigBtn,
}) {
  const [itemTypeList, setItemTypeList] = useState("");
  const [itemCategoryList, setItemCategoryList] = useState("");
  const [itemSubCategoryList, setItemSubCategoryList] = useState("");
  const [, setItemTypeOption] = useState([]);
  const [, setItemCategoryOption] = useState([]);
  const [, setItemSubCategoryOption] = useState([]);
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

  useEffect(() => {
    let itemCategory = [];
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

  useEffect(() => {
    let itemSubCategory = [];
    itemSubCategoryList &&
      itemSubCategoryList.forEach((item) => {
        let items = {
          value: item.id,
          label: item.itemSubCategoryName,
        };
        itemSubCategory.push(items);
      });
    setItemSubCategoryOption(itemSubCategory);
  }, [itemSubCategoryList]);

  const categoryApiCaller = async (v) => {
    const res = await Axios.get(
      `/item/ItemCategory/GetItemCategoryDDLByTypeId?AccountId=${accountId}&BusinessUnitId=${selectedBusinessUnit.value}&ItemTypeId=${v}`
    );
    if (res.data) {
      setItemCategoryList(res.data);
    }
  };

  const subcategoryApiCaller = async (v, typeId) => {
    const res = await Axios.get(
      `/item/ItemSubCategory/GetItemSubCategoryDDLByCategoryId?accountId=${accountId}&businessUnitId=${selectedBusinessUnit.value}&itemCategoryId=${v}&typeId=${typeId}`
    );
    if (res.data) {
      setItemSubCategoryList(res.data);
    }
  };

  useEffect(() => {
    if (isEdit && accountId && selectedBusinessUnit.value) {
      categoryApiCaller(data.itemTypeId);
      subcategoryApiCaller(data.itemCategoryId, data.itemTypeId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [accountId, selectedBusinessUnit]);

  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={data}
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
            {/* {disableHandler(!isValid)} */}
            <Form className="form form-label-right">
            <div className="row">
                <div className="col-lg-3">
                  <label>Item Name</label>
                  <div>{values.itemName || "......."}</div>
                </div>

                <div className="col-lg-3">
                  <label>Item Type</label>
                  <div>{values.itemType.label || "......."}</div>
                </div>
                <div className="col-lg-3">
                  <label>Item Category</label>
                  <div>{values.itemCategory.label || "......."}</div>
                </div>
                <div className="col-lg-3">
                  <label>Item Sub-category</label>
                  <div>{values.itemSubCategory.label || "......."}</div>
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
