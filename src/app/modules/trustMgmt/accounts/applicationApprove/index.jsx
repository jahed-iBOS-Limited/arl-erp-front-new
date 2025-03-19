import React, { useState } from "react";
import useAxiosGet from "../../../_helper/customHooks/useAxiosGet";
import IForm from "../../../_helper/_form";
import Loading from "../../../_helper/_loading";
import { ApplicationApproveForm } from "./Form/applicationApproveFrom";
import { ApplicationApproveTable } from "./Table/applicationAppoveTable";
import "./style.css";

export default function ApplicationApprove() {
  // eslint-disable-next-line no-unused-vars
  const [isDisabled, setDisabled] = useState(false);
  // eslint-disable-next-line no-unused-vars
  const [objProps, setObjprops] = useState({});
  // eslint-disable-next-line no-unused-vars
  const [landingData, getData, getLoading, setLoadingData] = useAxiosGet();
  const [filterObj, setFilterObj] = useState("");

  return (
    <IForm
      title={"Application Approve"}
      getProps={setObjprops}
      isDisabled={isDisabled}
      isHiddenBack={true}
      isHiddenReset={true}
      isHiddenSave={true}
    >
      {(isDisabled || getLoading) && <Loading />}
      <div className="mt-0">
        <ApplicationApproveForm getData={getData} setFilterObj={setFilterObj} />
        <ApplicationApproveTable
          getData={getData}
          landingData={landingData}
          filterObj={filterObj}
        />
      </div>
    </IForm>
  );
}
