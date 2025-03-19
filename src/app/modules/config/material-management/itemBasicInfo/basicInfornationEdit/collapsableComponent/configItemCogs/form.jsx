import React, { useEffect, useState } from "react";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { Input } from "../../../../../../../../_metronic/_partials/controls";
import Axios from "axios";
import Select from "react-select";
import customStyles from "../../../../../../selectCustomStyle";

const DataValiadtionSchema = Yup.object().shape({
  numCostPrice: Yup.number()
    .integer()
    .min(1)
    .required("Minimum Cost Price is required"),

  warehouse: Yup.object().shape({
    label: Yup.string().required("Item Organization is required"),
    value: Yup.string().required("Item Organization is required"),
  }),
});

export default function _Form({
  fetchCostWarehouse,
  isViewPage,
  initData,
  saveBtnRef,
  saveData,
  resetBtnRef,
  disableHandler,
  selectedBusinessUnit,
  accountId,
  itemId,
  setter,
  rowDto,
}) {
  const [warehouseDDL, setwarehouseDDL] = useState([]);

  const getInfoData = async (accId, buId, itemId) => {
    try {
      const res = await Axios.get(
        `/wms/ItemPlantWarehouse/WarehouselistbyItem?AccountId=${accId}&BusinessUnit=${buId}&ItemId=${itemId}`
      );
      const { data: resData, status } = res;
      console.log("payload ",res)
      if (status === 200 && resData.length) {
        let orgs = [];
        resData.forEach((item) => {
          let items = {
            value: item.warehouseId,
            label: item.warehouseName,
          };
          orgs.push(items);
        });
        setwarehouseDDL(orgs);
        orgs = null;
      }
    } catch (error) {
     
    }
  };
  useEffect(() => {
    if (selectedBusinessUnit && accountId && itemId) {
      getInfoData(accountId, selectedBusinessUnit.value, itemId);
    }
  }, [selectedBusinessUnit, accountId, itemId,fetchCostWarehouse]);

  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={initData}
        validationSchema={DataValiadtionSchema}
        onSubmit={(values, { resetForm }) => {
          saveData(values, () => {
            resetForm(initData);
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
              {!isViewPage && (<div className="form-group row global-form">
                <div className="col-lg-3">
                  <label>Select Warehouse</label>
                  <Field
                    name="warehouse"
                    component={() => (
                      <Select
                        options={warehouseDDL || { value: "", label: "" }}
                        placeholder="Select Warehouse"
                        value={
                          values?.warehouse || { value: "", label: "" }
                        }
                        onChange={(valueOption) => {
                          setFieldValue("warehouse", valueOption);
                        }}
                        // isSearchable={true}

                        styles={customStyles}
                        name="org"
                        // isDisabled={!warehouseDDL}
                      />
                    )}
                    placeholder="Select Warehouse"
                    label="Select Warehouse"
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
                    {errors && errors.warehouse && touched && touched.warehouse
                      ? errors.warehouse.value
                      : ""}
                  </p>
                </div>
                <div className="col-lg-3">
                  <Field
                    value={values?.numCostPrice || ""}
                    name="numCostPrice"
                    component={Input}
                    placeholder="Costing Price"
                    label="Costing Price"
                    type="number"
                    min="0"
                  />
                </div>

                {/* <div className="col-lg-3 mt-6">
                  <label htmlFor="is">Manual Costing</label>
                  <Field
                    name="isManualCosting"
                    component={() => (
                      <input
                        style={{
                          position: "absolute",
                          top: "8px",
                        }}
                        id="isManualCosting"
                        type="checkbox"
                        className="ml-2"
                        value={values?.isManualCosting}
                        checked={values?.isManualCosting}
                        name="isManualCosting"
                        onChange={(e) => {
                          setFieldValue("isManualCosting", e.target.checked);
                        }}
                      />
                    )}
                  />
                </div> */}
                <div className="col-lg-3">
                  <button
                    disabled={
                      !values?.warehouse ||
                      !values?.numCostPrice
                    }
                    type="button"
                    onClick={() => {
                      const obj = {
                        warehouseId: values?.warehouse?.value,
                        warehouseName: values?.warehouse?.label,
                        numCostPrice: values?.numCostPrice,
                        isManualCosting: false //values?.isManualCosting,
                      };
                      setter(obj);
                    }}
                    style={{ marginTop: "23px" }}
                    className="btn btn-primary"
                  >
                    Add
                  </button>
                </div>
              </div>)}

              {/* rowDto table */}
              <div className="table-responsive">
                <table className="table table-striped table-bordered my-5 global-table">
                  <thead>
                    <tr className="text-center">
                      <th>SL</th>
                      <th>Warehouse</th>
                      <th>Costing Price</th>
                      {/* <th>Manual Costing</th> */}
                    </tr>
                  </thead>
                  <tbody>
                    {rowDto.length > 0 &&
                      rowDto.map((itm, i) => (
                        <tr key={i}>
                          <td>{i + 1}</td>
                          <td>
                            <div className="pl-2">{itm?.warehouseName}</div>
                          </td>
                          <td>
                            <div className="text-center pr-2">
                              {itm?.numCostPrice}
                            </div>
                          </td>
                          {/* <td>
                            <div className="pl-2">
                              {itm?.isManualCosting ? "Yes" : "No"}
                            </div>
                          </td> */}
                        </tr>
                      ))}
                  </tbody>
                </table>
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
                onSubmit={() => resetForm(initData)}
              ></button>
            </Form>
          </>
        )}
      </Formik>
    </>
  );
}
