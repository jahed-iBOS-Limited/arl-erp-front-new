/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */

/* 

  Don't touch any single code without permission by Jayed Sir! 

*/

import React, { useState, useEffect } from "react";
import Form from "./form";
import "./style.css";
import { createEmpRemuSetup, getLandingData } from "./helper";
import { useSelector, shallowEqual } from "react-redux";
import { toast } from "react-toastify";
import { useParams } from "react-router-dom";
import Loading from "./../../../../../../_helper/_loading";
import { getEmpRemuType } from "./helper";
import { _todayDate } from "../../../../../../_helper/_todayDate";

const initData = {
  remunerationValidForm: _todayDate(),
};

export default function EmployeeRemunerationSetup({
  isConsolidatedEmpRemu,
  setIsConsolidatedEmpRemu,
}) {
  const [edit, setEdit] = useState(false);
  const [isDisabled, setDisabled] = useState(false);
  const { id } = useParams();

  // Landing Data State
  const [landingData, setLandingData] = useState([]);

  // Header Form All Value's state
  const [basicSalery, setBasicSalery] = useState(0);
  const [netPayable, setNetPayable] = useState(0);
  const [grossAmount, setGrossAmount] = useState(0);
  const [totalPayable, setTotalPayable] = useState(0);
  const [isConsolidated, setIsConsolidated] = useState(false);
  const [allowanceTotal, setAllowanceTotal] = useState(0);
  const [remuTotal, setRemuTotal] = useState(0);
  const [filterStandardRemunaration, setFilterStandardRemunaration] = useState(
    []
  );

  useEffect(() => {
    console.log("isConsolidated", isConsolidated);
    if (isConsolidated) {
      const standardComTotal = filterStandardRemunaration?.reduce(
        (acc, item) => +acc + +item?.amount,
        0
      );
      setTotalPayable(+standardComTotal + +allowanceTotal);
    } else {
      setTotalPayable(+remuTotal + +allowanceTotal);
    }
  }, [remuTotal, allowanceTotal, filterStandardRemunaration]);

  useEffect(() => {
    setIsConsolidated(isConsolidatedEmpRemu);
  }, [isConsolidatedEmpRemu]);

  // State for all DDL and Row Data
  const [standardRemunarationBasic, setStandardRemunarationBasic] = useState(
    []
  );
  const [standardRemunaration, setStandardRemunaration] = useState([]);

  const [rowData, setRowData] = useState([]);
  const [
    fixedDeductionsRemunerarion,
    setFixedDeductionsRemunerarion,
  ] = useState([]);

  // get user profile data from store
  const profileData = useSelector((state) => {
    return state.authData.profileData;
  }, shallowEqual);

  // get selected business unit from store
  const selectedBusinessUnit = useSelector((state) => {
    return state.authData.selectedBusinessUnit;
  }, shallowEqual);

  // Get Landing Data
  useEffect(() => {
    getLandingData(
      id,
      profileData.accountId,
      selectedBusinessUnit.value,
      setLandingData
    );

    if (landingData.length > 0) {
      setEdit(false);
    }
  }, []);

  // Fetch All DDL
  useEffect(() => {
    getEmpRemuType(
      profileData?.accountId,
      1,
      setStandardRemunarationBasic,
      setDisabled
    );
    getEmpRemuType(
      profileData?.accountId,
      1,
      setStandardRemunaration,
      setDisabled
    );
    getEmpRemuType(
      profileData?.accountId,
      4,
      setFixedDeductionsRemunerarion,
      setDisabled
    );
  }, []);

  // save btn Heandelar
  const saveHandler = async (
    values,
    standardRemunaration,
    fixedDeductionsRemunerarion,
    rowData,
    filterStandardRemunaration,
    cb
  ) => {
    if (basicSalery === 0) {
      toast.warning("Please add basic amount");
    } else {
      // This logic for Consolidated Salary when it's true
      if (filterStandardRemunaration.length > 0) {
        let obj = {
          objHeader: {
            accountId: profileData?.accountId,
            employeeId: +id,
            businessUnitId: selectedBusinessUnit.value,
            startPayrollPeriodId: 0,
            startDate: values.remunerationValidForm,
            endPayrollPeriodId: 0,
            basicSalary: +basicSalery,
            netPayable: +netPayable,
            intCurrencyId: +values?.currency?.value,
            otherAllowance: +allowanceTotal,
            grossAmount: +grossAmount,
            actionBy: profileData.userId,
          },
          objRowList: [],
        };
        let data = filterStandardRemunaration.map((item) => {
          return {
            employeeId: +id,
            entryTypeId: 3,
            entryTypeName: "Standard Remunerarion",
            remunerationComponentId: +item?.remunerationComponentId,
            amount: +item?.amount,
            actionBy: profileData.userId,
            defaultPercentOnBasic: 0,
          };
        });
        let rowDataList = rowData.map((item) => {
          return {
            employeeId: +id,
            entryTypeId: 3,
            entryTypeName: "Benefits & Allowances",
            remunerationComponentId: +item?.component?.value,
            amount: +item?.amount,
            actionBy: profileData.userId,
            defaultPercentOnBasic: +item?.parsentage || 0,
          };
        });
        let newArray = [...data, ...rowDataList];
        if (newArray.length > 0) {
          obj.objRowList = newArray;
          createEmpRemuSetup(
            obj,
            cb,
            id,
            profileData.accountId,
            selectedBusinessUnit.value,
            setLandingData,
            setDisabled,
            setNetPayable,
            setBasicSalery,
            setGrossAmount
          );
        }
      } else {
        // This logic for Consolidated Salary when it's False
        let otherAllowanceTotal = rowData.reduce(
          (acc, sum) => acc + Number(sum.amount),
          0
        );
        let obj = {
          objHeader: {
            accountId: profileData?.accountId,
            employeeId: +id,
            businessUnitId: selectedBusinessUnit.value,
            startPayrollPeriodId: 0,
            startDate: values.remunerationValidForm,
            endPayrollPeriodId: 0,
            basicSalary: +basicSalery,
            netPayable: +netPayable,
            otherAllowance: +otherAllowanceTotal,
            grossAmount: +grossAmount,
            intCurrencyId: +values?.currency?.value,
            actionBy: profileData?.userId,
          },
          objRowList: [],
        };

        let sList = standardRemunaration.map((item) => {
          if (item?.remunerationComponentId === 2) {
            return {
              employeeId: +id,
              entryTypeId: 1,
              entryTypeName: "Standard Remunaration",
              remunerationComponentId: +item?.remunerationComponentId,
              amount: +basicSalery,
              actionBy: profileData?.userId,
              defaultPercentOnBasic: 0,
            };
          } else {
            return {
              employeeId: +id,
              entryTypeId: 1,
              entryTypeName: "Standard Remunaration",
              remunerationComponentId: +item?.remunerationComponentId,
              amount: +item?.amount,
              actionBy: profileData?.userId,
              defaultPercentOnBasic: +item?.defaultPercentOnBasic || 0,
            };
          }
        });

        let fList = fixedDeductionsRemunerarion.map((item) => {
          return {
            employeeId: +id,
            entryTypeId: 2,
            entryTypeName: "Deductions",
            remunerationComponentId: +item?.remunerationComponentId,
            amount: -item?.amount,
            actionBy: profileData.actionBy,
            defaultPercentOnBasic: +item?.defaultPercentOnBasic || 0,
          };
        });

        let rowDataList = rowData.map((item) => {
          return {
            employeeId: +id,
            entryTypeId: 3,
            entryTypeName: "Benefits & Allowances",
            remunerationComponentId: +item?.component?.value,
            amount: +item?.amount,
            actionBy: profileData?.userId,
            defaultPercentOnBasic: +item?.parsentage || 0,
          };
        });
        let newArray = [...fList, ...sList, ...rowDataList]; // Concating All
        console.log("New Array 1st => ", newArray);
        if (newArray.length > 0) {
          obj.objRowList = newArray;
          createEmpRemuSetup(
            obj,
            cb,
            id,
            profileData.accountId,
            selectedBusinessUnit.value,
            setLandingData,
            setDisabled,
            setNetPayable,
            setBasicSalery,
            setGrossAmount
          );
        }
      }
    }
  };

  return (
    <div className="employeeInformation empRemuSetup-css">
      {isDisabled && <Loading />}
      <Form
        initData={initData}
        saveHandler={saveHandler}
        setEdit={setEdit}
        edit={edit}
        landingData={landingData}
        basicSalery={basicSalery}
        setBasicSalery={setBasicSalery}
        netPayable={netPayable}
        setNetPayable={setNetPayable}
        grossAmount={grossAmount}
        setGrossAmount={setGrossAmount}
        accountId={profileData?.accountId}
        profileData={profileData}
        selectedBusinessUnit={selectedBusinessUnit}
        businessUnitId={selectedBusinessUnit?.value}
        totalPayable={totalPayable}
        setTotalPayable={setTotalPayable}
        isConsolidated={isConsolidated}
        setIsConsolidated={setIsConsolidated}
        setDisabled={setDisabled}
        allowanceTotal={allowanceTotal}
        setAllowanceTotal={setAllowanceTotal}
        setRemuTotal={setRemuTotal}
        remuTotal={remuTotal}
        // DDL and RowData Props
        DDL={{
          standardRemunarationBasic,
          setStandardRemunarationBasic,
          standardRemunaration,
          setStandardRemunaration,
          filterStandardRemunaration,
          setFilterStandardRemunaration,
          rowData,
          setRowData,
          fixedDeductionsRemunerarion,
          setFixedDeductionsRemunerarion,
        }}
      />
    </div>
  );
}
