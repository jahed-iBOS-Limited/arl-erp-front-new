/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import Form from "./form";
import { useSelector, shallowEqual } from "react-redux";
import { useParams, useLocation } from "react-router-dom";
import Loading from "./../../../../_helper/_loading";
import IForm from "./../../../../_helper/_form";
import { createData, getAdditionDeductionDDL } from "../helper";
import { toast } from "react-toastify";
import { yearDDLList } from "./../../../../_helper/_yearDDLList";
import { _todayDate } from "./../../../../_helper/_todayDate";
import { getDataByEmployeeAction } from "./utils";

const initData = {
  fromMonth: "",
  fromYear: "",
  toMonth: "",
  toYear: "",
  isContinue: false,
  numTotalAdditionAmount: "",
  numTotalDeductionAmount: "",
  empRemunerationAddDedHeaderId: 0,
  type: {
    value: 1,
    label: "Addition",
  },
  typeName: "",
  amount: "",
};

const EmpSalaryAdditionDeductionForm = () => {
  const { id } = useParams();
  const location = useLocation();
  const [isDisabled, setDisabled] = useState(false);
  const [rowData, setRowData] = useState([]);
  const [employeeName, setEmployeeName] = useState("");
  const [yearDDL, setYearDDL] = useState([]);
  const [additionDeductionDDl, setAdditionDeductionDDl] = useState([]);

  // get user profile data from store
  const { profileData, selectedBusinessUnit } = useSelector((state) => {
    return state?.authData;
  }, shallowEqual);

  const getEmpData = (empId) => {
    getDataByEmployeeAction(
      profileData?.accountId,
      empId,
      setDisabled,
      setRowData,
      0,
      10000
    );
  };

  useEffect(() => {
    getAdditionDeductionDDL(
      profileData?.accountId,
      true,
      setAdditionDeductionDDl
    );
    if (location?.state?.employee) {
      setEmployeeName(location?.state?.employee);
      // getDataByEmployeeAction(
      //   profileData?.accountId,
      //   location?.state?.employee?.value,
      //   setDisabled,
      //   setRowData,
      //   0,
      //   10000
      // );
      getEmpData(location?.state?.employee?.value);
    }
    setYearDDL(yearDDLList(10));
  }, []);

  // Save Handler
  const saveHandler = (values, cb) => {
    if (!employeeName)
      return toast.warning("Employee name is required", {
        toastId: "empName",
      });

    if (values?.fromYear?.value > values?.toYear?.value && !values?.isContinue)
      return toast.warn("To year should be greater than or equal to from year");

    if (
      values?.fromYear?.value === values?.toYear?.value &&
      values?.fromMonth?.value > values?.toMonth?.value &&
      !values?.isContinue
    )
      return toast.warn(
        "To month should be greather than or equal to from month"
      );

    const payload = [
      {
        id: 0,
        accountId: profileData?.accountId,
        businessUnitId: selectedBusinessUnit?.value,
        employeeId: employeeName?.value,
        employeeCode: employeeName?.code,
        employeeName: employeeName?.label,
        isAutoRenew: values?.isContinue,
        fromYear: +values?.fromYear?.label,
        fromMonth: +values?.fromMonth?.value,
        fromMonthTxt: values?.fromMonth?.label,
        toYear: values?.isContinue ? 0 : +values?.toYear?.label,
        toMonth: values?.isContinue ? 0 : +values?.toMonth?.value,
        toMonthTxt: values?.isContinue ? " " : values?.toMonth?.label,
        isAddition: values?.type?.value === 1 ? true : false,
        additionNdeduction: values?.typeName?.label,
        additionNdeductionTypeId: values?.typeName?.value,
        amount: +values?.amount,
        active: true,
        createdAt: _todayDate(),
        upatedAt: _todayDate(),
        createdBy: profileData?.userId,
        updatedBy: profileData?.userId,
      },
    ];

    createData(payload, setDisabled, cb, getEmpData, employeeName?.value);
  };

  const [objProps, setObjprops] = useState({});

  return (
    <>
      <IForm
        title={
          id
            ? "Edit Allowance and Deduction"
            : "Create Allowance and Deduction"
        }
        getProps={setObjprops}
        isDisabled={isDisabled}
      >
        {isDisabled && <Loading />}
        <Form
          {...objProps}
          initData={initData}
          saveHandler={saveHandler}
          accountId={profileData?.accountId}
          selectedBusinessUnit={selectedBusinessUnit}
          location={location}
          isEdit={id}
          yearDDL={yearDDL}
          additionDeductionDDl={additionDeductionDDl}
          setAdditionDeductionDDl={setAdditionDeductionDDl}
          employeeName={employeeName}
          setEmployeeName={setEmployeeName}
          rowData={rowData}
          setRowData={setRowData}
          setDisabled={setDisabled}
        />
      </IForm>
    </>
  );
};

export default EmpSalaryAdditionDeductionForm;
