import React, { useEffect, useState } from "react";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { Input } from "../../../../../../_metronic/_partials/controls";
import Axios from "axios";
import Select from "react-select";
import customStyles from "../../../../selectCustomStyle";
import AddGrid from "./addGrid";
import { useSelector } from "react-redux";
import shortid from "shortid";

// Validation schema
const initDataEditSchema = Yup.object().shape({
  priceStructureName: Yup.string()
    .min(2, "Minimum 2 symbols")
    .max(100, "Maximum 100 symbols")
    .required("Price StructureName is required"),
  priceStructureCode: Yup.string()
    .min(2, "Minimum 2 symbols")
    .max(50, "Maximum 50 symbols")
    .required("Price StructureCode is required"),
});
const initData = {
  //id: shortid(),
  priceComponent: { label: "", value: "", typeId: "" },
  valueType: "",
  numValue: 0,
  baseComponent: { label: "", value: "" },
  serialNo: 0,
  sumFromSerial: 0,
  sumToSerial: 0,
  isMannual: false,
};

export default function _Form({ data, btnRef, saveData, resetBtnRef }) {
  const [structureType, setStructureType] = useState([]);
  const [pcDDL, setPcDDL] = useState([]);
  const [rowDto, setRowDto] = useState({
    0: {
      ...initData,
    },
  });
  useEffect(() => {
    Axios.get("/item/PriceStructure/GetPriceStructureTypeDDL")
      .then((res) => {
        const { status, data } = res;
        if (status === 200 && data) {
          let items = [];
          data.forEach((itm) => {
            let temp = {
              value: itm.id,
              label: itm.name,
            };
            items.push(temp);
          });
          setStructureType(items);
        }
      })
      .catch((err) => {
       
      });
  }, []);
  const selectedBusinessUnit = useSelector(
    (state) => state.authData.selectedBusinessUnit
  );
  const profileData = useSelector((state) => state.authData.profileData);
  const getPriceComponentDdl = (priceStructId) => {
    if (selectedBusinessUnit?.value && profileData?.accountId) {
      Axios.get(
        `/item/PriceComponent/GetPriceComponentDDL?AccountId=${profileData?.accountId}&BusinessUnitId=${selectedBusinessUnit?.value}&PriceStructureTypeId=${priceStructId}`
      )
        .then((res) => {
          const { status, data } = res;
          if (status === 200 && data) {
            let items = [];
            data.forEach((itm) => {
              let temp = {
                value: itm.priceComponentId,
                label: itm.priceComponentName,
                priceComponentTypeId: itm.priceComponentTypeId,
              };
              items.push(temp);
            });
            setPcDDL(items);
          }
        })
        .catch((err) => {
         
        });
    }
  };

  const [row, setRow] = useState([
    {
      id: shortid(),
    },
  ]);

  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={data}
        validationSchema={initDataEditSchema}
        onSubmit={(values, { setSubmitting, resetForm }) => {
          saveData({ ...values, rowDto }, () => {
            resetForm(data);
            setRowDto({
              0: {
                ...initData,
              },
            });
            setRow([
              {
                id: shortid(),
              },
            ]);
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
                    value={values.priceStructureName || ""}
                    name="priceStructureName"
                    component={Input}
                    placeholder="Structure Name"
                    label="Structure Name"
                    // errors={errors}
                  />
                </div>
                <div className="col-lg-4">
                  <Field
                    value={values.priceStructureCode || ""}
                    name="priceStructureCode"
                    component={Input}
                    placeholder="Code"
                    label="Code"
                  />
                </div>
                <div className="col-lg-4">
                  <label>Structure For</label>

                  <Field
                    name="priceStructureType"
                    component={() => (
                      <Select
                        options={structureType}
                        placeholder="Select Itemss Type"
                        value={values?.priceStructureType}
                        onChange={(valueOption) => {
                          setFieldValue("priceStructureType", valueOption);
                          getPriceComponentDdl(valueOption?.value);
                        }}
                        isSearchable={true}
                        styles={customStyles}
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
                    {errors?.priceStructureType?.value}
                  </p>
                </div>
              </div>

              {/* Add table row grid */}
              <AddGrid
                row={row}
                setRow={setRow}
                setRowDto={setRowDto}
                rowDto={rowDto}
                pcDDL={pcDDL}
              />

              <button
                type="submit"
                style={{ display: "none" }}
                ref={btnRef}
                onSubmit={() => handleSubmit()}
                // disabled={true}
              ></button>

              <button
                type="reset"
                style={{ display: "none" }}
                ref={resetBtnRef}
                onSubmit={() => resetForm(data)}
              ></button>
            </Form>
          </>
        )}
      </Formik>
    </>
  );
}
