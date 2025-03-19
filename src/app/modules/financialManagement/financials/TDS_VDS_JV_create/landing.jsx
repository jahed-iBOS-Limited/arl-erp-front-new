import React, { useState } from "react";
import IForm from "../../../_helper/_form";
import Form from "./form";

export default function TdsVdsJvLanding() {
  // eslint-disable-next-line no-unused-vars
  const [isDisabled, setDisabled] = useState(true);
  const [objProps, setObjprops] = useState({});
  return (
    <IForm
      title={"TDS VDS JV Create"}
      getProps={setObjprops}
      isDisabled={isDisabled}
      isHiddenBack={true}
      isHiddenSave={false}
      isHiddenReset={true}
    >
      <Form {...objProps} setDisabled={setDisabled}/>
    </IForm>
  );
}
