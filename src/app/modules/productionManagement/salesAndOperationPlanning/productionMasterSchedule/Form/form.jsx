import React, { useState, useEffect } from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";
import NewSelect from "./../../../../_helper/_select";
import InputField from "./../../../../_helper/_inputField";
import IDelete from "../../../../_helper/_helperIcons/_delete";

import {
  getProductionMasterSchedulingYear,
  getMasterSchedulingHorizon,
  getProductionMasterSchedulingItems,
  getProductionMasterSchedulingOthers,
} from "../helper";

// Validation schema
const validationSchema = Yup.object().shape({});

export default function _Form({
  initData,
  btnRef,
  saveHandler,
  resetBtnRef,
  rowDto,
  setRowDto,
  setShedulingYearDDL,
  setShedulingHorizonDDL,
  shedulingPlantDDL,
  shedulingYearDDL,
  shedulingHorizonDDL,
  profileData,
  selectedBusinessUnit,
  empDDL,
  isEdit,
  plant,
  year,
  month,
  item,
  setPlant,
  setYear,
  setMonth,
  setItem,
  itemsDDL,
  setItemsDDL,
  workCenters,
  boMs,
  productionPlanQty,
  setWorkCenters,
  setBoMs,
  setProductionPlanQty,
  remover,
  setUomId,
  setProductionPlanningId,
  uomId,
  setDateData,
}) {
  const [masterPlanQty, setMasterPlanQty] = useState("");

  const addProductionData = (values) => {
    const findDuplicate = rowDto?.find(
      (item) => item?.itemId === values?.item?.value
    );
    if (values?.item?.value) {
      if (findDuplicate) {
        toast.warning("Item already added");
      } else {
        let rowDataValues = {
          itemId: values?.item?.value,
          itemName: values?.item?.label,
          itemQTY: masterPlanQty,
          workCenterId: values?.workCenters ? values?.workCenters?.value : 0,
          workCenterName: values?.workCenters ? values?.workCenters?.label : 0,
          boMId: values?.boMs ? values?.boMs?.value : 0,
          boMName: values?.boMs ? values?.boMs?.label : 0,
          productionPlanQty: productionPlanQty,
          uoMId: uomId?.value,
          uomName: uomId?.label,
        };
        setRowDto([...rowDto, rowDataValues]);
      }
    } else {
      toast.warn("Add at least one item");
    }
  };

  useEffect(() => {
    if (plant && year && month) {
      getProductionMasterSchedulingItems(
        profileData?.accountId,
        selectedBusinessUnit?.value,
        plant?.value,
        year.label,
        month.value,
        setItemsDDL
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [plant, year, month]);

  useEffect(() => {
    if (plant && year && month && item) {
      getProductionMasterSchedulingOthers(
        profileData?.accountId,
        selectedBusinessUnit?.value,
        plant?.value,
        year.label,
        month.value,
        item.value,
        setWorkCenters,
        setBoMs,
        setProductionPlanQty,
        setProductionPlanningId,
        setUomId
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [plant, year, month, item]);

  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={initData}
        validationSchema={validationSchema}
        onSubmit={(values, { setSubmitting, resetForm }) => {
          saveHandler(values, () => {
            resetForm(initData);
          });
        }}
      >
        {({
          handleSubmit,
          resetForm,
          values,
          errors,
          touched,
          setFieldValue,
          isValid,
        }) => (
          <>
            <Form className="form form-label-right global-form">
              <div className="form-group row">
                <div className="col-lg-3">
                  <NewSelect
                    name="plant"
                    options={shedulingPlantDDL}
                    value={values?.plant}
                    label="Plant"
                    placeholder="Plant"
                    onChange={(valueOption) => {
                      setFieldValue("plant", valueOption);
                      setFieldValue("year", "");
                      setFieldValue("horizon", "");
                      setPlant(valueOption);
                      getProductionMasterSchedulingYear(
                        profileData?.accountId,
                        selectedBusinessUnit?.value,
                        valueOption?.value,
                        setShedulingYearDDL
                      );
                    }}
                    errors={errors}
                    touched={touched}
                  />
                </div>
                <div className="col-lg-3">
                  <NewSelect
                    name="year"
                    options={shedulingYearDDL}
                    value={values?.year}
                    label="Year"
                    onChange={(valueOption) => {
                      setFieldValue("year", valueOption);
                      setFieldValue("horizon", "");
                      setYear(valueOption);
                      getMasterSchedulingHorizon(
                        profileData?.accountId,
                        selectedBusinessUnit?.value,
                        values?.plant?.value,
                        valueOption?.label,
                        setDateData,
                        setShedulingHorizonDDL
                      );
                    }}
                    placeholder="Year"
                    errors={errors}
                    touched={touched}
                  />
                </div>
                <div className="col-lg-3">
                  <NewSelect
                    name="horizon"
                    options={shedulingHorizonDDL}
                    value={values?.horizon}
                    label="Horizon"
                    onChange={(valueOption) => {
                      setFieldValue("horizon", valueOption);
                      setMonth(valueOption);
                    }}
                    placeholder="Horizon"
                    errors={errors}
                    touched={touched}
                  />
                </div>

                {/* <div className="col-lg-3">
                  <label>Start Date</label>
                  <InputField
                    value={values?.startDate}
                    name="startDate"
                    placeholder="Start Date"
                    type="date"
                  />
                </div>
                <div className="col-lg-3">
                  <label>End Date</label>
                  <InputField
                    value={values?.endDate}
                    name="endDate"
                    placeholder="End Date"
                    type="date"
                  />
                </div> */}
              </div>
              <div className="form-group row">
                <div className="col-lg-12 mt-3 mb-3">
                  <p
                    className="font-weight-bold"
                    style={{ marginBottom: "0", fontSize: "12px" }}
                  >
                    Add Production Item
                  </p>
                </div>
              </div>

              <div className="form-group row">
                <div className="col-lg-3">
                  <NewSelect
                    name="scheduleHorizon"
                    options={itemsDDL}
                    value={values?.item}
                    label="Item Name"
                    onChange={(valueOption) => {
                      setFieldValue("item", valueOption);
                      setFieldValue("workCenters", "");
                      setFieldValue("boMs", "");
                      setItem(valueOption);
                    }}
                    placeholder="Item Name"
                    errors={errors}
                    touched={touched}
                  />
                </div>
                <div className="col-lg-3">
                  <NewSelect
                    name="workCenters"
                    options={workCenters}
                    value={values?.workCenters}
                    label="Work Center"
                    onChange={(valueOption) => {
                      setFieldValue("workCenters", valueOption);
                    }}
                    placeholder="Work Center"
                    errors={errors}
                    touched={touched}
                  />
                </div>
                <div className="col-lg-3">
                  <NewSelect
                    name="boMs"
                    options={boMs}
                    value={values?.boMs}
                    label="BoM"
                    onChange={(valueOption) => {
                      setFieldValue("boMs", valueOption);
                    }}
                    placeholder="BoM"
                    errors={errors}
                    touched={touched}
                  />
                </div>
                <div className="col-lg-3">
                  <InputField
                    label="Plan Qty"
                    name="masterPlanQty"
                    type="number"
                    value={masterPlanQty}
                    placeholder="Plan Qty"
                    onChange={(e) => {
                      if (e.target.value > 0) {
                        setMasterPlanQty(e.target.value);
                      } else {
                        setMasterPlanQty("");
                      }
                    }}
                  />
                </div>
                <div className="col-lg-3 mt-5">
                  <button
                    onClick={() => addProductionData(values)}
                    className="btn btn-primary"
                    type="button"
                  >
                    Add
                  </button>
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
                onSubmit={() => resetForm(initData)}
              ></button>
            </Form>
            <div className="table-responsive">
              <table className="global-table table">
                <thead>
                  <tr>
                    <th>SL</th>
                    <th>Item Name</th>
                    <th>UoM Name</th>
                    <th>Work Center</th>
                    <th>BoM</th>
                    <th>Production Plan Quantity</th>
                    <th>Plan Quantity</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {rowDto?.map((item, index) => (
                    <tr key={item?.sl}>
                      <td className="text-center">{index + 1}</td>
                      <td className="pl-2">{item?.itemName}</td>
                      <td className="pl-2">{item?.uomName}</td>
                      <td className="pl-2">{item?.workCenterName}</td>
                      <td className="pl-2">{item?.boMName}</td>
                      <td className="pl-2 text-center">
                        {item?.productionPlanQty}
                      </td>
                      <td className="pl-2 text-center">{item?.itemQTY}</td>
                      <td className="text-center">
                        <IDelete id={index} remover={remover} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </Formik>
    </>
  );
}
