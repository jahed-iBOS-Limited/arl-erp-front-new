import React, { useState, useEffect } from "react";
import { useSelector, shallowEqual } from "react-redux";
import Form from "./form";
import IForm from "../../../../_helper/_form";
import Loading from "../../../../_helper/_loading";
import {
  getCorporateDepartmentDDL,
  getYearDDL,
  getCategoryDDL,
} from "../helper";

let initData = {
  corporateDepartment: "",
  year: "",
  category: "",
};

export function CorporateInitiativeForm({
  history,
  match: {
    params: { id },
  },
}) {
  /* eslint-disable no-unused-vars */
  const [isDisabled, setDisabled] = useState(false);
  const [corporateDDL, setCorporateDDL] = useState([]);
  const [year, setYear] = useState([]);
  const [category, setCategory] = useState([]);

  const { profileData, selectedBusinessUnit } = useSelector((state) => {
    return state.authData;
  }, shallowEqual);

  useEffect(() => {
    getCorporateDepartmentDDL(
      profileData?.accountId,
      selectedBusinessUnit?.value,
      setCorporateDDL
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
      title={"Corporate Initiative"}
      getProps={setObjprops}
      isDisabled={isDisabled}
      isHiddenReset={true}
      isHiddenBack={true}
      isHiddenSave={true}
    >
      {isDisabled && <Loading />}
      <div className="mt-0">
        <Form
          {...objProps}
          initData={initData}
          corporateDDL={corporateDDL}
          year={year}
          category={category}
          saveHandler={saveHandler}
        />
      </div>
    </IForm>
  );
}
