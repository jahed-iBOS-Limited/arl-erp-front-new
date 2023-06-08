import React, { useState, useEffect } from "react";
import { useSelector, shallowEqual, useDispatch } from "react-redux";
import Form from "./form";
import IForm from "./../../../../../_helper/_form";
import { getEmployeeBasicInfoByIdAction, getValuesAndCompByEmpIdAction } from "../../../../_redux/Actions";
import { useLocation } from 'react-router';


const initData = {};

export default function ValuesAndCompetencyPage() {
  const [isDisabled, setDisabled] = useState(true);

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
        measureScaleTop: state.performanceMgt.measuringScale,
        measuringScaleButtom: state.performanceMgt.measuringScaleButtom,
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
    measureScaleTop,
    measuringScaleButtom
  } = pmsData;

  const dispatch = useDispatch();
  const [valuesData, setValuesData] = useState({});
  const [competencyData, setCompetencyData] = useState({});
  const { state: headerData} = useLocation();
  const [objProps, setObjprops] = useState({});

  // here we faces is a yearId issue, that need to be solved.
  useEffect(() => {
    if (headerData?.employeeId) {
      dispatch(getEmployeeBasicInfoByIdAction(headerData?.employeeId));
      dispatch(getValuesAndCompByEmpIdAction(headerData?.employeeId, 11));
    }
    
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [headerData]);

  useEffect(() => {
    // eslint-disable-next-line no-unused-vars
    let payloadOne;
    // eslint-disable-next-line no-unused-vars
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

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [valuesData, valueList]);

  const disableHandler = (cond) => {
    setDisabled(cond);
  };

  return (
    <IForm
      title="VALUES AND COMPETENCIES BY EMPLOYEE"
      getProps={setObjprops}
      isDisabled={isDisabled}
      isHiddenBack={false}
    >
      <Form
        {...objProps}
        initData={initData}
        disableHandler={disableHandler}
        accountId={profileData?.accountId}
        selectedBusinessUnit={selectedBusinessUnit}
        isEdit={false}
        employeeBasicInfo={employeeBasicInfo}
        yearDDL={yearDDL}
        valueList={valueList}
        competencyList={competencyList}
        vcData={vcData?.objRow}
        valuesData={valuesData}
        setValuesData={setValuesData}
        competencyData={competencyData}
        setCompetencyData={setCompetencyData}
        getValuesAndCompByEmpIdAction={getValuesAndCompByEmpIdAction}
        profileData={profileData}
        headerData={headerData}
        measureScaleTop={measureScaleTop}
        measuringScaleButtom ={measuringScaleButtom}

      />
    </IForm>
  );
}
