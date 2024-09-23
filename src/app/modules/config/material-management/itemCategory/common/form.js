import React, { useEffect, useState } from "react";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { Input } from "../../../../../../_metronic/_partials/controls";
import Axios from "axios";
import Select from "react-select";
import customStyles from "../../../../selectCustomStyle";
import NewSelect from "../../../../_helper/_select";

// Validation schema
const ProductEditSchema = Yup.object().shape({
  itemCategoryName: Yup.string()
    .min(2, "Minimum 2 symbols")
    .max(100, "Maximum 100 symbols")
    .required("Item Category is required"),
  itemTypeName: Yup.object().shape({
    label: Yup.string().required("Item Type is required"),
    value: Yup.string().required("Item Type is required"),
  }),
  // generalLedger: Yup.object().when("itemTypeName.label", {
  //   is: label => label !== "Services",
  //   then: Yup.object().shape({
  //     label: Yup.string().required("General Ledger is required"),
  //     value: Yup.string().required("General Ledger is required"),
  //   }),
  //   otherwise: Yup.object().notRequired(),
  // }),
});


export default function _Form({
  product,
  btnRef,
  saveItemCategory,
  resetBtnRef,
  // disableHandler,
  itemCategoryName,
  selectedBusinessUnit,
  profileData,
}) {
  const [itemTypeList, setItemTypeList] = useState("");
  const [itemTypeOption, setItemTypeOption] = useState([]);
  // const [generalLedgerDDL, setGeneralLedgerDDL] = useState([]);

  useEffect(() => {
    getInfoData();
  }, []);

  const getInfoData = async () => {
    try {
      const res = await Axios.get("/item/ItemCategory/GetItemTypeListDDL");
      setItemTypeList(res.data);
    } catch (error) {}
  };

  // const getGeneralLedgerDDL_api = async (groupId) => {
  //   const id = groupId === 10 ? 1 : groupId === 9 ? 12 : 16;
  //   try {
  //     const res = await Axios.get(
  //       `/domain/BusinessUnitGeneralLedger/GetGeneralLedgerForItemCategoryDDL?AccountId=${profileData?.accountId}&BusinessUnitId=${selectedBusinessUnit?.value}&AccountGroupId=${id}`
  //     );
  //     if (res.status === 200 && res?.data) {
  //       const newData = res?.data?.map((itm) => ({
  //         value: itm?.generalLedgerId,
  //         label: itm?.generalLedgerName,
  //       }));
  //       setGeneralLedgerDDL(newData);
  //     }
  //   } catch (error) {}
  // };
  // const getGeneralLedgerDDL_api_forAsset = async (groupId) => {
  //   try {
  //     const res = await Axios.get(
  //       `/domain/BusinessUnitGeneralLedger/GetAssetDepreciationGLDDL?AccountId=${profileData?.accountId}&BusinessUnitId=${selectedBusinessUnit?.value}`
  //     );
  //     if (res.status === 200 && res?.data) {
  //       const newData = res?.data?.map((itm) => ({
  //         value: itm?.generalLedgerId,
  //         label: itm?.generalLedgerName,
  //       }));
  //       setGeneralLedgerDDL(newData);
  //     }
  //   } catch (error) {}
  // };

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

  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={product}
        validationSchema={ProductEditSchema}
        onSubmit={(values, { setSubmitting, resetForm }) => {
          saveItemCategory(values, () => {
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
                {/* <div className="col-lg-4">
                  <Field
                    value={selectedBusinessUnit.label} //{values.businessUnitName || ""}
                    name="businessUnitName"
                    component={Input}
                    placeholder="Business Unit"
                    label="Business Unit"
                    disabled="true"
                  />
                </div> */}
                <div className="col-lg-4">
                  <label>Item Type Name</label>
                  <Field
                    name="itemTypeName"
                    component={() => (
                      <Select
                        options={itemTypeOption}
                        placeholder="Select Item Type"
                        value={values.itemTypeName}
                        onChange={(valueOption) => {
                          // setFieldValue("generalLedger", "");
                          // valueOption?.value === 10
                          //   ? getGeneralLedgerDDL_api_forAsset(
                          //       valueOption?.value
                          //     )
                          //   : getGeneralLedgerDDL_api(valueOption?.value);
                          setFieldValue("itemTypeName", valueOption);
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
                {/* {["Services"]?.includes(values.itemTypeName?.label) ? null : (
                  <div className="col-lg-4">
                    <NewSelect
                      name="generalLedger"
                      options={generalLedgerDDL || []}
                      value={values?.generalLedger}
                      label="General Ledger"
                      onChange={(valueOption) => {
                        setFieldValue("generalLedger", valueOption || "");
                      }}
                      errors={errors}
                      touched={touched}
                    />
                  </div>
                )} */}
                <div className="col-lg-4">
                  <Field
                    name="itemCategoryName"
                    component={Input}
                    placeholder="Item Category Name"
                    label="Item Category Name"
                    disabled={itemCategoryName}
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
