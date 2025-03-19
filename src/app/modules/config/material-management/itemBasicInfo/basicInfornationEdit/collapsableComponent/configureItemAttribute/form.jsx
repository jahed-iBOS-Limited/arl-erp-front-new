import React, { useEffect, useState } from "react";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { Input } from "../../../../../../../../_metronic/_partials/controls";
import Axios from "axios";
import Select from "react-select";
import customStyles from "../../../../../../selectCustomStyle";

const DataValiadtionSchema = Yup.object().shape({
  attribute: Yup.object().shape({
    label: Yup.string().required("Attribute is required"),
    value: Yup.string().required("Attribute is required"),
  }),
  uom: Yup.object().shape({
    label: Yup.string().required("Uom is required"),
    value: Yup.string().required("Uom is required"),
  }),
  value: Yup.string().required("Value is required"),
});

const intiValue = {
  attribute: "",
  uom: "",
  value: "",
};

export default function _Form({
  isViewPage,
  data,
  saveBtnRef,
  saveData,
  resetBtnRef,
  disableHandler,
  removeAlterUom,
  setDataToState,
  itemId,
  accountId,
  businessUnitId,
  actionBy,
}) {
  const [attributeList, setAttributeList] = useState("");
  const [baseUomList, setBaseUomList] = useState([]);
  const [attributeOption, setAttributeOption] = useState([]);

  useEffect(() => {
    if (businessUnitId && accountId) {
      const getInfoData = async () => {
        try {
          const [res] = await Promise.all([
            Axios.get(
              `/item/ItemAttriute/GetItemAttributeDDL?AccountId=${accountId}&BusinessUnitId=${businessUnitId}`
            ),
          ]);
          setAttributeList(res.data);
          // setBaseUomList(res2.data);
        } catch (error) {}
      };
      getInfoData();
    }
  }, [accountId, businessUnitId]);

  const getInfoDataTwo = async (attributeId, setFieldValue) => {
    try {
      const res2 = await Promise.all([
        Axios.get(
          `/item/ItemBasic/GetItemattibuteUomByAttributeId?AttributeId=${attributeId}`
        ),
      ]);
      setFieldValue("uom", res2[0]?.data);
      setBaseUomList([res2[0]?.data]);
    } catch (error) {}
  };

  useEffect(() => {
    let attributes = [];
    attributeList &&
      attributeList.forEach((item) => {
        let items = {
          value: item.itemAttributeId,
          label: item.itemAttributeName,
        };
        attributes.push(items);
      });
    setAttributeOption(attributes);
    attributes = null;
  }, [attributeList]);

  // useEffect(() => {
  //   let baseUom = [];
  //   baseUomList &&
  //     baseUomList.forEach((item) => {
  //       let items = {
  //         value: item.uomid,
  //         label: item.uomName,
  //       };
  //       baseUom.push(items);
  //     });
  //   setBaseUomOption(baseUom);
  //   baseUom = null;
  // }, [baseUomList]);

  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={intiValue}
        validationSchema={DataValiadtionSchema}
        onSubmit={(values, { setSubmitting, resetForm }) => {
          saveData(data, () => {
            resetForm(intiValue);
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
              {!isViewPage && (
                <div className="form-group row global-form">
                  <div className="col-lg-3">
                    <label>Select Attribute</label>
                    <Field
                      name="attribute"
                      component={() => (
                        <Select
                          options={attributeOption}
                          value={values?.attribute}
                          placeholder="Select Attribute"
                          onChange={(valueOption) => {
                            setFieldValue("attribute", valueOption);
                            getInfoDataTwo(valueOption?.value, setFieldValue);
                          }}
                          isSearchable={true}
                          styles={customStyles}
                          name="attribute"
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
                      errors.attribute &&
                      touched &&
                      touched.attribute
                        ? errors.attribute.value
                        : ""}
                    </p>
                  </div>
                  <div className="col-lg-3">
                    <label>Select UoM</label>
                    <Field
                      name="uom"
                      component={() => (
                        <Select
                          options={baseUomList}
                          value={values?.uom}
                          onChange={(valueOption) => {
                            setFieldValue("uom", valueOption);
                          }}
                          isSearchable={true}
                          styles={customStyles}
                          name="uom"
                          placeholder="Select UoM"
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
                      {errors && errors.uom && touched && touched.uom
                        ? errors.uom.value
                        : ""}
                    </p>
                  </div>
                  <div className="col-lg-3">
                    <Field
                      value={values.value || ""}
                      name="value"
                      component={Input}
                      placeholder="Value"
                      label="Value"
                    />
                  </div>
                  <div className="col-lg-3">
                    <button
                      disabled={
                        !values.attribute?.value || !values.value || !values.uom
                      }
                      type="button"
                      onClick={() => {
                        const obj = {
                          attributeValue: values.value,
                          attributeUom: values.uom.label,
                          attributeUomId: values.uom.value,
                          attributeName: values.attribute.label,
                          attributeId: values.attribute.value,
                          itemId: +itemId,
                          accountId: accountId,
                          actionBy,
                          businessUnitId,
                          isActive: true,
                        };
                        setDataToState(obj);
                      }}
                      style={{ marginTop: "25px" }}
                      className="btn btn-primary"
                    >
                      Add
                    </button>
                  </div>
                </div>
              )}
              <div className="table-responsive">
              <table className="table table-striped table-bordered global-table">
                <thead>
                  <tr className="text-center">
                    <th>SL</th>
                    <th>Attribute</th>
                    <th>UoM</th>
                    <th>Value</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {data &&
                    data.map((itm, idx) => (
                      <tr
                        key={idx}
                        style={{ marginBottom: "15px", textAlign: "center" }}
                      >
                        <td>{idx + 1}</td>
                        <td>{itm.attributeName}</td>
                        <td>{itm.attributeUom}</td>
                        <td>{itm.attributeValue}</td>

                        <td>
                          <span
                            className="pointer alterUomDeleteIcon"
                            style={{
                              width: "50%",
                              marginTop: "3px",
                            }}
                          >
                            <i
                              onClick={() => removeAlterUom(itm.attributeId)}
                              className="fa fa-trash"
                              aria-hidden="true"
                            ></i>
                          </span>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
              </div>

              <button
                type="submit"
                style={{ display: "none" }}
                ref={saveBtnRef}
                onSubmit={() => alert("Testing")}
              ></button>

              <button
                type="reset"
                style={{ display: "none" }}
                ref={resetBtnRef}
                onSubmit={() => resetForm(intiValue)}
              ></button>
            </Form>
          </>
        )}
      </Formik>
    </>
  );
}
