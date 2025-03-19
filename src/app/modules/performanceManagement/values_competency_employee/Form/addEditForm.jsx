/* eslint-disable no-script-url,jsx-a11y/anchor-is-valid,jsx-a11y/role-supports-aria-props */
import React, { useState, useEffect } from "react";
import { useSelector, shallowEqual, useDispatch } from "react-redux";
import Form from "./form";
import {
  getCompetencyListAction,
  getEmpDDLAction,
  getEmployeeBasicInfoByIdAction,
  getValueListAction,
  getValuesAndCompByEmpIdAction,
  getYearDDLAction,
  saveValuesAndCompetencyAction,
  SetCompetencyEmptyAction,
  SetEmployeeBasicInfoEmptyAction,
  SetValAndCompByEmpIdEmptyAction,
  SetValuesListEmptyAction,
} from "../../_redux/Actions";
import { toast } from "react-toastify";
import IForm from "../../../_helper/_form";
import { useLocation } from 'react-router-dom';

const initData = {
  searchEmployee: "",
  year: "",
  quarter: "",
  type: "private",
};

export default function ValuesAndCompetencyPage() {
  const [isDisabled, setDisabled] = useState(true);
  const [year, setYear] = useState("");
  const [chackBox, setChackBox] = useState(false);
  const {state: headerData} = useLocation()
  console.log(headerData)
  let pmsData = useSelector(
    (state) => {
      return {
        profileData: state.authData.profileData,
        selectedBusinessUnit: state.authData.selectedBusinessUnit,
        employeeBasicInfo: state.performanceMgt?.employeeBasicInfo,
        yearDDL: state.performanceMgt?.yearDDL,
        valueList: state.performanceMgt.valuesList,
        competencyList: state.performanceMgt.competencyList,
        vcData: state.performanceMgt.valAndCompByEmpId,
        empDDL: state.performanceMgt?.empDDL,
      };
    },
    { shallowEqual }
  );

  let {
    profileData,
    selectedBusinessUnit,
    employeeBasicInfo,
    yearDDL,
    valueList,
    competencyList,
    vcData,
    empDDL,
  } = pmsData;

  const dispatch = useDispatch();
  const [valuesData, setValuesData] = useState({});
  const [competencyData, setCompetencyData] = useState({});
  const [valueObj, setValueObj] = useState([]);
  const [objProps, setObjprops] = useState({});

  useEffect(() => {
    if (profileData) {
      dispatch(getEmployeeBasicInfoByIdAction(profileData?.userId));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profileData]);

  useEffect(() => {
    let payloadOne;
    let payloadTwo;
    if (valuesData && valueList.length) {
      let newData = valueList && [...valueList];
      payloadOne = newData.map((itm, index) => {
        return {
          ...itm,
          measure: valuesData[index + 1] || null,
        };
      });
    }
    if (competencyData && competencyList.length) {
      let newData = competencyList && [...competencyList];
      payloadTwo = newData.map((itm, index) => {
        return {
          ...itm,
          measure: competencyData[index + 1] || null,
        };
      });
    }
    if (payloadOne && payloadTwo) {
      setValueObj([...payloadOne, ...payloadTwo]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [valuesData, valueList]);

  useEffect(() => {
    if (profileData && selectedBusinessUnit) {
      dispatch(
        getYearDDLAction(profileData?.accountId, selectedBusinessUnit?.value)
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

  const getValueAndCompList = (empId) => {
    if (profileData && selectedBusinessUnit && (employeeBasicInfo || empId)) {
      dispatch(
        getCompetencyListAction(
          profileData?.accountId,
          selectedBusinessUnit?.value,
          employeeBasicInfo?.employeeId || empId
        )
      );
      dispatch(
        getValueListAction(profileData?.accountId, selectedBusinessUnit?.value)
      );
    }
  };

  const saveHandler = async (values, cb) => {
    setDisabled(true);
    if (values && profileData && selectedBusinessUnit?.value) {
      if (!valueList.length || !competencyList.length) {
        toast.warn("Values and competencies are required");
      } else {
        let isDisabled = false;
        let row = valueObj.map((itm, index) => {
          if (!itm.measure) {
            isDisabled = true;
          }
          return {
            typeId: itm?.competencyId ? 3 : 2,
            valuesOrComId: itm?.coreValueId || itm?.competencyId,
            valuesOrComName: itm?.competencyName || itm?.coreValueName,
            numDesiredValue: +itm?.numDesiredValue,
            measureIdByEmployee: itm?.measure?.id || 0,
            measureNameByEmployee: itm?.measure?.label || null,
            numMeasureValueByEmployee: +itm?.measure?.measureValue,
          };
        });
        let payload = {
          objHeader: {
            accountId: +profileData?.accountId,
            businessUnitId: +selectedBusinessUnit?.value,
            sbuid: +employeeBasicInfo?.sbuId,
            yearId: +year,
            employeeId: +employeeBasicInfo?.employeeId,
            actionBy: +profileData?.userId,
          },
          objRow: row,
        };
        if (isDisabled) {
          toast.warning("Select all fields");
        } else {
          dispatch(saveValuesAndCompetencyAction({ data: payload, cb }));
        }
      }
    } else {
      setDisabled(false);
    }
  };

  const disableHandler = (cond) => {
    setDisabled(cond);
  };

  useEffect(() => {
    if (yearDDL.length) {
      dispatch(
        getValuesAndCompByEmpIdAction(profileData.userId, yearDDL[0].value)
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [yearDDL]);

  //remove store data
  useEffect(() => {
    return () => {
      dispatch(SetEmployeeBasicInfoEmptyAction());
      dispatch(SetValAndCompByEmpIdEmptyAction());
      dispatch(SetValuesListEmptyAction());
      dispatch(SetCompetencyEmptyAction());
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (yearDDL.length && profileData.userId) {
      dispatch(
        getValuesAndCompByEmpIdAction(profileData.userId, yearDDL[0].value)
      );

      getValueAndCompList(profileData.userId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [yearDDL, profileData]);



  return (
    <IForm
      title="VALUES AND COMPETENCIES BY EMPLOYEE"
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
        employeeBasicInfo={employeeBasicInfo}
        yearDDL={yearDDL}
        valueList={valueList}
        competencyList={competencyList}
        vcData={vcData?.objRow}
        setYear={setYear}
        year={year}
        valuesData={valuesData}
        setValuesData={setValuesData}
        competencyData={competencyData}
        setCompetencyData={setCompetencyData}
        getValuesAndCompByEmpIdAction={getValuesAndCompByEmpIdAction}
        profileData={profileData}
        getValueAndCompList={getValueAndCompList}
        empDDL={empDDL}
        setChackBox={setChackBox}
        chackBox={chackBox}
        setValueObj={setValueObj}
      />
    </IForm>
  );
}
