import React, { useState } from "react";
import { Formik, Form } from "formik";
import { IInput } from "../../../../_helper/_input";
import {
  getWorkCenterNameDDL,
  getItemNameDDL,
  getCreatePageData,
} from "../helper";
import NewSelect from "../../../../_helper/_select";

export default function _Form({
  initData,
  btnRef,
  saveHandler,
  resetBtnRef,
  disableHandler,
  plantNameDDL,
  shopFloorDDL,
  setWorkCenterNameDDL,
  workCenterNameDDL,
  itemNameDDL,
  setItemNameDDL,
  billOfMaterialName,
  setBillOfMaterialNameDDL,
  isView,

  profileData,

  id,
}) {
  const [createPageData, setCreatePageData] = useState({});

  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={initData}
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
            {disableHandler(!isValid)}

            <Form>
              <div className="row global-form">
                <div className="col-lg-3">
                  <NewSelect
                    label="Plant Name"
                    options={plantNameDDL}
                    onChange={(valueOption) => {
                      setFieldValue("plantName", valueOption);
                      getWorkCenterNameDDL(
                        profileData.accountId,
                        profileData.defaultBusinessUnit,
                        valueOption?.value,
                        setWorkCenterNameDDL
                      );
                      getItemNameDDL(
                        profileData.accountId,
                        profileData.defaultBusinessUnit,
                        valueOption?.value,
                        setItemNameDDL
                      );
                    }}
                    value={id ? initData?.plantName : values.plantName}
                    name="plantName"
                    errors={errors}
                    touched={touched}
                    isDisabled={isView}
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
                    }}
                    placeholder="Shop Floor Name"
                    errors={errors}
                    touched={touched}
                    isDisabled={isView}
                  />
                </div>
                <div className="col-lg-3">
                  <NewSelect
                    label="Work Center Name"
                    options={workCenterNameDDL}
                    onChange={(valueOption) => {
                      setFieldValue("workCenterName", valueOption);
                      getCreatePageData(
                        profileData.accountId,
                        profileData.defaultBusinessUnit,
                        valueOption,
                        setCreatePageData
                      );
                    }}
                    value={values.workCenterName}
                    name="workCenterName"
                    errors={errors}
                    touched={touched}
                    isDisabled={isView}
                  />
                </div>
                <div className="col-lg-3">
                  <NewSelect
                    label="Item Name"
                    options={itemNameDDL}
                    onChange={(valueOption) => {
                      setFieldValue("itemName", valueOption);
                    }}
                    value={values.itemName}
                    name="itemName"
                    errors={errors}
                    touched={touched}
                    isDisabled={isView}
                  />
                </div>

                <div className="col-lg-3">
                  <NewSelect
                    label="BoM Name"
                    options={billOfMaterialName}
                    onChange={(valueOption) => {
                      setFieldValue("billOfMaterialName", valueOption);
                    }}
                    value={values.billOfMaterialName}
                    name="billOfMaterialName"
                    errors={errors}
                    touched={touched}
                    isDisabled={isView}
                  />
                </div>
                <div className="col-lg-3">
                  <IInput
                    value={
                      values.capacity
                        ? values.capacity
                        : createPageData.workCenterCapacity || ""
                    }
                    label="Work Center Capacity"
                    name="capacity"
                    disabled={isView}
                  />
                </div>
                <div className="col-lg-3">
                  <IInput
                    value={
                      values.setUpTime
                        ? values.setUpTime
                        : createPageData.setupTime || ""
                    }
                    label="Setup Time"
                    name="setUpTime"
                    disabled={isView}
                  />
                </div>

                <div className="col-lg-3">
                  <IInput
                    value={
                      values.laborQty
                        ? values.laborQty
                        : createPageData.laborQty || ""
                    }
                    label="Labor Qty"
                    name="laborQty"
                    disabled={isView}
                  />
                </div>

                <div className="col-lg-3">
                  <IInput
                    value={
                      values.laborTime
                        ? values.laborTime
                        : createPageData.laborTime || ""
                    }
                    label="Labor Time"
                    name="laborTime"
                    disabled={isView}
                  />
                </div>

                <div className="col-lg-3">
                  <IInput
                    value={
                      values.laborCost
                        ? values.laborCost
                        : createPageData.laborCost || ""
                    }
                    label="Labor Cost"
                    name="laborCost"
                    disabled={isView}
                  />
                </div>

                <div className="col-lg-3">
                  <IInput
                    value={
                      values.machineTime
                        ? values.machineTime
                        : createPageData.machineTime || ""
                    }
                    label="Machine Time"
                    name="machineTime"
                    disabled={isView}
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
                onSubmit={() => resetForm(initData)}
              ></button>
            </Form>
          </>
        )}
      </Formik>
    </>
  );
}
