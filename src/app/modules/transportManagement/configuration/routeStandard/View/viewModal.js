import React, { useState } from "react";
import IForm from "../../../../_helper/_form";
import Form from "./form";


const initData = {
  id: undefined,
  transportOrganizationName: "",
  routeName: "",
  vehicleCapacity: "",
  componentName: "",
  amount: "",
  itemLists: [],
};

export default function RouteStandardViewModal({ landingData, type }) {

  const [objProps, setObjprops] = useState({});

  return (
    <IForm
      title='View Route Cost Setup'
      getProps={setObjprops}
      isHiddenBack={true}
      isHiddenSave={type === "view"}
      isHiddenReset={type === "view"}
    >
      <Form
        {...objProps}
        initData={initData}
        landingData={landingData}
        type={type}
      />
    </IForm>
  );
}
