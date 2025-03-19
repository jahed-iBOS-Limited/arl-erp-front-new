import React, { useState } from "react";
import useAxiosGet from "../../../_helper/customHooks/useAxiosGet";
import IForm from "../../../_helper/_form";
import Loading from "../../../_helper/_loading";
import { DateWiseReportForm } from "./Form/form";
import { DateWiseReportTable } from "./Table/table";
import "./style.css";

export default function DateWiseReport() {
  // eslint-disable-next-line no-unused-vars
  const [isDisabled, setDisabled] = useState(false);
  // eslint-disable-next-line no-unused-vars
  const [objProps, setObjprops] = useState({});
  // eslint-disable-next-line no-unused-vars
  const [landingData, getData, getLoading, setLoadingData] = useAxiosGet();
  const [filterObj, setFilterObj] = useState(null);

  return (
    <IForm
      title={"Date Wise Report"}
      getProps={setObjprops}
      isDisabled={isDisabled}
      isHiddenBack={true}
      isHiddenReset={true}
      isHiddenSave={true}
    >
      {(isDisabled || getLoading) && <Loading />}
      <div className="mt-5">
        <DateWiseReportForm getData={getData} setFilterObj={setFilterObj}/>
        <DateWiseReportTable landingData={landingData} filterObj={filterObj}/>
      </div>
    </IForm>
  );
}
