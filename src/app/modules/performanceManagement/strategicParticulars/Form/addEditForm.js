/* eslint-disable no-script-url,jsx-a11y/anchor-is-valid,jsx-a11y/role-supports-aria-props */
import React, { useState, useEffect } from "react";
import { useSelector, shallowEqual, useDispatch } from "react-redux";
import Form from "./form";

import {
  getStrategicParticularsTypeDDLAction,
  getStrategicObjectiveTypeDDLAction,
  getStrategicParticularsGridActions,
  saveStrategicParticulars,
  setParticullersGridEmpty,
  getStrategicParticularsById,
  saveEditedStrategicParticulars,
} from "../_redux/Actions";
import { toArray } from "lodash";
import IForm from "../../../_helper/_form";
import {
  getEmpDDLCommonAction,
  getPMSFrequencyDDLAction,
  getSbuDDLAction,
} from "../../../_helper/_redux/Actions";
import {
  getBSCPerspectiveDDLAction,
  getYearDDLAction,
} from "../../_redux/Actions";
import { toast } from "react-toastify";
import { getStrategicParticularsSingleEmpty } from "./../_redux/Actions";
import { _todayDate } from "../../../_helper/_todayDate";

const initData = {
  id: undefined,
  strategyFor: "",
  sbu: "",
  department: "",
  year: "",
  strategicParticularType: "",
  forObjective: "",
  owner: "",
  priority: "",
  maxi_mini: "",
  aggregationType: "",
  targetFrequency: "",
  strategicParticularsName: "",
  numBudget: "",
  targetArea: "",
  resource: "",
  remarks: "",
  startDate: "",
  endDate: "",
  bscPerspective: "",
  isForEmployee: false,
  isForSbu: false,
  isForDepartment: false,
  description: "",
  isForCorporate: false,
  planType: "",
};

export default function StrategicParticularsForm({
  history,
  match: {
    params: { strId },
  },
}) {
  const [isDisabled, setDisabled] = useState(true);
  const dispatch = useDispatch();
  const [objProps, setObjprops] = useState({});
  const [strategicParticularsRow, setStrategicParticularsRow] = useState([]);
  const [depDDL, setDepDDL] = useState([]);

  // storeData
  const storeData = useSelector((state) => {
    return {
      profileData: state.authData.profileData,
      selectedBusinessUnit: state.authData.selectedBusinessUnit,
      sbuDDL: state.commonDDL.sbuDDL,
      // departmentDDL: state.strategicParticularsTwo?.departmentDDL,
      strategicParticularsTypeDDL:
        state.strategicParticularsTwo?.strategicParticularsTypeDDL,
      singleData: state.strategicParticularsTwo?.singleData,
      empDDL: state?.commonDDL?.empDDL,
      yearDDL: state?.performanceMgt?.yearDDL,
      frequencyDDL: state?.commonDDL?.frequencyDDL,
      strategicObjectiveTypeDDL:
        state?.strategicParticularsTwo?.strategicObjectiveTypeDDL,
      strategicParticularsGrid:
        state?.strategicParticularsTwo?.strategicParticularsGrid,
      bscPerspectiveDDL: state?.performanceMgt?.bscPerspectiveDDL,
    };
  }, shallowEqual);

  const {
    profileData,
    selectedBusinessUnit,
    sbuDDL,
    strategicParticularsTypeDDL,
    singleData,
    bscPerspectiveDDL,
    strategicParticularsGrid,
    strategicObjectiveTypeDDL,
    frequencyDDL,
    yearDDL,
    empDDL,
  } = storeData;

  const saveHandler = async (values, cb) => {
    setDisabled(true);
    if (values && profileData?.accountId && selectedBusinessUnit?.value) {
      if (strId) {
        const { header, rowDto } = values;
        const objHeader = {
          edit_Version: 1,
          strategicParticularsId: +strId,
          sbuid: +header.sbu?.value || 0,
          departmentId: +header.department?.value || 0,
          strategicParticularsName: header.strategicParticularsName || "",
          strategicParticularsTypeId: +header.strategicParticularType?.value || 0,
          description: header.description || "",
          parentId: +header.forObjective?.value || 0,
          parentName: header.forObjective?.label || "",
          bscperspectiveId: +header.bscPerspective?.value || 0,
          pmsfrequencyId: +header.targetFrequency?.value || "",
          ownerId: header.owner?.value || 0,
          ownerName: header.owner?.label || "",
          priorityId: header.priority?.value || 0,
          priorityName: header.priority?.label || "",
          resource: header.resource || "",
          numBudget: header.numBudget || 0,
          versionChangeReason: "string",
          targetArea: header.targetArea || "",
          maxiMini: header.maxi_mini?.label || "",
          aggregation: header.aggregationType?.label || "",
          remarks: header.remarks || "",
          isForSbu: header.isForSbu,
          isForDepartment: header.isForDepartment,
          isForEmployee: header.isForEmployee,
          isForCorporate: header?.isForCorporate,
          // don't change this condition unless you know the business properly
          corporateDepartmentId: header?.isForCorporate ? (header?.department?.value || 0) : 0,
          actionBy: profileData?.userId,
          planTypeId: header?.planType?.value,
          planTypeName: header?.planType?.label,
        };
        const data = toArray(rowDto)?.map((itm, index) => ({
          rowId: itm?.rowId,
          quarterId: itm?.quarterId || 0,
          monthId: itm?.monthId || null,
          target: +itm?.target,
          startDate: itm?.startDate,
          endDate: itm?.endDate,
          remarks: itm.remarks,
          actualEndDate: itm?.actualEndDate || _todayDate(),
        }));
        const payload = {
          objHeader,
          objRow: data,
        };

        if (header.isForEmployee || header.isForSbu || header.isForDepartment) {
          if (header.isForDepartment === true && !header.department?.value) {
            toast.warning("Please select department", { toastId: "depError" });
          } else if (header.isForSbu === true && !header.sbu?.value) {
            toast.warning("Please select SBU", { toastId: "sbuError" });
          } else {
            dispatch(saveEditedStrategicParticulars({ data: payload, cb }));
          }
        } else {
          toast.warn("Select Employee or Department or SBU checkbox");
        }
      } else {
        const { header, rowDto } = values;
        const objHeader = {
          accountId: profileData?.accountId,
          businessUnitId: selectedBusinessUnit.value,
          sbuid: header.sbu?.value || 0,
          yearId: header.year?.value || 0,
          departmentId: header.department?.value || 0,
          strategicParticularsName: header.strategicParticularsName || "",
          strategicParticularsTypeId: header.strategicParticularType?.value || 0,
          strategicParticularsTypeName: header.strategicParticularType?.label || "",
          parentId: header.forObjective?.value || 0,
          parentName: header.forObjective?.label || "",
          bscperspectiveId: header.bscperspective?.value || 0,
          bscperspectiveName: header.bscperspective?.label || "",
          pmsfrequencyId: header.targetFrequency?.value,
          frequencyName: header.targetFrequency?.label,
          ownerId: header.owner?.value || 0,
          ownerName: header.owner?.label || "",
          priorityId: header.priority?.value || 0,
          priorityName: header.priority?.label || "",
          bscPerspectiveId: header.bscPerspective?.value || 0,
          bscPerspectiveName: header.bscPerspective?.label || "",
          resource: header.resource || "",
          numBudget: header.numBudget || 0,
          targetArea: header.targetArea || "",
          version: 1,
          versionChangeReason: "",
          maxiMini: header.maxi_mini?.label || "",
          aggregation: header.aggregationType?.label || "",
          remarks: header.remarks || "",
          isForSbu: header.isForSbu,
          isForDepartment: header.isForDepartment,
          isForEmployee: header.isForEmployee,
          isForCorporate: header?.isForCorporate,
          // don't change this condition unless you know the business properly
          corporateDepartmentId: header?.isForCorporate ? (header?.department?.value || 0) : 0,
          actionBy: profileData.userId,
          description: header.description || "",
          planTypeId: header?.planType?.value,
          planTypeName: header?.planType?.label,
        };
        const data = toArray(rowDto)?.map((itm, index) => ({
          ...itm,
          target: +itm.target,
          remarks: itm.remarks
        }));
        console.log("data", data)
        const payload = {
          objHeader,
          objListRow: data,
        };

        if (header.isForEmployee || header.isForSbu || header.isForDepartment || header?.isForCorporate) {
          if (header.isForDepartment === true && !header.department?.value) {
            toast.warning("Please select department", { toastId: "depError" });
          } else if (header.isForSbu === true && !header.sbu?.value) {
            toast.warning("Please select SBU", { toastId: "sbuError" });
          } else if (header.isForCorporate === true && !header.department?.value) {
            toast.warning("Please select department", { toastId: "depError" });
          }
          else {
            dispatch(saveStrategicParticulars({ data: payload, cb }));
          }
        } else {
          toast.warn("Select Employee or Department or SBU or Corporate checkbox");
        }
      }
    } else {
      setDisabled(false);
    }
  };

  

  //dispatch  action
  useEffect(() => {
    if (selectedBusinessUnit?.value && profileData?.accountId) {
      dispatch(
        getSbuDDLAction(profileData.accountId, selectedBusinessUnit.value)
      );
      dispatch(
        getEmpDDLCommonAction(profileData.accountId, selectedBusinessUnit.value)
      );
      dispatch(getPMSFrequencyDDLAction());
      dispatch(
        getStrategicParticularsTypeDDLAction(
          profileData.accountId,
          selectedBusinessUnit.value
        )
      );
      dispatch(getBSCPerspectiveDDLAction());
      dispatch(
        getYearDDLAction(profileData.accountId, selectedBusinessUnit.value)
      );
      dispatch(
        getStrategicObjectiveTypeDDLAction(
          profileData.accountId,
          selectedBusinessUnit.value
        )
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profileData, selectedBusinessUnit]);

  useEffect(() => {
    return () => dispatch(setParticullersGridEmpty());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // dipatch getStrategicParticularsGridAction
  const getStrategicParticularsGridActionDispatcher = (frequencyId, values) => {
    dispatch(
      getStrategicParticularsGridActions(
        profileData.accountId,
        selectedBusinessUnit.value,
        values.year?.value,
        values.year?.label,
        frequencyId,
        5,
        values
      )
    );
  };

  const disableHandler = (cond) => {
    setDisabled(cond);
  };
  //Dispatch single data action and empty single data for create
  useEffect(() => {
    if (strId) {
      dispatch(getStrategicParticularsById(strId));
    } else {
      dispatch(getStrategicParticularsSingleEmpty());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [strId]);

  useEffect(() => {
    setStrategicParticularsRow(strategicParticularsGrid);
  }, [strategicParticularsGrid]);

  useEffect(() => {
    const rowsingleData = singleData.objListRow;
    if (rowsingleData) {
      setStrategicParticularsRow([...singleData?.objListRow]);
    }
  }, [singleData]);

  return (
    <IForm
      title={strId ? "EDIT STRATEGIC PLAN" : "CREATE STRATEGIC PLAN"}
      getProps={setObjprops}
      isDisabled={isDisabled}
    >
      <Form
        {...objProps}
        initData={singleData?.objHeader || initData}
        objListRow={singleData?.objListRow}
        saveHandler={saveHandler}
        disableHandler={disableHandler}
        accountId={profileData?.accountId}
        selectedBusinessUnit={selectedBusinessUnit}
        sbuDDL={sbuDDL}
        strategicParticularsTypeDDL={strategicParticularsTypeDDL}
        depDDL={depDDL}
        setDepDDL={setDepDDL}
        empDDL={empDDL}
        frequencyDDL={frequencyDDL}
        strategicObjectiveTypeDDL={strategicObjectiveTypeDDL}
        getStrategicParticularsGridActionDispatcher={
          getStrategicParticularsGridActionDispatcher
        }
        frequencyId={strategicParticularsGrid?.frequencyId}
        yearDDL={yearDDL}
        strategicParticularsGrid={strategicParticularsRow?.data}
        bscPerspectiveDDL={bscPerspectiveDDL}
        singleData={singleData}
        strId={strId}
      />
    </IForm>
  );
}
