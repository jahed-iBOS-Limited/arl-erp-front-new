import { Form, Formik } from "formik";
import React, { useEffect, useState } from "react";
import { shallowEqual, useSelector } from "react-redux";
import IDelete from "../../../_helper/_helperIcons/_delete";
import useAxiosGet from "../../../_helper/customHooks/useAxiosGet";
import useAxiosPost from "../../../_helper/customHooks/useAxiosPost";
import IForm from "./../../../_helper/_form";
import InputField from "./../../../_helper/_inputField";
import Loading from "./../../../_helper/_loading";
import NewSelect from "./../../../_helper/_select";
import {
  addHandler,
  initData,
  intDataForEdit,
  saveHandler,
  typeDDL,
} from "./helper";
import FormikError from "../../../_helper/_formikError";
import axios from "axios";
import SearchAsyncSelect from "../../../_helper/SearchAsyncSelect";

export default function DirectAndDumpRateEntry({ id, getLandingData }) {
  const [objProps, setObjprops] = useState({});
  const [shippointDDL, getShippointDDL] = useAxiosGet();
  const [, createEditHandler, saveLoading] = useAxiosPost();
  const [rowDto, getRowDto, loading, setRowDto] = useAxiosGet();
  const { profileData, selectedBusinessUnit } = useSelector((state) => {
    return state.authData;
  }, shallowEqual);

  useEffect(() => {
    if (id) {
      getRowDto(
        `/wms/ShipPoint/GetGoDownNothersRateById?businessUnitId=${selectedBusinessUnit?.value}&Id=${id}`
      );
    }
    getShippointDDL(
      `/wms/ShipPoint/GetShipPointDDL?accountId=${profileData?.accountId}&businessUnitId=${selectedBusinessUnit?.value}`
    );

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profileData, selectedBusinessUnit]);

  return (
    <Formik
      enableReinitialize={true}
      initialValues={id ? intDataForEdit(rowDto) : initData}
      // validationSchema={}
      onSubmit={(values, { setSubmitting, resetForm }) => {
        saveHandler(rowDto, createEditHandler, () => {
          resetForm(initData);
          setRowDto([]);
          getLandingData(
            `/wms/ShipPoint/GetAllGoDownNothersRate?businessUnitId=${selectedBusinessUnit?.value}&Type=1&searchTerm=`
          );
        });
      }}
    >
      {({
        handleSubmit,
        resetForm,
        values,
        setFieldValue,
        isValid,
        errors,
        touched,
      }) => (
        <>
          {(saveLoading || loading) && <Loading />}
          <IForm
            title={
              id ? "Edit Direct and Dump Rate" : "Create Direct and Dump Rate"
            }
            getProps={setObjprops}
            isHiddenBack={true}
            isHiddenReset={true}
          >
            <Form>
              <div className="form-group  global-form row">
                <div className="col-lg-3">
                  <NewSelect
                    name="type"
                    options={typeDDL}
                    value={values?.type}
                    label="Type"
                    onChange={(valueOption) => {
                      setFieldValue("type", valueOption);
                    }}
                    errors={errors}
                    touched={touched}
                    isDisabled={id}
                  />
                </div>
                <div className="col-lg-3">
                  <NewSelect
                    name="shipPoint"
                    options={shippointDDL}
                    value={values?.shipPoint}
                    label="Ship Point"
                    onChange={(valueOption) => {
                      setFieldValue("shipPoint", valueOption);
                    }}
                    errors={errors}
                    touched={touched}
                    isDisabled={id}
                  />
                </div>
                <div className="col-lg-3">
                  <label>Supplier</label>
                  <SearchAsyncSelect
                    selectedValue={values.supplier}
                    isDisabled={id}
                    handleChange={(valueOption) => {
                      setFieldValue("supplier", valueOption);
                    }}
                    loadOptions={(v) => {
                      if (v.length < 3) return [];
                      return axios
                        .get(
                          `/procurement/PurchaseOrder/GetSupplierListDDL?Search=${v}&AccountId=${profileData?.accountId}&UnitId=${selectedBusinessUnit?.value}&SBUId=0`
                        )
                        .then((res) => {
                          const updateList = res?.data.map((item) => ({
                            ...item,
                          }));
                          return updateList;
                        });
                    }}
                  />
                  <FormikError
                    errors={errors}
                    name="supplier"
                    touched={touched}
                  />
                </div>
                <div className="col-lg-3">
                  <InputField
                    value={values?.directDeliveryRate}
                    label="Direct Delivery Rate"
                    name="directDeliveryRate"
                    type="number"
                    onChange={(e) => {
                      setFieldValue("directDeliveryRate", e.target.value);
                    }}
                    disabled={id}
                  />
                </div>
                <div className="col-lg-3">
                  <InputField
                    value={values?.dumpDeliveryRate}
                    label="Dump Delivery Rate"
                    name="dumpDeliveryRate"
                    type="number"
                    onChange={(e) => {
                      setFieldValue("dumpDeliveryRate", e.target.value);
                    }}
                    disabled={id}
                  />
                </div>
                <div className="col-lg-3">
                  <InputField
                    value={values?.decDamToTruckRate}
                    label="Dump To Truck Rate"
                    name="decDamToTruckRate"
                    type="number"
                    onChange={(e) => {
                      setFieldValue("decDamToTruckRate", e.target.value);
                    }}
                    disabled={id}
                  />
                </div>
                <div className="col-lg-3">
                  <InputField
                    value={values?.decTruckToDamRate}
                    label="Truck To Dam Rate"
                    name="decTruckToDamRate"
                    type="number"
                    onChange={(e) => {
                      setFieldValue("decTruckToDamRate", e.target.value);
                    }}
                    disabled={id}
                  />
                </div>
                <div className="col-lg-3">
                  <InputField
                    value={values?.decLighterToBolgateRate}
                    label="Lighter To Bolgate Rate"
                    name="decLighterToBolgateRate"
                    type="number"
                    onChange={(e) => {
                      setFieldValue("decLighterToBolgateRate", e.target.value);
                    }}
                    disabled={id}
                  />
                </div>
                <div className="col-lg-3">
                  <InputField
                    value={values?.decBolgateToDamRate}
                    label="Bolgate To DamRate"
                    name="decBolgateToDamRate"
                    type="number"
                    onChange={(e) => {
                      setFieldValue("decBolgateToDamRate", e.target.value);
                    }}
                    disabled={id}
                  />
                </div>
                <div className="col-lg-3">
                  <InputField
                    value={values?.decTruckToDamOutSideRate}
                    label="Truck To Dam Outside Rate"
                    name="decTruckToDamOutSideRate"
                    type="number"
                    onChange={(e) => {
                      setFieldValue("decTruckToDamOutSideRate", e.target.value);
                    }}
                    disabled={id}
                  />
                </div>
                <div className="col-lg-3">
                  <InputField
                    value={values?.decBiwtarate}
                    label="BIWTA Rate"
                    name="decBiwtarate"
                    type="number"
                    onChange={(e) => {
                      setFieldValue("decBiwtarate", e.target.value);
                    }}
                    disabled={id}
                  />
                </div>
                <div className="col-lg-3">
                  <InputField
                    value={values?.decShipSweepingRate}
                    label="Ship Sweeping Rate"
                    name="decShipSweepingRate"
                    type="number"
                    onChange={(e) => {
                      setFieldValue("decShipSweepingRate", e.target.value);
                    }}
                    disabled={id}
                  />
                </div>
                <div className="col-lg-3">
                  <InputField
                    value={values?.decScaleRate}
                    label="Scale Rate"
                    name="decScaleRate"
                    type="number"
                    onChange={(e) => {
                      setFieldValue("decScaleRate", e.target.value);
                    }}
                    disabled={id}
                  />
                </div>
                <div className="col-lg-3">
                  <InputField
                    value={values?.decDailyLaboureRate}
                    label="Daily Labor Rate"
                    name="decDailyLaboureRate"
                    type="number"
                    onChange={(e) => {
                      setFieldValue("decDailyLaboureRate", e.target.value);
                    }}
                    disabled={id}
                  />
                </div>
                <div className="col-lg-3">
                  <InputField
                    value={values?.decOthersCostRate}
                    label="Others Cost Rate"
                    name="decOthersCostRate"
                    type="number"
                    onChange={(e) => {
                      setFieldValue("decOthersCostRate", e.target.value);
                    }}
                    disabled={id}
                  />
                </div>
                <div>
                  <button
                    disabled={
                      !values?.type ||
                      !values?.shipPoint ||
                      !values?.supplier ||
                      id
                    }
                    style={{ marginTop: "18px" }}
                    type="button"
                    className="btn btn-primary"
                    onClick={() => {
                      addHandler({
                        values,
                        rowDto,
                        setRowDto,
                        userId: profileData?.userId,
                        buId: selectedBusinessUnit?.value,
                      });
                    }}
                  >
                    Add
                  </button>
                </div>
              </div>
              <div className="mt-5">
                {rowDto?.length > 0 && (
                  <>
                    <div className="table-responsive">
                      <table className="table table-striped table-bordered inv-table">
                        <thead>
                          <tr>
                            <th>SL</th>
                            <th>Supplier</th>
                            <th>Direct Delivery Rate</th>
                            <th>Dump Delivery Rate</th>
                            <th>Dam To Truck Rate</th>
                            <th>Truck To Dam Rate</th>
                            <th>Lighter To Bolgate Rate</th>
                            <th>Bolgate To DamRate</th>
                            <th>Truck To Dam Outside Rate</th>
                            <th>BIWTA Rate</th>
                            <th>Ship Sweeping Rate</th>
                            <th>Scale Rate</th>
                            <th>Daily Labor Rate</th>
                            <th>Others Cost Rate</th>
                            {id ? null : <th>Action</th>}
                          </tr>
                        </thead>
                        <tbody>
                          {rowDto?.map((item, index) => (
                            <tr key={index}>
                              <td className="text-center">{index + 1}</td>
                              <td
                                style={{ minWidth: "140px" }}
                                className="text-center"
                              >
                                {item?.strSupplierName}
                              </td>
                              <td className="text-center">
                                {id ? (
                                  <InputField
                                    value={item?.decDirectRate}
                                    name="decDirectRate"
                                    type="number"
                                    onChange={(e) => {
                                      if (+e.target.value < 0) return;
                                      const updatedData = [...rowDto];
                                      updatedData[index] = {
                                        ...updatedData[index],
                                        decDirectRate: e.target.value || "",
                                      };
                                      setRowDto(updatedData);
                                    }}
                                    required
                                  />
                                ) : (
                                  item?.decDirectRate
                                )}
                              </td>
                              <td className="text-center">
                                {id ? (
                                  <InputField
                                    value={item?.decDumpDeliveryRate}
                                    name="decDumpDeliveryRate"
                                    type="number"
                                    onChange={(e) => {
                                      if (+e.target.value < 0) return;
                                      const updatedData = [...rowDto];
                                      updatedData[index] = {
                                        ...updatedData[index],
                                        decDumpDeliveryRate:
                                          e.target.value || "",
                                      };
                                      setRowDto(updatedData);
                                    }}
                                    required
                                  />
                                ) : (
                                  item?.decDumpDeliveryRate
                                )}
                              </td>
                              <td className="text-center">
                                {id ? (
                                  <InputField
                                    value={item?.decDamToTruckRate}
                                    name="decDamToTruckRate"
                                    type="number"
                                    onChange={(e) => {
                                      if (+e.target.value < 0) return;
                                      const updatedData = [...rowDto];
                                      updatedData[index] = {
                                        ...updatedData[index],
                                        decDamToTruckRate: e.target.value || "",
                                      };
                                      setRowDto(updatedData);
                                    }}
                                    required
                                  />
                                ) : (
                                  item?.decDamToTruckRate
                                )}
                              </td>
                              <td className="text-center">
                                {id ? (
                                  <InputField
                                    value={item?.decTruckToDamRate}
                                    name="decTruckToDamRate"
                                    type="number"
                                    onChange={(e) => {
                                      if (+e.target.value < 0) return;
                                      const updatedData = [...rowDto];
                                      updatedData[index] = {
                                        ...updatedData[index],
                                        decTruckToDamRate: e.target.value || "",
                                      };
                                      setRowDto(updatedData);
                                    }}
                                    required
                                  />
                                ) : (
                                  item?.decTruckToDamRate
                                )}
                              </td>
                              <td className="text-center">
                                {id ? (
                                  <InputField
                                    value={item?.decLighterToBolgateRate}
                                    name="decLighterToBolgateRate"
                                    type="number"
                                    onChange={(e) => {
                                      if (+e.target.value < 0) return;
                                      const updatedData = [...rowDto];
                                      updatedData[index] = {
                                        ...updatedData[index],
                                        decLighterToBolgateRate:
                                          e.target.value || "",
                                      };
                                      setRowDto(updatedData);
                                    }}
                                    required
                                  />
                                ) : (
                                  item?.decLighterToBolgateRate
                                )}
                              </td>
                              <td className="text-center">
                                {id ? (
                                  <InputField
                                    value={item?.decBolgateToDamRate}
                                    name="decBolgateToDamRate"
                                    type="number"
                                    onChange={(e) => {
                                      if (+e.target.value < 0) return;
                                      const updatedData = [...rowDto];
                                      updatedData[index] = {
                                        ...updatedData[index],
                                        decBolgateToDamRate:
                                          e.target.value || "",
                                      };
                                      setRowDto(updatedData);
                                    }}
                                    required
                                  />
                                ) : (
                                  item?.decBolgateToDamRate
                                )}
                              </td>
                              <td className="text-center">
                                {id ? (
                                  <InputField
                                    value={item?.decTruckToDamOutSideRate}
                                    name="decTruckToDamOutSideRate"
                                    type="number"
                                    onChange={(e) => {
                                      if (+e.target.value < 0) return;
                                      const updatedData = [...rowDto];
                                      updatedData[index] = {
                                        ...updatedData[index],
                                        decTruckToDamOutSideRate:
                                          e.target.value || "",
                                      };
                                      setRowDto(updatedData);
                                    }}
                                    required
                                  />
                                ) : (
                                  item?.decTruckToDamOutSideRate
                                )}
                              </td>
                              <td className="text-center">
                                {id ? (
                                  <InputField
                                    value={item?.decBiwtarate}
                                    name="decBiwtarate"
                                    type="number"
                                    onChange={(e) => {
                                      if (+e.target.value < 0) return;
                                      const updatedData = [...rowDto];
                                      updatedData[index] = {
                                        ...updatedData[index],
                                        decBiwtarate: e.target.value || "",
                                      };
                                      setRowDto(updatedData);
                                    }}
                                    required
                                  />
                                ) : (
                                  item?.decBiwtarate
                                )}
                              </td>
                              <td className="text-center">
                                {id ? (
                                  <InputField
                                    value={item?.decShipSweepingRate}
                                    name="decShipSweepingRate"
                                    type="number"
                                    onChange={(e) => {
                                      if (+e.target.value < 0) return;
                                      const updatedData = [...rowDto];
                                      updatedData[index] = {
                                        ...updatedData[index],
                                        decShipSweepingRate:
                                          e.target.value || "",
                                      };
                                      setRowDto(updatedData);
                                    }}
                                    required
                                  />
                                ) : (
                                  item?.decShipSweepingRate
                                )}
                              </td>
                              <td className="text-center">
                                {id ? (
                                  <InputField
                                    value={item?.decScaleRate}
                                    name="decScaleRate"
                                    type="number"
                                    onChange={(e) => {
                                      if (+e.target.value < 0) return;
                                      const updatedData = [...rowDto];
                                      updatedData[index] = {
                                        ...updatedData[index],
                                        decScaleRate: e.target.value || "",
                                      };
                                      setRowDto(updatedData);
                                    }}
                                    required
                                  />
                                ) : (
                                  item?.decScaleRate
                                )}
                              </td>
                              <td className="text-center">
                                {id ? (
                                  <InputField
                                    value={item?.decDailyLaboureRate}
                                    name="decDailyLaboureRate"
                                    type="number"
                                    onChange={(e) => {
                                      if (+e.target.value < 0) return;
                                      const updatedData = [...rowDto];
                                      updatedData[index] = {
                                        ...updatedData[index],
                                        decDailyLaboureRate:
                                          e.target.value || "",
                                      };
                                      setRowDto(updatedData);
                                    }}
                                    required
                                  />
                                ) : (
                                  item?.decDailyLaboureRate
                                )}
                              </td>
                              <td className="text-center">
                                {id ? (
                                  <InputField
                                    value={item?.decOthersCostRate}
                                    name="decOthersCostRate"
                                    type="number"
                                    onChange={(e) => {
                                      if (+e.target.value < 0) return;
                                      const updatedData = [...rowDto];
                                      updatedData[index] = {
                                        ...updatedData[index],
                                        decOthersCostRate: e.target.value || "",
                                      };
                                      setRowDto(updatedData);
                                    }}
                                    required
                                  />
                                ) : (
                                  item?.decOthersCostRate
                                )}
                              </td>
                              {id ? null : (
                                <td className="text-center">
                                  <IDelete
                                    remover={() => {
                                      setRowDto((prev) =>
                                        prev.filter((_, i) => i !== index)
                                      );
                                    }}
                                  />
                                </td>
                              )}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </>
                )}
              </div>

              <button
                type="submit"
                style={{ display: "none" }}
                ref={objProps?.btnRef}
                onSubmit={() => handleSubmit()}
              ></button>

              <button
                type="reset"
                style={{ display: "none" }}
                ref={objProps?.resetBtnRef}
                onSubmit={() => resetForm(initData)}
              ></button>
            </Form>
          </IForm>
        </>
      )}
    </Formik>
  );
}
