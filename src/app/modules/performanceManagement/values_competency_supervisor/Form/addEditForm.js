/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-script-url,jsx-a11y/anchor-is-valid,jsx-a11y/role-supports-aria-props */
import React, { useState, useEffect } from "react";
import { useSelector, shallowEqual, useDispatch } from "react-redux";
import Form from "./form";
import {
  getEmpDDLAction,
  getYearDDLAction,
  SetEmployeeBasicInfoEmptyAction,
  updateValAndCompAction,
} from "../../_redux/Actions";
import { toast } from "react-toastify";
import IForm from "../../../_helper/_form";

const initData = {
  searchEmployee: "",
  year: "",
};

export default function ValuesAndCompetencyPage() {
  const [isDisabled, setDisabled] = useState(true);
  const [objProps, setObjprops] = useState({});
  const [valueList, setValues] = useState([]);
  const [competency, setCompetency] = useState([]);

  const [valuesData, setValuesData] = useState({});
  const [competencyData, setCompetencyData] = useState({});

  const [valueObj, setValueObj] = useState([]);
  const [competencyObj, setCompetencyObj] = useState([]);

  // emp basic info
  const pmsData = useSelector((state) => {
    return {
      employeeBasicInfo: state.performanceMgt?.employeeBasicInfo,
      valueList: state.performanceMgt.valuesList,
      competencyList: state.performanceMgt.competencyList,
    };
  }, shallowEqual);

  // emp basic info
  const valAndCompByEmpId = useSelector((state) => {
    return state.performanceMgt?.valAndCompByEmpId?.objRow;
  }, shallowEqual);

  // emp basic info
  const empDDL = useSelector((state) => {
    return state.performanceMgt?.empDDL;
  }, shallowEqual);

  // get year ddl from store
  const yearDDL = useSelector((state) => {
    return state?.performanceMgt?.yearDDL;
  }, shallowEqual);

  // get user profile data from store
  const profileData = useSelector((state) => {
    return state.authData.profileData;
  }, shallowEqual);

  // get selected business unit from store
  const selectedBusinessUnit = useSelector((state) => {
    return state.authData.selectedBusinessUnit;
  }, shallowEqual);

  const dispatch = useDispatch();
  //Dispatch Get EmpSupDDLAction & EmpInfoId & competencyListAction
  useEffect(() => {
    if (profileData) {
      dispatch(
        getYearDDLAction(profileData.accountId, selectedBusinessUnit.value)
      );
      dispatch(
        getEmpDDLAction(
          profileData.accountId,
          selectedBusinessUnit.value,
          profileData?.userId
        )
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profileData, selectedBusinessUnit]);

  const saveHandler = async (values, cb) => {
    setDisabled(true);
    if (values && profileData?.accountId && selectedBusinessUnit?.value) {
      const marge = [...valueObj, ...competencyObj];
      let isDisabled = false;
      const payload = marge.map((itm) => {
        console.log(itm?.value);
        if (itm?.value === undefined) {
          isDisabled = true;
        }
        return {
          detailsId: itm.detailsId,
          measureIdBySupervisor: itm?.value?.id,
          measureNameBySupervisor: itm?.value?.label,
          numMeasureValueBySupervisor: itm?.value?.measureValue,
        };
      });
   
      if (isDisabled) {
        toast.warning("Select all fields");
      } else {
        dispatch(updateValAndCompAction({ data: payload, cb }));
      }
    } else {
      setDisabled(false);
      
    }
  };

  const disableHandler = (cond) => {
    setDisabled(cond);
  };

  //VALUES and COMPETENCY typeId chack
  useEffect(() => {
    const objRow = valAndCompByEmpId;
    if (objRow && valAndCompByEmpId) {
      let _values = [];
      let _competency = [];
      objRow.forEach((itm) => {
        if (itm.typeId === 2) {
          _values.push(itm);
        } else {
          _competency.push(itm);
        }
      });
      setValues(_values);
      setCompetency(_competency);
    } else {
      setValues([]);
      setCompetency([]);
    }
  }, [valAndCompByEmpId]);

  useEffect(() => {
    // let newValuesData = toArray(valuesData);
    if (valuesData && valueList.length) {
      let newData = valueList && [...valueList];
      let payload = newData.map((itm, index) => {
        return {
          ...itm,
          value: valuesData[index + 1],
        };
      });
      setValueObj([...payload]);
    }
  }, [valuesData, valueList]);
  useEffect(() => {
    // let newCompetencyData = toArray(competencyData);
    if (competencyData && competency.length) {
      let newData = competency && [...competency];
      let payload = newData.map((itm, index) => {
        return {
          ...itm,
          value: competencyData[index + 1],
        };
      });
      setCompetencyObj([...payload]);
    }
  }, [competencyData, competency]);

  useEffect(() => {
    return () => {
      dispatch(SetEmployeeBasicInfoEmptyAction());
    };
  }, []);
  return (
    <IForm
      title="VALUES AND COMPETENCIES BY SUPERVISOR"
      getProps={setObjprops}
      isDisabled={isDisabled}
      isHiddenBack={true}
    >
      <Form
        {...objProps}
        initData={initData}
        saveHandler={saveHandler}
        disableHandler={disableHandler}
        accountId={profileData?.accountId}
        selectedBusinessUnit={selectedBusinessUnit}
        isEdit={false}
        employeeBasicInfo={pmsData.employeeBasicInfo}
        yearDDL={yearDDL}
        empDDL={empDDL}
        valueList={valueList}
        competencyList={competency}
        valuesData={valuesData}
        setValuesData={setValuesData}
        competencyData={competencyData}
        setCompetencyData={setCompetencyData}
        setValues={setValues}
        setCompetency={setCompetency}
      />
    </IForm>
  );
}
