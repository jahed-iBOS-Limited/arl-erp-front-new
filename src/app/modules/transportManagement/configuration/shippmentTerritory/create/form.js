/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { IInput } from "../../../../_helper/_input";
import { _dateFormatter } from "../../../../_helper/_dateFormate";
import { _formatMoney } from "../../../../_helper/_formatMoney";
import NewSelect from "../../../../_helper/_select";
import useAxiosGet from "../../../../_helper/customHooks/useAxiosGet";

// Validation schema for bank transfer
const validationSchema = Yup.object().shape({
  shipPoint: Yup.object().shape({
    value: Yup.string().required("Ship Point is required"),
    label: Yup.string().required("Ship Point is required"),
  }),
  area: Yup.object().shape({
    value: Yup.string().required("Area is required"),
    label: Yup.string().required("Area is required"),
  }),
});

export default function _Form({
  initData,
  btnRef,
  saveHandler,
  resetBtnRef,
  isView,
  isEdit,
  // DDL,
  // areaDDL,
  shipPointDDL,
  channelDDL,
}) {
  const [valid, setValid] = useState(true);
  const [regionDDL, getRegionDDL] = useAxiosGet();
  const [areaDDL, getAreaDDL] = useAxiosGet();
  const regionList = regionDDL?.map((item) => ({
    ...item,
    value: item?.regionID,
    label: item?.regionName,
  }));
  const areaList = areaDDL?.map((item) => ({
    ...item,
    value: item?.areaID,
    label: item?.areaName,
  }));

  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={initData}
        validationSchema={validationSchema}
        onSubmit={(values, { setFieldValue }) => {
          setValid(false);
          saveHandler(values, () => {
            setFieldValue("area", "");
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
        }) => (
          <>
            <form className="global-form from-label-right">
              <div className="form-group row">
                <div className="col-lg-3">
                  <NewSelect
                    name="shipPoint"
                    options={shipPointDDL || []}
                    value={values?.shipPoint}
                    label="Select Shippoint"
                    onChange={(valueOption) => {
                      setFieldValue("shipPoint", valueOption);
                    }}
                    placeholder="Select Shippoint"
                    errors={errors}
                    touched={touched}
                    isDisabled={isView || isEdit}
                  />
                </div>
                <div className="col-lg-3">
                  <NewSelect
                    name="channel"
                    options={channelDDL || []}
                    value={values?.channel}
                    label="Distribution Channel"
                    onChange={(valueOption) => {
                      setFieldValue("channel", valueOption);
                      getRegionDDL(
                        `/oms/TerritoryInfo/GetRegionListByChannelId?DistributionChannelId=${valueOption?.value}`
                      );
                    }}
                    placeholder="Select Distribution Channel"
                    errors={errors}
                    touched={touched}
                    isDisabled={isView || isEdit}
                  />
                </div>
                <div className="col-lg-3">
                  <NewSelect
                    name="region"
                    options={regionList || []}
                    value={values?.region}
                    label="Select Region"
                    onChange={(valueOption) => {
                      setFieldValue("region", valueOption);
                      getAreaDDL(
                        `/oms/TerritoryInfo/GetAreaListByRegionId?DistributionChannelId=${values?.channel?.value}&RegionId=${valueOption?.value}`
                      );
                    }}
                    placeholder="Select Region"
                    errors={errors}
                    touched={touched}
                    isDisabled={isView || isEdit}
                  />
                </div>
                <div className="col-lg-3">
                  <NewSelect
                    name="area"
                    options={areaList || []}
                    value={values?.area}
                    label="Select Area"
                    onChange={(valueOption) => {
                      if (valueOption) {
                        setFieldValue("area", valueOption);
                      } else {
                        setFieldValue("area", "");
                      }
                    }}
                    placeholder="Select Area"
                    errors={errors}
                    touched={touched}
                    isDisabled={isView || isEdit}
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
            </form>
          </>
        )}
      </Formik>
    </>
  );
}
