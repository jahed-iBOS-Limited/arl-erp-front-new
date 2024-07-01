import moment from "moment";
import React from "react";
import { shallowEqual, useSelector } from "react-redux";
import { imarineBaseUrl } from "../../../../../App";
import { getDifference } from "../../../_chartinghelper/_getDateDiff";
import FormikInput from "../../../_chartinghelper/common/formikInput";
import FormikSelect from "../../../_chartinghelper/common/formikSelect";
import customStyles from "../../../_chartinghelper/common/selectCustomStyle";
import { getVesselDDL } from "../../../helper";
import { GetOwnerVesselCharterVoyageID } from "../../helper";

export default function Header({
  values,
  setFieldValue,
  viewType,
  errors,
  touched,
  vesselDDL,
  setVesselDDL,
  setLoading,
  setBusinessPartnerGrid,
  setCargoList,
  setChartererRowData,
  setTotalAmountHandler,
  currentVoyageNo,
  getCurrentVoyageNo,
  setCurrentVoyageNo,
}) {
  const { profileData, selectedBusinessUnit } = useSelector((state) => {
    return state?.authData;
  }, shallowEqual);


  return (
    <>
      <div className="marine-form-card-content">
        <div className="row">
          <div className="col-lg-3">
            <FormikSelect
              value={values?.hireType}
              isSearchable={true}
              options={[
                { value: 1, label: "Own Ship" },
                { value: 2, label: "Charterer Ship" },
              ]}
              styles={customStyles}
              name="hireType"
              placeholder="Ship Type"
              label="Ship Type"
              onChange={(valueOption) => {
                setFieldValue("hireType", valueOption);
                setFieldValue("vesselName", "");
                setFieldValue("ownerName", "");
                setFieldValue("currentVoyageNo", "")
                setCurrentVoyageNo("")
                setVesselDDL([]);
                if (valueOption) {
                  getVesselDDL(
                    profileData?.accountId,
                    selectedBusinessUnit?.value,
                    setVesselDDL,
                    valueOption?.value === 2 ? 2 : ""
                  );
                }
              }}
              errors={errors}
              isDisabled={viewType}
              touched={touched}
            />
          </div>

          <div className="col-lg-3">
            <FormikSelect
              value={values?.voyageType}
              isSearchable={true}
              options={[
                { value: 1, label: "Time Charter" },
                { value: 2, label: "Voyage Charter" },
              ]}
              styles={customStyles}
              name="voyageType"
              placeholder="Voyage Type"
              label="Voyage Type"
              onChange={(valueOption) => {
                setBusinessPartnerGrid([]);
                setChartererRowData([]);
                setCargoList([]);
                setFieldValue("vesselName", "");
                setFieldValue("voyageType", valueOption);
              }}
              isDisabled={viewType}
              errors={errors}
              touched={touched}
            />
          </div>

          <div className="col-lg-3">
            <FormikSelect
              value={values?.vesselName}
              isSearchable={true}
              options={vesselDDL || []}
              styles={customStyles}
              name="vesselName"
              placeholder="Vessel Name"
              label="Vessel Name"
              onChange={(valueOption) => {
                setFieldValue("ownerName", valueOption?.ownerName || "");
                setFieldValue("ownerId", valueOption?.ownerId);
                setFieldValue("vesselName", valueOption);
                setFieldValue("currentVoyageNo", "")
                setCurrentVoyageNo("")
                if(valueOption){
                  getCurrentVoyageNo(`${imarineBaseUrl}/domain/Voyage/CurrentVoyageNo?BusinessUnitId=${selectedBusinessUnit?.value}&VesselId=${valueOption?.value}&HireTypeId=${values?.hireType?.value}`,(res)=>{
                    setFieldValue("currentVoyageNo", res || "")
                  })
                }
                if (values?.hireType?.value === 1) {
                  GetOwnerVesselCharterVoyageID(
                    valueOption?.value,
                    setFieldValue,
                    setLoading
                  );
                }
              }}
              isDisabled={viewType}
              errors={errors}
              touched={touched}
            />
          </div>
          <div className="col-lg-3">
            <label>Current Voyage No</label>
            <FormikInput
              value={values?.currentVoyageNo}
              name="currentVoyageNo"
              placeholder="Current Voyage No"
              onChange={(e) => {
                setFieldValue("currentVoyageNo", e.target.value)               
              }}
              type="number"
              errors={errors}
              touched={touched}
            />
          </div>
          {values?.chartererVoyageCode?.label && (
            <div className="col-lg-3">
              <FormikSelect
                value={values?.chartererVoyageCode}
                isSearchable={true}
                // options={[voyageCode]}
                styles={customStyles}
                name="chartererVoyageCode"
                placeholder="Charterer Voyage Code"
                label="Charterer Voyage Code"
                // onChange={(valueOption) => {
                //   setFieldValue("chartererVoyageCode", valueOption);
                // }}
                isDisabled={true}
                errors={errors}
                touched={touched}
              />
            </div>
          )}

          <div className="col-lg-3">
            <label>Vessel Owner Name</label>
            <FormikInput
              value={values?.ownerName}
              name="ownerName"
              placeholder="Vessel Owner Name"
              type="text"
              errors={errors}
              touched={touched}
              disabled={true}
            />
          </div>

          <div className="col-lg-3">
            <label>Voyage Commence Date (GMT)</label>
            <FormikInput
              value={values?.startDate}
              max={values?.completionDate}
              name="startDate"
              placeholder="Voyage Commence Date (GMT)"
              onChange={(e) => {
                setFieldValue("startDate", e.target.value);
                setFieldValue(
                  "voyageDuration",
                  getDifference(e.target.value, values?.completionDate)
                );

                /* Func For Total Amount Value Handler */
                setTotalAmountHandler(
                  {
                    ...values,
                    voyageDuration: getDifference(
                      e.target.value,
                      values?.completionDate
                    ),
                  },
                  setFieldValue
                );
              }}
              type="datetime-local"
              errors={errors}
              touched={touched}
              disabled={
                viewType === "view" ||
                (viewType === "edit" &&
                  values?.serverDatetime?.split("T")[0] !==
                    moment().format("YYYY-MM-DD"))
              }
            />
          </div>

          <div className="col-lg-3">
            <label>Voyage Completion Date (GMT)</label>
            <FormikInput
              value={values?.completionDate}
              name="completionDate"
              placeholder="Voyage Completion Date (GMT)"
              min={values?.startDate}
              onChange={(e) => {
                setFieldValue("completionDate", e.target.value);
                setFieldValue(
                  "voyageDuration",
                  getDifference(values?.startDate, e.target.value)
                );

                /* Func For Total Amount Value Handler */
                setTotalAmountHandler(
                  {
                    ...values,
                    voyageDuration: getDifference(
                      values?.startDate,
                      e.target.value
                    ),
                  },
                  setFieldValue
                );
              }}
              type="datetime-local"
              errors={errors}
              touched={touched}
              disabled={viewType === "view"}
            />
          </div>

          <div className="col-lg-3">
            <label>Voyage Duration (Days)</label>
            <FormikInput
              value={values?.voyageDuration}
              name="voyageDuration"
              placeholder="Voyage Duration (Days)"
              type="text"
              errors={errors}
              touched={touched}
              disabled={true}
            />
          </div>
        </div>
      </div>
    </>
  );
}
