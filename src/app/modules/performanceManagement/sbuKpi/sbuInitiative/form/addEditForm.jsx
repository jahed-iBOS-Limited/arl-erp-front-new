import React, { useState, useEffect } from "react";
import { useSelector, shallowEqual } from "react-redux";
import Form from "./form";
import IForm from "../../../../_helper/_form";
import Loading from "../../../../_helper/_loading";
import { getYearDDL, getCategoryDDL } from "../helper";
import { getSbuDDLAction } from "../helper";
import Help from "../../../help/Help";

let initData = {
  sbu: "",
  year: "",
  category: "",
};

export function SBUInitiativeForm({
  history,
  match: {
    params: { id },
  },
}) {
  /* eslint-disable no-unused-vars */
  const [isDisabled, setDisabled] = useState(false);
  const [sbuDDL, setSbuDDL] = useState([]);
  const [year, setYear] = useState([]);
  const [category, setCategory] = useState([]);

  const { profileData, selectedBusinessUnit } = useSelector((state) => {
    return state.authData;
  }, shallowEqual);

  useEffect(() => {
    getSbuDDLAction(
      profileData?.accountId,
      selectedBusinessUnit?.value,
      setSbuDDL
    );
    getYearDDL(profileData?.accountId, selectedBusinessUnit?.value, setYear);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profileData, selectedBusinessUnit]);

  useEffect(() => {
    getCategoryDDL(setCategory);
  }, []);

  const saveHandler = async (values, cb) => {};

  const [objProps, setObjprops] = useState({});

  return (
    <IForm
      title={"SBU Initiative"}
      getProps={setObjprops}
      isDisabled={isDisabled}
      isHiddenReset={true}
      isHiddenBack={true}
      isHiddenSave={true}
      isHelp={true}
      helpModalComponent={<Help />}
    >
      {isDisabled && <Loading />}
      <div className="mt-0">
        <Form
          {...objProps}
          initData={initData}
          sbuDDL={sbuDDL}
          year={year}
          category={category}
          saveHandler={saveHandler}
        />
      </div>
    </IForm>
  );
}
