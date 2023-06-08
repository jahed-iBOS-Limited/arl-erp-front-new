import React, { useState } from "react";
import useAxiosGet from "../../../_helper/customHooks/useAxiosGet";
import IForm from "../../../_helper/_form";
import Loading from "../../../_helper/_loading";
import Form from "./form";
import MonthWiseTable from "./monthWiseTable";

const initData = {
  fromDate: "",
  toDate: "",
  unitName: "",
};

export default function MonthWiseReport() {
  const [isDisabled, ] = useState(false);
  const [objProps, setObjprops] = useState({});
  const [rowDto, getData, , ] = useAxiosGet();


  return (
    <IForm
      title={"Month Wise Report"}
      getProps={setObjprops}
      isHiddenBack={true}
      isHiddenReset={true}
      isHiddenSave={true}
      isDisabled={isDisabled}
    >
      {isDisabled && <Loading />}
      <Form
        {...objProps}
        initData={initData}
        getData={getData}
        rowDto={rowDto}
      />
      <MonthWiseTable rowDto={rowDto}/>
    </IForm>
  );
}
