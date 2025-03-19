import React, { useEffect, useState } from "react";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { Input } from "../../../../../../_metronic/_partials/controls";
import Axios from "axios";
import Select from "react-select";
import customStyles from "../../../../selectCustomStyle";
import { useSelector, shallowEqual } from "react-redux";
import { PlantWarehouseTable } from "../plantWarehouseTable/plantWarehouseTableCard";

// Validation schema
const ProductEditSchema = Yup.object().shape({
  plantName: Yup.object().shape({
    label: Yup.string().required("Plant is required"),
    value: Yup.string().required("Plant is required"),
  }),
  warehouseName: Yup.object().shape({
    label: Yup.string().required("Warehouse is required"),
    value: Yup.string().required("Warehouse is required"),
  }),
});

export default function _Form({
  product,
  btnRef,
  saveBusinessUnit,
  resetBtnRef,
  accountId,
  selectedBusinessUnit,
}) {
  const [lngList, setLng] = useState("");
  const [currencyList, setCurrency] = useState("");

  const profileData = useSelector((state) => {
    return state.authData.profileData;
  }, shallowEqual);

  useEffect(() => {
    if (selectedBusinessUnit && accountId) {
      getInfoData(profileData.userId, accountId, selectedBusinessUnit.value);
    }
  }, [selectedBusinessUnit, accountId, profileData.userId]);

  const getInfoData = async (userId, accid, businessUnitId) => {
    try {
      const [lng, crnc] = await Promise.all([
        Axios.get(
          `/wms/BusinessUnitPlant/GetOrganizationalUnitUserPermission?UserId=${userId}&AccId=${accid}&BusinessUnitId=${businessUnitId}&OrgUnitTypeId=7`
        ),
        Axios.get(
          `/wms/Warehouse/GetWarehouseInfo?accountId=${accid}&businessUnitId=${businessUnitId}&status=true`
        ),
      ]);
      const { data, status } = lng;
      if (status === 200 && data) {
        const languageList = [];
        data &&
          data.forEach((item) => {
            let items = {
              value: item?.value,
              label: item?.label,
            };
            languageList.push(items);
          });
        setLng(languageList);
      }

      const { data: crncData, status: crncStatus } = crnc;
      if (crncStatus === 200 && crncData) {
        const currencyListTemp = [];
        crncData &&
          crncData.forEach((item) => {
            let items = {
              value: item.warehouseId,
              label: item.warehouseName,
            };
            currencyListTemp.push(items);
          });
        setCurrency(currencyListTemp);
      }
    } catch (error) {
      console.log(error);
    }
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
              <div className="form-group row">
                <div className="col-lg-4">
                  <Field
                    value={selectedBusinessUnit.label} //{values.businessUnitName || ""}
                    name="businessUnitName"
                    component={Input}
                    placeholder="Business Unit"
                    label="Business Unit"
                    disabled="true"
                  />
                </div>
                <div className="col-lg-4">
                  <label>Plant</label>
                  <Field
                    name="plantName"
                    component={() => (
                      <Select
                        options={lngList}
                        placeholder="Select Plant"
                        value={values?.plantName}
                        onChange={(valueOption) => {
                          setFieldValue("plantName", valueOption);
                        }}
                        isSearchable={true}
                        styles={customStyles}
                      />
                    )}
                    placeholder="Plant"
                    label="Plant"
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
                    {errors && errors.plantName && touched && touched.plantName
                      ? errors.plantName.value
                      : ""}
                  </p>
                </div>

                <div className="col-lg-4">
                  <label>Warehouse</label>
                  <Field
                    name="warehouseName"
                    component={() => (
                      <Select
                        value={values.warehouseName}
                        options={currencyList}
                        placeholder="Select Warehouse"
                        onChange={(valueOption) => {
                          setFieldValue("warehouseName", valueOption);
                        }}
                        isSearchable={true}
                        styles={customStyles}
                        name="warehouseName"
                      />
                    )}
                    placeholder="Warehouse"
                    label="Warehouse"
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
                    touched.warehouseName &&
                    errors && errors.warehouseName
                      ? errors.warehouseName.value
                      : ""}
                  </p>
                </div>
              </div>
              <PlantWarehouseTable />
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
