import React from "react";
import NewSelect from "../../../_helper/_select";
function StrategicHeader() {
  return (
    <div className="row pb-2 px-2">
      <div className="col-lg-3">
        <NewSelect
          name="supplier"
          options={[
            { value:"",label:"Development"},
            { value:"",label:"Sbu"}
          ]}
          // value={values?.supplier}
          label="Supplier Name"
          onChange={(valueOption) => {
            // setFieldValue("supplier", valueOption);
          }}
          placeholder="Supplier Name"
          errors={{}}
          touched={{}}
          isDisabled={{}}
        />
      </div>
      <div className="col-lg-3">DDL</div>
    </div>
  );
}

export default StrategicHeader;
