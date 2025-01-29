/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { Input } from "../../../../../../_metronic/_partials/controls";
import Axios from "axios";
import Select from "react-select";
import { useSelector, shallowEqual } from "react-redux";
import customStyles from "../../../../selectCustomStyle";

// Validation schema
const ProductEditSchema = Yup.object().shape({
  inventoryLocationName: Yup.string()
    .min(2, "Minimum 2 symbols")
    .max(100, "Maximum 100 symbols")
    .required("Location is required"),
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
  disableHandler,
  inventoryLocationName,
  accountId,
  selectedBusinessUnit,
  lastDisabled,
}) {
  const [lngList, setLng] = useState("");
  const [currencyList, setCurrency] = useState([]);

  const profileData = useSelector((state) => {
    return state.authData.profileData;
  }, shallowEqual);

  useEffect(() => {
    if (selectedBusinessUnit && accountId) {
      getInfoData(profileData.userId,accountId, selectedBusinessUnit.value);
    }
  }, [selectedBusinessUnit, accountId]);

  const getInfoData = async (userId,accid, businessUnitId) => {
    try {
      const [lng] = await Promise.all([
        Axios.get(
          `/wms/BusinessUnitPlant/GetOrganizationalUnitUserPermission?UserId=${userId}&AccId=${accid}&BusinessUnitId=${businessUnitId}&OrgUnitTypeId=7`
        ),
        // Axios.get(
        //   `/wms/BusinessUnitPlant/GetOrganizationalUnitUserPermission?UserId=${userId}&AccId=${accid}&BusinessUnitId=${businessUnitId}&OrgUnitTypeId=8`
        // ),
      ]);
      const { data, status } = lng;
      if (status === 200 && data) {
        // const languageList = [];
        // data &&
        //   data.forEach((item) => {
        //     let items = {
        //       value: item.plantId,
        //       label: item.plantName,
        //     };
        //     languageList.push(items);
        //   });
        setLng(data);
      }
    } catch (error) {
     
    }
  };

  const getWareHouseDDL_api = async (plantId) => {
    const res = await Axios.get(`/wms/BusinessUnitPlant/GetOrganizationalUnitUserPermissionforWearhouse?UserId=${profileData?.userId}&AccId=${profileData.accountId}&BusinessUnitId=${selectedBusinessUnit?.value}&PlantId=${plantId}&OrgUnitTypeId=8`);
    const { data, status } = res;
    if (status === 200) {
      setCurrency(data);
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
                  <label>Plant</label>
                  <Field
                    name="plantName"
                    component={() => (
                      <Select
                        options={lngList || []}
                        placeholder="Select Plant"
                        value={values?.plantName}
                        isDisabled={lastDisabled}
                        onChange={(valueOption) => {
                          setFieldValue("plantName", valueOption);
                          setFieldValue("warehouseName", "");
                          getWareHouseDDL_api(valueOption?.value);
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
                        isDisabled={lastDisabled}
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
                    errors &&
                    errors.warehouseName
                      ? errors.warehouseName.value
                      : ""}
                  </p>
                </div>

                <div className="col-lg-4">
                  <Field
                    value={values.inventoryLocationName || ""}
                    name="inventoryLocationName"
                    component={Input}
                    placeholder="Location"
                    label="Location"
                    disabled={inventoryLocationName}
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
