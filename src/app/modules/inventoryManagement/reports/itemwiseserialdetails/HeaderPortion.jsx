import React from "react";
import InputField from "../../../_helper/_inputField";
import NewSelect from "../../../_helper/_select";
import { usedDDL } from "./constants";
import SearchAsyncSelect from "../../../_helper/SearchAsyncSelect";
import FormikError from "../../../_helper/_formikError";
import axios from "axios";

const HeaderPortion = ({
  values,
  setFieldValue,
  getReportData,
  touched,
  errors,
  profileData,
  selectedBusinessUnit,
}) => {
  console.log(values);
  return (
    <>
      <div className="col-lg-3">
        <label>From Date</label>
        <InputField
          value={values?.fromDate}
          name="fromDate"
          placeholder="From Date"
          type="date"
          onChange={(e) => {
            setFieldValue("fromDate", e?.target?.value);
          }}
        />
      </div>
      <div className="col-lg-3">
        <label>To Date</label>
        <InputField
          value={values?.toDate}
          name="toDate"
          placeholder="To Date"
          type="date"
          onChange={(e) => {
            setFieldValue("toDate", e?.target?.value);
          }}
        />
      </div>
      <div className="col-lg-3">
        <NewSelect
          name="usingStatus"
          label="Used/Unused Type"
          placeholder="Used/Unused Type"
          options={usedDDL}
          value={values?.usingStatus}
          onChange={(valueOption) => {
            setFieldValue("usingStatus", valueOption);
          }}
        />
      </div>
      <div className="col-lg-3">
        <label>Search Item</label>
        <SearchAsyncSelect
          selectedValue={values?.item}
          handleChange={(valueOption) => {
            setFieldValue("item", valueOption);
          }}
          loadOptions={(v) => {
            if (v?.length < 3) return [];
            return axios
              .get(
                `/wms/ItemPlantWarehouse/GetBasicItemDDLSearchableWithBusinessUnit?accountId=${profileData?.accountId}&businessUnitId=${selectedBusinessUnit?.value}&searchItem=${v}`
              )
              .then((res) => res?.data);
          }}
        />
        <FormikError errors={errors} name="assetNo" touched={touched} />
      </div>
      <div className="col-lg-3">
        <label>Serial Number</label>
        <InputField
          value={values?.serialNumber}
          name="serialNumber"
          placeholder="Serial Number"
          type="text"
          onChange={(e) => {
            setFieldValue("serialNumber", e?.target?.value);
          }}
        />
      </div>
      <div className="col-lg-2 " style={{ marginTop: "20px" }}>
        <button
          className="btn btn-primary mr-2"
          type="button"
          onClick={() => {
            getReportData(values);
          }}
        >
          View
        </button>
      </div>
    </>
  );
};

export default HeaderPortion;
