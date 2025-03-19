/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import Select from "react-select";
import customStyles from "../../../../selectCustomStyle";
import { IInput } from "../../../../_helper/_input";
import { useEffect } from "react";
import { _dateFormatter } from "../../../../_helper/_dateFormate";
import { _formatMoney } from "../../../../_helper/_formatMoney";
import {
  GetPlantDDL,
  getItemNameDDL,
  getRoutingToWorkCenterDDL,
  getRoutingToBOMDDL,
  isSOUseOnProductionOrder,
  getShopFloorDDL,
  getBoMDetailsByBoMId,
} from "../helper";
import NewSelect from "../../../../_helper/_select";
import CreateSubPOForm from "../createChildPo/addForm";
import { useParams } from "react-router-dom";

// Validation schema for bank transfer
const validationSchema = Yup.object().shape({
  plantName: Yup.object().shape({
    label: Yup.string().required("Plant Name is required"),
    value: Yup.string().required("Plant Name is required"),
  }),
  shopFloor: Yup.object().shape({
    label: Yup.string().required("Shop Floor is required"),
    value: Yup.string().required("Shop Floor is required"),
  }),
  itemName: Yup.object().shape({
    label: Yup.string().required("Item Name is required"),
    value: Yup.string().required("Item Name is required"),
  }),
  workCenter: Yup.object().shape({
    label: Yup.string().required("Work Center is required"),
    value: Yup.string().required("Work Center is required"),
  }),
  bomName: Yup.object().shape({
    label: Yup.string().required("BOM Name is required"),
    value: Yup.string().required("BOM Name is required"),
  }),
  startDate: Yup.string().required("Start Date is required"),
  startTime: Yup.string().required("Start Time is required"),
  endDateTime: Yup.string().required("End Date is required"),
  endTime: Yup.string().required("End Time is required"),
  // salesOrderId: Yup.number().when("isSOUseOnProductionOrderTest", {
  //   is: true,
  //   then: Yup.number().required("Sales Order Id is required"),
  //   otherwise: Yup.number(),
  // }),
  numOrderQty: Yup.number().required("Quantity is required"),
});

export default function _Form({
  initData,
  btnRef,
  saveHandler,
  resetBtnRef,
  rowDto,
  profileData,
  selectedBusinessUnit,
  isEdit,
  setRowDto,
  productionOrderSFG,
  productionId,
  subPo,
}) {
  // GetPlantNameDDL
  const [plantName, setPlantName] = useState([]);

  // GetPlantNameDDL
  const [shopFloorDDL, setShopFloorDDL] = useState([]);

  // GetItemNameDDL
  const [itemName, setItemName] = useState([]);

  // GetWorkCenterDDL
  const [workCenter, setWorkCenter] = useState([]);

  // BOM Name ddl
  const [bomName, setBomName] = useState([]);

  // PRT number
  // const [prtNumber, setPrtNumber] = useState([]);

  const [isShowTable, setShowTable] = useState(false);

  // isSOUseOnProductionOrder
  const [
    isSOUseOnProductionOrderType,
    setIsSOUseOnProductionOrderType,
  ] = useState(false);

  const [valid, setValid] = useState(true);
  useEffect(() => {
    if (profileData.accountId && selectedBusinessUnit.value) {
      GetPlantDDL(
        profileData?.userId,
        profileData?.accountId,
        selectedBusinessUnit?.value,
        setPlantName
      );
      isSOUseOnProductionOrder(
        profileData?.accountId,
        selectedBusinessUnit?.value,
        setIsSOUseOnProductionOrderType
      );
    }
  }, [profileData, selectedBusinessUnit]);

  const params = useParams();

  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={{
          ...initData,
          isSOUseOnProductionOrderTest: isSOUseOnProductionOrderType,
        }}
        validationSchema={validationSchema}
        onSubmit={(values, { setSubmitting, resetForm }) => {
          setValid(false);
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
            <Form className=" from-label-right">
              <div className="global-form">
                <div className="form-group  row">
                  <div className="col-lg-3">
                    <NewSelect
                      name="plantName"
                      onChange={(valueOption) => {
                        setFieldValue("plantName", valueOption);
                        setFieldValue("itemName", "");
                        setFieldValue("prtNumber", "");
                        setFieldValue("workCenter", "");
                        setFieldValue("bomName", "");
                        setFieldValue("shopFloor", "");
                        setItemName([]);
                        setWorkCenter([]);
                        setBomName([]);

                        getShopFloorDDL(
                          profileData?.accountId,
                          selectedBusinessUnit?.value,
                          valueOption?.value,
                          setShopFloorDDL
                        );
                        // getPTRNumberDDL(
                        //   profileData?.accountId,
                        //   selectedBusinessUnit?.value,
                        //   valueOption?.value,
                        //   setPrtNumber
                        // );
                      }}
                      placeholder="Select Plant Name"
                      options={plantName}
                      value={values?.plantName || ""}
                      styles={customStyles}
                      errors={errors}
                      touched={touched}
                      isDisabled={isEdit}
                    />
                  </div>
                  {!isEdit && (
                    <div className="col-lg-3">
                      <NewSelect
                        name="shopFloor"
                        onChange={(valueOption) => {
                          setFieldValue("shopFloor", valueOption);
                          setFieldValue("itemName", "");
                          setFieldValue("prtNumber", "");
                          setFieldValue("workCenter", "");
                          setFieldValue("bomName", "");
                          setWorkCenter([]);
                          setBomName([]);
                          getItemNameDDL(
                            profileData?.accountId,
                            selectedBusinessUnit?.value,
                            values?.plantName?.value,
                            valueOption?.value,
                            setItemName
                          );
                        }}
                        placeholder="Select Shop Floor"
                        options={shopFloorDDL}
                        value={values?.shopFloor || ""}
                        styles={customStyles}
                        isDisabled={isEdit}
                        errors={errors}
                        touched={touched}
                      />
                    </div>
                  )}
                  <div className="col-lg-3">
                    <NewSelect
                      placeholder="Select Item Name"
                      onChange={(valueOption) => {
                        setFieldValue("itemName", valueOption);
                        setFieldValue("workCenter", "");
                        setFieldValue("bomName", "");
                        setFieldValue("prtNumber", "");
                        setBomName([]);
                        getRoutingToWorkCenterDDL(
                          profileData.accountId,
                          selectedBusinessUnit.value,
                          values?.shopFloor?.value,
                          valueOption?.value,
                          setWorkCenter
                        );
                      }}
                      options={itemName}
                      value={values?.itemName || ""}
                      isSearchable={true}
                      styles={customStyles}
                      name="itemName"
                      isDisabled={!values?.plantName || isEdit}
                      errors={errors}
                      touched={touched}
                    />
                  </div>
                  <div className="col-lg-3">
                    <NewSelect
                      placeholder="Select Work Center"
                      onChange={(valueOption) => {
                        setFieldValue("workCenter", valueOption);
                        setFieldValue("bomName", "");
                        setFieldValue("prtNumber", "");
                        getRoutingToBOMDDL(
                          profileData.accountId,
                          selectedBusinessUnit.value,
                          values?.itemName?.value,
                          valueOption?.value,
                          values?.shopFloor?.value,
                          setBomName
                        );
                      }}
                      options={workCenter}
                      value={values?.workCenter || ""}
                      isSearchable={true}
                      styles={customStyles}
                      name="workCenter"
                      isDisabled={!values?.itemName || isEdit}
                      errors={errors}
                      touched={touched}
                    />
                  </div>
                  <div className="col-lg-3">
                    <NewSelect
                      placeholder="Select Bill Of Material"
                      onChange={(valueOption) => {
                        getBoMDetailsByBoMId(valueOption?.value, setRowDto);
                        setFieldValue("bomName", valueOption);
                        setFieldValue("prtNumber", "");
                        setFieldValue(
                          "baseUomName",
                          params.id
                            ? valueOption?.uomName
                            : valueOption?.baseUomName
                        );
                      }}
                      options={bomName}
                      value={values?.bomName || ""}
                      isSearchable={true}
                      styles={customStyles}
                      name="bomName"
                      isDisabled={
                        (!values?.itemName && !values?.workCenter) || isEdit
                      }
                      errors={errors}
                      touched={touched}
                    />
                  </div>
                  {params?.id && (
                    <div className="col-lg-3">
                      <IInput
                        value={values?.bomVersion}
                        label="Bom Version"
                        name="bomVersion"
                        type="string"
                        disabled={true}
                      />
                    </div>
                  )}
                  <div className="col-lg-3">
                    <IInput
                      value={values?.baseUomName}
                      label="Uom"
                      name="baseUomName"
                      type="string"
                      disabled={true}
                    />
                  </div>

                  {/* Commented By Miraj Hossain (BA) */}
                  {/* <div className="col-lg-3">
                  <label>Bill Of Expense</label>
                  <Select
                    onChange={(valueOption) => {
                      setFieldValue("boex", valueOption);
                    }}
                    options={[]}
                    value={values?.boex || ""}
                    isSearchable={true}
                    styles={customStyles}
                    name="boex"
                    isDisabled={
                      (!values?.itemName && !values?.workCenter) || isEdit
                    }
                  />
                </div> */}

                  <div className="col-lg-3">
                    <IInput
                      value={values?.startDate}
                      label="Start Date"
                      name="startDate"
                      type="date"
                    />
                  </div>
                  <div className="col-lg-3">
                    <IInput
                      value={values?.startTime}
                      label="Start Time"
                      name="startTime"
                      type="time"
                    />
                  </div>
                  <div className="col-lg-3">
                    <IInput
                      value={values?.endDateTime}
                      label="End Date"
                      name="endDateTime"
                      type="date"
                      min={values?.startDate}
                    />
                  </div>
                  <div className="col-lg-3">
                    <IInput
                      value={values?.endTime}
                      label="End Time"
                      name="endTime"
                      type="time"
                    />
                  </div>

                  <div className="col-lg-3">
                    <IInput
                      value={values?.salesOrderId}
                      label="Sales Order ID (optional)"
                      name="salesOrderId"
                      type="number"
                      disabled={isEdit}
                      onChange={(e) => {
                        if (e.target.value >= 0) {
                          setFieldValue("salesOrderId", e.target.value);
                        } else {
                          setFieldValue("salesOrderId", "");
                        }
                      }}
                    />
                  </div>
                  {/* <div className="col-lg-3">
                    <label>PTR (optional)</label>
                    <Select
                      placeholder="Select PTR"
                      onChange={(valueOption) => {
                        setFieldValue("prtNumber", valueOption);
                      }}
                      options={prtNumber || []}
                      value={values?.prtNumber || ""}
                      isSearchable={true}
                      styles={customStyles}
                      name="prtNumber"
                      disabled={isEdit}
                    />
                  </div> */}
                  <div className="col-lg-3">
                    <IInput
                      value={values?.numOrderQty}
                      label="Quantity"
                      name="numOrderQty"
                      type="number"
                      onChange={(e) => {
                        if (e.target.value >= 0) {
                          setFieldValue("numOrderQty", e.target.value);
                        } else {
                          setFieldValue("numOrderQty", "");
                        }
                      }}
                    />
                  </div>
                  <div className="col-lg-2 d-flex align-items-center">
                    <input
                      id="itemCheck"
                      type="checkbox"
                      className=""
                      // checked={!values?.bomName && false}
                      name="itemCheck"
                      onChange={(e) => {
                        setShowTable(!isShowTable);
                      }}
                      disabled={!values?.bomName}
                    />
                    <span className="ml-3">View Bom Details</span>
                  </div>
                </div>

                {/* Row Dto Table End */}
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
              </div>
              {productionOrderSFG?.length > 0 ? (
                <CreateSubPOForm
                  productionOrderSFG={productionOrderSFG}
                  productionId={productionId}
                  plantName={values?.plantName?.value}
                  subPo={subPo}
                  shopFloorId={values?.shopFloor?.value}
                />
              ) : null}
            </Form>

            {isShowTable && values?.bomName && (
              <div className="table-responsive">
                <table className="table table-striped table-bordered mt-3 bj-table bj-table-landing">
                  <thead>
                    <tr>
                      <th>SL</th>
                      <th>Item Code</th>
                      <th>Item Name</th>
                      <th>Lot Size</th>
                      <th>Uom Name</th>
                      <th>Quantity</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rowDto?.length > 0 &&
                      rowDto?.map((item, index) => (
                        <tr>
                          <td>{index + 1}</td>
                          <td className="text-center">{item?.itemCode}</td>
                          <td>{item?.itemName}</td>
                          <td className="text-center">{item?.lotSize}</td>
                          <td>{item?.uomName}</td>
                          <td className="text-center">{item?.quantity}</td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            )}
          </>
        )}
      </Formik>
    </>
  );
}
