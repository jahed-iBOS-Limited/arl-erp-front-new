import React, { useState } from "react";
import { Formik, Form } from "formik";
import { IInput } from "../../../../_helper/_input";
import {
  getWorkCenterNameDDL,
  getItemNameDDL,
  getCreatePageData,
  getShopFloorDDL,
  getBomNameDDL,
} from "../helper";
import * as Yup from "yup";
import NewSelect from "../../../../_helper/_select";
const validationSchema = Yup.object().shape({
  plantName: Yup.object().shape({
    label: Yup.string().required("Plant Name is required"),
    value: Yup.string().required("Plant Name is required"),
  }),
  shopFloorName: Yup.object().shape({
    label: Yup.string().required("Shop Floor Name is required"),
    value: Yup.string().required("Shop Floor Name is required"),
  }),
  workCenterName: Yup.object().shape({
    label: Yup.string().required("Work Center Name is required"),
    value: Yup.string().required("Work Center Name is required"),
  }),
  itemName: Yup.object().shape({
    label: Yup.string().required("Item Name is required"),
    value: Yup.string().required("Item Name is required"),
  }),
  bomNameDDL: Yup.object().shape({
    label: Yup.string().required("BOM Name is required"),
    value: Yup.string().required("BOM Name is required"),
  }),
});

export default function _Form({
  initData,
  btnRef,
  saveHandler,
  resetBtnRef,
  plantNameDDL,
  shopFloorDDL,
  bomNameDDL,
  setWorkCenterNameDDL,
  workCenterNameDDL,
  setBomNameDDL,
  selectedBusinessUnit,
  itemNameDDL,
  setItemNameDDL,
  billOfMaterialNameDDL,
  setShopFloorDDL,
  isEdit,
  profileData,
  id,
}) {
  // eslint-disable-next-line no-unused-vars
  const [createPageData, setCreatePageData] = useState({});
  console.log({ workCenterNameDDL });
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
            <Form className="global-form form form-label-right">
              <div className="form-group row">
                <div className="col-lg-3">
                  <NewSelect
                    label="Plant Name"
                    options={plantNameDDL}
                    onChange={(valueOption) => {
                      setFieldValue("plantName", valueOption);
                      setItemNameDDL([]);
                      setItemNameDDL([]);
                      setBomNameDDL([]);
                      getShopFloorDDL(
                        profileData?.accountId,
                        selectedBusinessUnit?.value,
                        valueOption?.value,
                        setShopFloorDDL
                      );
                      setFieldValue("bomNameDDL", "");
                      setFieldValue("shopFloorName", "");
                      setFieldValue("workCenterName", "");
                      setFieldValue("capacity", "");
                      setFieldValue("setUpTime", "");
                      setFieldValue("machineTime", "");
                      setFieldValue("laborQty", "");
                      setFieldValue("laborTime", "");
                      setFieldValue("laborCost", "");
                      setFieldValue("itemName", "");
                    }}
                    value={id ? initData?.plantName : values.plantName}
                    name="plantName"
                    placeholder="Plant Name"
                    errors={errors}
                    touched={touched}
                    isDisabled={isEdit}
                  />
                </div>
                <div className="col-lg-3">
                  <NewSelect
                    name="shopFloorName"
                    options={shopFloorDDL}
                    value={values?.shopFloorName}
                    label="Shop Floor Name"
                    onChange={(valueOption) => {
                      setFieldValue("shopFloorName", valueOption);
                      setItemNameDDL([]);
                      setBomNameDDL([]);
                      getWorkCenterNameDDL(
                        profileData?.accountId,
                        selectedBusinessUnit?.value,
                        values?.plantName?.value,
                        valueOption?.value,
                        setWorkCenterNameDDL
                      );
                      setFieldValue("workCenterName", "");
                      setFieldValue("itemName", "");
                      setFieldValue("bomNameDDL", "");
                    }}
                    placeholder="Shop Floor Name"
                    errors={errors}
                    touched={touched}
                    isDisabled={isEdit}
                  />
                </div>
                <div className="col-lg-3">
                  <NewSelect
                    label="Work Center Name"
                    options={workCenterNameDDL}
                    onChange={(valueOption) => {
                      setFieldValue("workCenterName", valueOption);
                      setBomNameDDL([]);
                      getItemNameDDL(
                        profileData?.accountId,
                        selectedBusinessUnit?.value,
                        values?.plantName?.value,
                        valueOption?.value,
                        setItemNameDDL
                      );
                      setFieldValue("itemName", "");
                      setFieldValue("bomNameDDL", "");
                      getCreatePageData(
                        profileData.accountId,
                        selectedBusinessUnit?.value,
                        valueOption,
                        // setCreatePageData
                        setFieldValue
                      );
                    }}
                    value={values?.workCenterName}
                    placeholder="Work Center Name"
                    name="workCenterName"
                    errors={errors}
                    touched={touched}
                  />
                </div>
                <div className="col-lg-3">
                  <NewSelect
                    label="Item Name"
                    options={itemNameDDL}
                    onChange={(valueOption) => {
                      setFieldValue("itemName", valueOption);
                      getBomNameDDL(
                        profileData?.accountId,
                        selectedBusinessUnit?.value,
                        values?.plantName?.value,
                        valueOption?.value,
                        values?.shopFloorName?.value,
                        setBomNameDDL
                      );
                      setFieldValue("bomNameDDL", "");
                    }}
                    value={values.itemName}
                    name="itemName"
                    placeholder="Item Name"
                    errors={errors}
                    touched={touched}
                    isDisabled={isEdit}
                  />
                </div>
              </div>
              {console.log(values.itemName, "values.itemName")}
              <div className="form-group row">
                <div className="col-lg-3">
                  <NewSelect
                    label="BoM Name"
                    options={bomNameDDL}
                    onChange={(valueOption) => {
                      setFieldValue("bomNameDDL", valueOption);
                    }}
                    value={values.bomNameDDL}
                    name="bomNameDDL"
                    placeholder="BoM Name"
                    errors={errors}
                    touched={touched}
                  />
                </div>
                <div className="col-lg-3">
                  <IInput
                    value={
                      values.capacity
                        ? values.capacity
                        : createPageData.workCenterCapacity || ""
                    }
                    label="Work Center Capacity [Per Hour]"
                    name="capacity"
                    type="number"
                    min="0"
                    onChange={(e) => {
                      if (e.target.value >= 0) {
                        setFieldValue("capacity", e.target.value);
                      } else {
                        setFieldValue("capacity", "");
                      }
                    }}
                  />
                </div>
                <div className="col-lg-3">
                  <IInput
                    value={
                      values.setUpTime
                        ? values.setUpTime
                        : createPageData.setupTime || ""
                    }
                    label="Setup Time [Per Min]"
                    name="setUpTime"
                    type="number"
                    onChange={(e) => {
                      if (e.target.value >= 0) {
                        setFieldValue("setUpTime", e.target.value);
                      } else {
                        setFieldValue("setUpTime", "");
                      }
                    }}
                  />
                </div>
                {/* Filed Commented | By Miraj Hossain (BA)  */}
                {/* <div className="col-lg-3">
                  <IInput
                    value={
                      values.machineTime
                        ? values.machineTime
                        : createPageData.machineTime || ""
                    }
                    label="Machine Time"
                    name="machineTime"
                    type="number"
                    onChange={(e) => {
                      if (e.target.value >= 0) {
                        setFieldValue("machineTime", e.target.value);
                        if (values?.laborQty) {
                          const laborTime = e.target.value * values?.laborQty;
                          setFieldValue("machineTime", laborTime);
                        }
                      } else {
                        setFieldValue("machineTime", "");
                      }
                    }}
                  />
                </div> */}
                <div className="col-lg-3">
                  <IInput
                    value={
                      values.laborQty
                        ? values.laborQty
                        : createPageData.laborQty || ""
                    }
                    label="Labor Qty"
                    name="laborQty"
                    type="number"
                    onChange={(e) => {
                      if (e.target.value >= 0) {
                        setFieldValue("laborQty", e.target.value);
                        if (values?.machineTime) {
                          const laborTime =
                            e.target.value * values?.machineTime;
                          setFieldValue("laborTime", laborTime);
                        }
                      } else {
                        setFieldValue("laborQty", "");
                      }
                    }}
                  />
                </div>
              </div>
              {/* Filed Commented | By Miraj Hossain (BA)  */}

              {/* <div className="col-lg-3">
                  <label>Labor Time</label>
                  <IInput
                    value={
                      values.laborTime
                        ? values.laborTime
                        : createPageData.laborTime || ""
                    }
                    name="laborTime"
                    disabled={true}
                  />
                </div> */}

              {/* <div className="col-lg-3">
                  <IInput
                    value={
                      values.laborCost
                        ? values.laborCost
                        : createPageData.laborCost || ""
                    }
                    label="Labor Cost"
                    name="laborCost"
                    type="number"
                    onChange={(e) => {
                      if (e.target.value >= 0) {
                        setFieldValue("laborCost", e.target.value);
                      } else {
                        setFieldValue("laborCost", "");
                      }
                    }}
                  />
                </div> */}

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
          </>
        )}
      </Formik>
    </>
  );
}
