import React, { useState, useEffect } from "react";
import { useSelector, shallowEqual } from "react-redux";
import Form from "./form";
import IForm from "../../../../_helper/_form";
import Loading from "../../../../_helper/_loading";
import { getPositionGroupDDL } from "../helper";
import { toast } from "react-toastify";

let initData = {
  empPosGroup: "",
  hrPos: "",
  empGrade: "",
  code: "",
};

export function EmpGradeTwoForm({
  history,
  match: {
    params: { id },
  },
}) {
  const [isDisabled, setDisabled] = useState(false);
  const [positiontDDL, setPositionDDL] = useState([]);
  const [hrPositionDDL, setHrPositionDDL] = useState([]);
  const [rowDto, setRowDto] = useState([]);

  const { profileData, selectedBusinessUnit } = useSelector((state) => {
    return state.authData;
  }, shallowEqual);

  // useEffect
  useEffect(() => {
    getPositionGroupDDL(setPositionDDL);
  }, []);

  const saveHandler = async (values, cb) => {
    if(rowDto?.length < 1) return toast.warn("Please add at least one row")
  };

  const [objProps, setObjprops] = useState({});

  return (
    <IForm
      title={"Create Employee Grade Two"}
      getProps={setObjprops}
      isDisabled={isDisabled}
    >
      {isDisabled && <Loading />}
      <div className="mt-0">
        <Form
          {...objProps}
          initData={initData}
          saveHandler={saveHandler}
          obj={{ positiontDDL, setHrPositionDDL, hrPositionDDL }}
        />
      </div>
    </IForm>
  );
}
