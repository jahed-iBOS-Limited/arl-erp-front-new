/* eslint-disable react-hooks/exhaustive-deps */
import Axios from "axios";
import { Field, Form, Formik } from "formik";
import React, { useEffect, useState } from "react";
import Select from "react-select";
import * as Yup from "yup";
import { Input } from "../../../../../../../../_metronic/_partials/controls";
import NewSelect from "../../../../../../_helper/_select";
import customStyles from "../../../../../../selectCustomStyle";

const DataValiadtionSchema = Yup.object().shape({
  numGrossWeight: Yup.number().required("Gross Weight (Kg) required"),
  numNetWeight: Yup.string().required("Net Weight (Kg) required"),
  // conversionBaseUom:Yup.number().min(2,"Minimum Value Conversion Base Uom"),
  plant: Yup.object().shape({
    label: Yup.string().required("Plant is required"),
    value: Yup.string().required("Plant is required"),
  }),
  baseUom: Yup.object().shape({
    label: Yup.string().required("Base Uom is required"),
    value: Yup.string().required("Base Uom is required"),
  }),
});

export default function _Form({
  isViewPage,
  productData,
  saveBtnRef,
  saveData,
  resetBtnRef,
  disableHandler,
  setter,
  defaultSetter,
  rowDto,
  defaultRowDto,
  remover,
  defaultRemover,
  baseSetter,
  accountId,
  selectedBusinessUnit,
  userId,
  isEdit,
}) {
  const [plantList, setPlantList] = useState([]);
  const [whList, setWhList] = useState([]);
  const [inventoryLocationList, setInventoryLocationList] = useState([]);
  const [baseUomList, setBaseUomList] = useState([]);
  const [altUomOption, setAltUomOption] = useState([]);

  useEffect(() => {
    if (accountId && selectedBusinessUnit) {
      getPlantItemPlantWareHouseDDL(
        userId,
        accountId,
        selectedBusinessUnit?.value
      );
      getItemUOMDDL(accountId, selectedBusinessUnit?.value);
    }
  }, [selectedBusinessUnit, accountId]);

  useEffect(() => {
    if (accountId && selectedBusinessUnit?.value && productData?.plant?.value) {
      whApiCaller(
        accountId,
        selectedBusinessUnit?.value,
        productData?.plant?.value
      );
    }
  }, [selectedBusinessUnit, accountId, productData]);

  useEffect(() => {
    if (accountId && selectedBusinessUnit?.value && plantList[0]?.value) {
      whApiCaller(accountId, selectedBusinessUnit?.value, plantList[0]?.value);
    }
  }, [selectedBusinessUnit, accountId, plantList]);

  // useEffect(() => {
  //   if (
  //     accountId &&
  //     selectedBusinessUnit?.value &&
  //     productData?.plant?.value &&
  //     productData?.warehouse?.value
  //   ) {
  //     inventoryLocationAPiCaller(
  //       productData?.warehouse?.value,
  //       productData?.plant?.value
  //     );
  //   }
  // }, [selectedBusinessUnit, accountId, productData]);

  const getPlantItemPlantWareHouseDDL = async (
    userId,
    accId,
    businessUnitId
  ) => {
    try {
      const res = await Axios.get(
        `/wms/BusinessUnitPlant/GetOrganizationalUnitUserPermission?UserId=${userId}&AccId=${accId}&BusinessUnitId=${businessUnitId}&OrgUnitTypeId=7`
      );
      const { status, data } = res;
      if (status === 200 && data.length) {
        // const plants = [];
        // data &&
        //   data.forEach((item) => {
        //     let items = {
        //       value: item?.plantId,
        //       label: item?.plantName,
        //     };
        //     plants.push(items);
        //   });
        setPlantList(data);
      }
    } catch (error) {}
  };
  const getItemUOMDDL = async (accountId, businessUnitId) => {
    try {
      const res = await Axios.get(
        `/item/ItemUOM/GetItemUOMByAccountIdBusinessUnitId?AccountId=${accountId}&BusinessUnitId=${businessUnitId}`
      );
      const { status, data } = res;
      if (status === 200 && data.length) {
        const baseUoms = [];
        data &&
          data.forEach((item) => {
            let items = {
              value: item.uomid,
              label: item.uomName,
            };
            baseUoms.push(items);
          });
        setBaseUomList(baseUoms);
      }
    } catch (error) {}
  };

  const whApiCaller = async (accountId, businessUnitId, v) => {
    try {
      const res = await Axios.get(
        `/wms/ConfigPlantWearHouse/GetWareHouseDDL?AccountId=${accountId}&BusinessUnitId=${businessUnitId}&PlantId=${v}`
      );

      const newData = res?.data?.map((item) => ({
        value: item.value,
        label: item.label,
      }));

      setWhList(newData);
    } catch (error) {
      setWhList([]);
    }
  };

  // Get inventory location by warehouseid and plantid
  const inventoryLocationAPiCaller = async (whid, plantId) => {
    const res = await Axios.get(
      `/wms/InventoryLocation/GetInventoryLocationDDL?AccountId=${accountId}&BusinessUnitId=${selectedBusinessUnit.value}&plantId=${plantId}&WhId=${whid}`
    );
    const { status, data } = res;
    if (status && data.length) {
      let inventoryLocations = [];
      data &&
        data.forEach((item) => {
          let items = {
            value: item?.value,
            label: item?.label,
          };
          inventoryLocations.push(items);
        });
      setInventoryLocationList(inventoryLocations);
      inventoryLocations = null;
    }
  };

  const altUomSetting = (v) => {
    let altUoms = [];
    baseUomList &&
      baseUomList.forEach((item) => {
        let items = {
          value: item.value,
          label: item.label,
          isDisabled: item.value === v,
        };
        altUoms.push(items);
      });
    setAltUomOption(altUoms);
    altUoms = null;
  };

  useEffect(() => {
    altUomSetting(productData.baseUomid);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [baseUomList, productData]);
  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={{
          ...productData,
          plant: {
            value: plantList ? plantList[0]?.value : "",
            label: plantList ? plantList[0]?.label : "",
          },
          baseUom: {
            value: rowDto ? rowDto[0]?.baseUomId : "",
            label: rowDto ? rowDto[0]?.baseUomName : "",
          },
          isMultipleUom: rowDto?.length > 1 ? true : false,
        }}
        validationSchema={DataValiadtionSchema}
        onSubmit={(values, { setSubmitting, resetForm }) => {
          saveData(values, () => {
            resetForm(productData);
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
                <div className="form-group row align-content-center my-5">
                  <div className="col-lg-3 mb-1 p-1">
                    <NewSelect
                      name="plant"
                      options={plantList || []}
                      value={values?.plant}
                      label="Select Plant"
                      onChange={(valueOption) => {
                        setFieldValue("warehouse", "");
                        setFieldValue("inventoryLocation", "");
                        whApiCaller(
                          accountId,
                          selectedBusinessUnit?.value,
                          valueOption?.value
                        );
                        setFieldValue("plant", valueOption);
                      }}
                      placeholder="Select Plant"
                      errors={errors}
                      touched={touched}
                    />
                  </div>
                  <div className="col-lg-3">
                    <label>Select Warehouse</label>
                    <Field
                      component={() => (
                        <Select
                          options={whList}
                          placeholder="Select Warehouse"
                          value={values?.warehouse}
                          onChange={(valueOption) => {
                            setFieldValue("inventoryLocation", "");
                            setFieldValue("warehouse", valueOption);
                            inventoryLocationAPiCaller(
                              valueOption?.value,
                              values?.plant?.value
                            );
                          }}
                          isSearchable={true}
                          styles={customStyles}
                          isDisabled={!whList?.length}
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
                      errors.warehouse &&
                      touched &&
                      touched.warehouse
                        ? errors.warehouse.value
                        : ""}
                    </p>
                  </div>
                  <div className="col-lg-3">
                    <label>Select Inventory Location</label>
                    <Field
                      name="inventoryLocation"
                      component={() => (
                        <Select
                          options={inventoryLocationList}
                          placeholder="Select Inventory Location"
                          value={values.inventoryLocation}
                          onChange={(valueOption) => {
                            setFieldValue("inventoryLocation", valueOption);
                          }}
                          isSearchable={true}
                          styles={customStyles}
                          isDisabled={!whList.length}
                          name="inventoryLocation"
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
                      errors.inventoryLocation &&
                      touched &&
                      touched.inventoryLocation
                        ? errors.inventoryLocation.value
                        : ""}
                    </p>
                  </div>
                  <div className="col-lg-3">
                    <button
                      disabled={
                        !values?.plant?.value ||
                        !values?.warehouse?.value ||
                        !values?.inventoryLocation?.value
                      }
                      type="button"
                      onClick={() => {
                        const obj = {
                          plantId: values?.plant?.value,
                          plantName: values?.plant?.label,
                          warehouseId: values?.warehouse?.value,
                          wareHouseName: values?.warehouse?.label,
                          inventoryLocationId: values?.inventoryLocation?.value,
                          inventoryLocationName:
                            values?.inventoryLocation?.label,
                        };
                        defaultSetter(obj);
                      }}
                      style={{ marginTop: "23px" }}
                      className="btn btn-primary"
                    >
                      Add
                    </button>
                  </div>
                </div>
              )}
              <div className="common-scrollable-table two-column-sticky">
              <div className="scroll-table _table">
                <table className="table table-striped table-bordered my-5">
                  <thead>
                    <tr className="text-center">
                      <th>SL</th>
                      <th>Plant</th>
                      <th>Warehouse</th>
                      <th>Location</th>
                      <th>Bin Numberdsadasd</th>
                      <th style={{ width: "200px" }}>
                          Minimum Stock Quantity
                        </th>
                        <th style={{ width: "200px" }}>
                          {" "}
                          Safety Stock Quantity
                        </th>
                        <th style={{ width: "200px" }}> Maximum Qty</th>
                        <th style={{ width: "200px" }}> Reorder Level</th>
                        <th style={{ width: "200px" }}>Reorder Qty</th>
                        <th style={{ width: "200px" }}>Avg Daily Consumption</th>
                        <th style={{ width: "200px" }}>Max Lead Days</th>
                        <th style={{ width: "200px" }}>Min Lead Days</th>
                      {/* <th>UoM</th> */}
                      {/* <th>Action</th> */}
                    </tr>
                  </thead>
                  <tbody>
                    {defaultRowDto &&
                      defaultRowDto.map((itm, i) => (
                        <tr
                          key={i}
                          style={{ marginBottom: "15px", textAlign: "center" }}
                        >
                          <td>{i + 1}</td>
                          <td>{itm?.plantName}</td>
                          <td>{itm?.wareHouseName}</td>
                          <td>{itm?.inventoryLocationName}</td>
                          <td>{itm?.binNumber}</td>
                          <td>{itm?.minimumStockQuantity}</td>
                          <td>{itm?.safetyStockQuantity}</td>
                          <td>{itm?.maximumQuantity}</td>
                          <td>{itm?.reorderLevel}</td>
                          <td>{itm?.reorderQuantity}</td>
                          <td>{itm?.averageDailyConsumption}</td>
                          <td>{itm?.maxLeadDays}</td>
                          <td>{itm?.minLeadDays}</td>

                          {/* <td>
                            <span
                              className="pointer alterUomDeleteIcon"
                              style={{
                                width: "50%",
                                marginTop: "3px",
                              }}
                            >
                              <i
                                onClick={() => defaultRemover(i)}
                                className="fa fa-trash"
                                aria-hidden="true"
                              ></i>
                            </span>
                          </td> */}
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
              </div>
              
              <div className="form-group row align-content-center my-5">
                <div className="col-12">
                  <h6>Unit of Measurement Convertion</h6>
                </div>
                <div className="col-lg-3">
                    <label>Base UOM</label>
                    <div>{values?.baseUom?.label || "......."}</div>
                  </div>
                  <div className="col-lg-3">
                    <label>Select Gross Weight (Kg)</label>
                    <div>{values?.numGrossWeight || "......."}</div>
                  </div>
                  <div className="col-lg-3">
                    <label>Select Net Weight (Kg)</label>
                    <div>{values?.numNetWeight || "......."}</div>
                  </div>
                </div>

              {/* <div
                className={
                  values.isMultipleUom
                    ? "extraListShow extraList"
                    : "extraListHide extraList"
                }
              > */}
              {values.isMultipleUom ? (
                <>
                  {!isViewPage && (<div className="form-group row">
                    <div className="col-lg-4">
                      <label>Alternate UoM</label>
                      <Field
                        name="alternateUom"
                        component={() => (
                          <Select
                            options={altUomOption}
                            placeholder="Select Alternate Uom"
                            value={values?.alternateUom}
                            onChange={(valueOption) => {
                              setFieldValue("alternateUom", valueOption);
                            }}
                            isSearchable={true}
                            styles={customStyles}
                            name="alternateUom"
                          />
                        )}
                        placeholder="Select Alternate Uom"
                        label="Select Alternate Uom"
                      />
                    </div>
                    <div className="col-lg-4">
                      <Field
                        value={values?.conversionBaseUom || ""}
                        name="conversionBaseUom"
                        component={Input}
                        placeholder="Convertion With Base UoM"
                        label="Convertion With Base UoM"
                        type="number"
                        min="0"
                      />
                    </div>
                    <div>
                      <button
                        disabled={
                          !values?.baseUom ||
                          !values?.alternateUom?.value ||
                          !values?.conversionBaseUom
                        }
                        type="button"
                        onClick={() => {
                          const obj = {
                            baseUomId: values?.baseUom.value,
                            baseUomName: values?.baseUom.label,
                            convertedUom: values?.alternateUom.value,
                            convertedUomName: values?.alternateUom.label,
                            numConversionRate: values?.conversionBaseUom,
                          };
                          setter(obj);
                          setFieldValue("alternateUom", {
                            label: "",
                            value: "",
                          });
                          setFieldValue("conversionBaseUom", 0);
                        }}
                        style={{ marginTop: "25px" }}
                        className="btn btn-primary"
                      >
                        Add
                      </button>
                    </div>
                  </div>)}
                  <div className="table-responsive">
                  <table className="table table-striped table-bordered my-5">
                    <thead>
                      <tr className="text-center">
                        <th>SL</th>
                        <th>Base Uom</th>
                        <th>Base Value</th>
                        <th>Alternate UoM</th>
                        <th>Alternate Value</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {rowDto &&
                        rowDto.map((itm, idx) => (
                          <tr
                            key={itm?.sl}
                            style={{
                              marginBottom: "15px",
                              textAlign: "center",
                            }}
                          >
                            <td>{idx + 1}</td>
                            <td>{itm?.baseUomName}</td>
                            <td>{1}</td>
                            <td>{itm?.convertedUomName}</td>
                            <td>{itm?.numConversionRate}</td>
                            <td>
                              {itm?.baseUomName !== itm?.convertedUomName && (
                                <>
                                  <span
                                    className="pointer alterUomDeleteIcon"
                                    style={{
                                      width: "50%",
                                      marginTop: "3px",
                                    }}
                                  >
                                    <i
                                      onClick={() => remover(itm?.convertedUom)}
                                      className="fa fa-trash"
                                      aria-hidden="true"
                                    ></i>
                                  </span>
                                </>
                              )}
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>{" "}
                  </div>
                </>
              ) : null}

              {/* </div> */}

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
                onSubmit={() => resetForm(productData)}
              ></button>
            </Form>
          </>
        )}
      </Formik>
    </>
  );
}
