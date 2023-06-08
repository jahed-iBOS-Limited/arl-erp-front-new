import React, { useEffect, useState } from "react";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { Input } from "../../../../../../_metronic/_partials/controls";
import Axios from "axios";
import NewSelect from "../../../../_helper/_select";

// Validation schema
const ProductEditSchema = Yup.object().shape({
  priceComponentName: Yup.string()
    .min(2, "Minimum 2 symbols")
    .max(100, "Maximum 100 symbols")
    .required("Name is required"),
  priceComponentCode: Yup.string()
    .min(2, "Minimum 2 symbols")
    .max(100, "Maximum 100 symbols")
    .required("Code is required"),

  priceComponentType: Yup.object().shape({
    label: Yup.string().required("Component Type is required"),
    value: Yup.string().required("Component Type is required"),
  }),
  factor: Yup.object().shape({
    label: Yup.string().required("Factor is required"),
    value: Yup.string().required("Factor is required"),
  }),
  roundingType: Yup.object().shape({
    label: Yup.string().required("Rounding Type is required"),
    value: Yup.string().required("Rounding Type is required"),
  }),
  generalledger: Yup.object().shape({
    label: Yup.string().required("General Ledger is required"),
    value: Yup.string().required("General Ledger is required"),
  }),
});

const FactorDDL = [
  {
    value: 1,
    label: "Positive",
  },
  {
    value: -1,
    label: "Negative",
  },
];

export default function _Form({
  product,
  btnRef,
  saveWarehouse,
  resetBtnRef,
  accountId,
  selectedBusinessUnit,
}) {
  const [itemTypeList, setItemTypeList] = useState("");
  const [roundingTypeList, setRoundingTypeList] = useState("");
  const [generalLedgerList, setgeneralLedgerList] = useState("");
  // price stucture type ddl
  const priceStuctureTypeDDL = [
    { value: 1, label: "Pruchase" },
    { value: 2, label: "Sales" },
  ];
  useEffect(() => {
    getInfoData();
  }, []);
  useEffect(() => {
    getroundingTypeData();
  }, []);
  useEffect(() => {
    getgeneralledgerdata(accountId, selectedBusinessUnit.value);
  }, [accountId, selectedBusinessUnit]);

  const getInfoData = async () => {
    try {
      const res = await Axios.get(
        "/item/PriceComponent/GetPriceComponentTypeDDL"
      );
      const { status, data } = res;
      if (status === 200 && data.length) {
        let ItemType = [];
        data &&
          data.forEach((item) => {
            let items = {
              value: item.priceComponentTypeId,
              label: item.priceComponentTypeName,
            };
            ItemType.push(items);
          });
        setItemTypeList(ItemType);
      }
    } catch (error) {
     
    }
  };

  const getroundingTypeData = async () => {
    try {
      const res = await Axios.get("/item/PriceComponent/GetRoundingTypeDDL");
      const { status, data } = res;
      if (status === 200 && data.length) {
        let roundingType = [];
        data &&
          data.forEach((item) => {
            let items = {
              value: item.roundingTypeId,
              label: item.roundingTypeName,
            };
            roundingType.push(items);
          });
        setRoundingTypeList(roundingType);
        roundingType = null;
      }
    } catch (error) {
     
    }
  };

  const getgeneralledgerdata = async (accId, buId) => {
    try {
      const res = await Axios.get(
        `/domain/BusinessUnitGeneralLedger/GetGeneralLedgerDDL?AccountId=${accId}&BusinessUnitId=${buId}&AccountGroupId=0`
      );
      const { status, data } = res;
      console.log(data)
      if (status === 200 && data && data.length) {
        let roundingType = [];
        data.forEach((item) => {
          let items = {
            value: item.generalLedgerId,
            label: item.generalLedgerName,
          };
          roundingType.push(items);
        });
        setgeneralLedgerList(roundingType);
        roundingType = null;
      }
    } catch (error) {
     
    }
  };

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
          setValues,
          isValid,
        }) => (
          <>
            <Form className="form form-label-right">
              <div className="form-group row global-form">
                <div className="col-lg-4">
                  <Field
                    value={values.priceComponentName || ""}
                    name="priceComponentName"
                    component={Input}
                    placeholder="Component Name"
                    label="Component Name"
                  />
                </div>
                <div className="col-lg-4">
                  <Field
                    name="priceComponentCode"
                    component={Input}
                    placeholder="Code"
                    label="Code"
                    value={values.priceComponentCode || ""}
                  />
                </div>
                <div className="col-lg-4">
                  <NewSelect
                    name="priceComponentType"
                    options={itemTypeList}
                    value={values?.priceComponentType}
                    label="Select Price Component Type"
                    onChange={(valueOption) => {
                      if (valueOption?.value === 1) {
                        setValues({
                          ...values,
                          priceComponentType: valueOption,
                          factor: {
                            label: "Positive",
                            value: 1,
                          },
                          roundingType: {
                            label: "No Rounding",
                            value: 2,
                          },
                          generalledger: {
                            label: "null",
                            value: 0,
                          },
                        });
                        return;
                      } else if (valueOption?.value === 6) {
                        setValues({
                          ...values,
                          priceComponentType: valueOption,
                          factor: {
                            label: "Positive",
                            value: 1,
                          },
                          roundingType: {
                            label: "No Rounding",
                            value: 2,
                          },
                          generalledger: {
                            label: "null",
                            value: 0,
                          },
                        });
                        return;
                      } else {
                        setValues({
                          ...values,
                          priceComponentType: valueOption,
                          factor: {
                            label: "",
                            value: "",
                          },
                          roundingType: {
                            label: "",
                            value: "",
                          },
                        });
                        return;
                      }
                    }}
                    placeholder="Select Price Component Type"
                    errors={errors}
                    touched={touched}
                  />
                </div>
                <div className="col-lg-4">
                  <NewSelect
                    name="factor"
                    options={FactorDDL}
                    value={values?.factor}
                    label="Factor"
                    onChange={(valueOption) => {
                      setFieldValue("factor", valueOption);
                    }}
                    placeholder="Select Factor"
                    errors={errors}
                    touched={touched}
                    isDisabled={
                      values?.priceComponentType?.value === 6 ||
                      values?.priceComponentType?.value === 1
                    }
                  />
                </div>
                <div className="col-lg-4">
                  <NewSelect
                    name="roundingType"
                    options={roundingTypeList}
                    value={values?.roundingType}
                    label="Rounding Type"
                    onChange={(valueOption) => {
                      setFieldValue("roundingType", valueOption);
                    }}
                    placeholder="Select Rounding Type"
                    errors={errors}
                    touched={touched}
                    isDisabled={
                      values?.priceComponentType?.value === 6 ||
                      values?.priceComponentType?.value === 1
                    }
                  />
                </div>
                <div className="col-lg-4">
                  <NewSelect
                    name="generalledger"
                    options={generalLedgerList}
                    value={values?.generalledger}
                    label="General Ledger"
                    onChange={(valueOption) => {
                      setFieldValue("generalledger", valueOption);
                    }}
                    placeholder="Select General Ledger"
                    errors={errors}
                    touched={touched}
                    isDisabled={values?.priceComponentType?.value === 1 || values?.priceComponentType?.value === 6}
                  />
                </div>
                <div className="col-lg-4">
                  <NewSelect
                    name="priceStuctureTypeDDL"
                    options={priceStuctureTypeDDL}
                    value={values?.priceStuctureTypeDDL}
                    label="Price Structure Type"
                    onChange={(valueOption) => {
                      setFieldValue("priceStuctureTypeDDL", valueOption);
                    }}
                    placeholder="price Stucture Type DDL"
                    errors={errors}
                    touched={touched}
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
