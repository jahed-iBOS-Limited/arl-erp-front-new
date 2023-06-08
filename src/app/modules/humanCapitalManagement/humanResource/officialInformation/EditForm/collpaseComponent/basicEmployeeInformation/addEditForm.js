/* eslint-disable no-unreachable */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import Form from "./form";
import { useSelector } from "react-redux";
import { shallowEqual } from "react-redux";
import { useLocation } from "react-router-dom";
import Loading from "./../../../../../../_helper/_loading";
import { useParams } from "react-router";
import {
  getEmployeeBasicInfoById_api,
  EditEmployeeBasicInformation,
} from "./helper";
import { religionDDL_api } from "../../../../personalInformation/EditForm/collpaseComponent/personalInformation/helper";
import { toast } from "react-toastify";
import { confirmAlert } from "react-confirm-alert";
import { useHistory } from "react-router";
import { YearDDL } from "./../../../../../../_helper/_yearDDL";
import { _todayDate } from "../../../../../../_helper/_todayDate";

const initData = {
  id: undefined,
  firstName: "",
  middleName: "",
  lastName: "",
  gender: "",
  email: "",
  businessUnit: "",
  SBUName: "",
  costCenter: "",
  functionalDepartment: "",
  HRposition: "",
  designation: "",
  employeeGrade: "",
  workplaceGroup: "",
  lineManager: "",
  superVisor: "",
  employeeCode: "",
  employmentType: "",
  employeeStatus: "",
  nanagerInfo: "",
  dateOfJoining: "",
  grossSalary: "",
  basicSalary: "",
  code: "",
  confirmationDate: "",
  religion: "",
  effectiveYear: "",
  effectiveMonth: "",
  separationDate: _todayDate(),
  separationReason: "",
};
export default function BasicEmployeeInformation({
  setIsConsolidatedEmpRemu,
  setBasicDataSave,
  basicDataSave,
}) {
  const history = useHistory();
  const [singleData, setSingleData] = useState("");
  const [edit, setEdit] = useState(false);
  const [isDisabled, setDisabled] = useState(false);
  const [religionDDL, setReligionDDL] = useState([]);
  const { id } = useParams();

  const { profileData, selectedBusinessUnit } = useSelector((state) => {
    return state.authData;
  }, shallowEqual);

  const { state: headerData } = useLocation();

  useEffect(() => {
    if (headerData?.employeeId) {
      getEmployeeBasicInfoById_api(
        headerData?.fromReRegistration || false,
        headerData?.employeeId,
        setSingleData,
        setIsConsolidatedEmpRemu
      );
    }
    religionDDL_api(setReligionDDL);
  }, []);

  useEffect(() => {
    if (headerData?.employeeId) {
      getEmployeeBasicInfoById_api(
        headerData?.fromReRegistration || false,
        headerData?.employeeId,
        setSingleData,
        setIsConsolidatedEmpRemu,
        setBasicDataSave
      );
    }
  }, [edit]);

  const saveHandler = async (values, cb) => {
    if (values && profileData?.accountId && selectedBusinessUnit?.value) {
      if (
        values?.employmentType?.label === "Permanent" &&
        (!values?.basicSalary || values?.basicSalary < 1)
      )
        return toast.warn("Basic Salary must be greater than zero");

      if (
        values?.employmentType?.label !== "Permanent" &&
        (!values?.grossSalary || values?.grossSalary < 1)
      )
        return toast.warn("Gross Salary must be greater than zero");

      if (values?.employeeStatus?.value === 2 && !values?.separationDate)
        return toast.warn("Inactive date is required");
      if (values?.employeeStatus?.value === 4 && !values?.separationDate)
        return toast.warn("Salary hold date is required");
      if (
        values?.employeeStatus?.value === 2 &&
        !values?.separationReason?.value
      )
        return toast.warn("Inactive reason is required");
      if (
        values?.employeeStatus?.value === 4 &&
        !values?.separationReason?.value
      )
        return toast.warn("Salary hold reason is required");

      if (
        values?.employmentType?.label === "Permanent" &&
        !values?.confirmationDate
      )
        return toast.warn("Please add Confirmation Date");

      if (
        (values?.employeeStatus?.value === 2 ||
          values?.employeeStatus?.value === 4) &&
        !values?.separationDate
      ) {
        return toast.warn(`${values?.employeeStatus?.label} Date is required`);
      }

      const IConfirmModal = () => {
        // const { title, message, noAlertFunc } = props;
        return confirmAlert({
          title: "",
          message:
            "Employee status inactive successfully. Employee official information stored in 'Re-registration'",
          buttons: [
            {
              label: "Ok",
              onClick: () =>
                history.push(
                  `/human-capital-management/humanresource/official-info/edit/${id}`
                ),
            },
          ],
        });
      };

      const payload = {
        employeeId: singleData?.employeeId || +id,
        employeeCode: values?.code || "",
        employeeFirstName: "",
        middleName: "",
        lastName: "",
        employeeFullName: values?.firstName,
        accountId: profileData?.accountId,
        businessunitId: values?.businessUnit?.value,
        sbuid: values?.SBUName?.value,
        departmentId: values?.functionalDepartment?.value,
        designationId: values?.designation?.value,
        joiningDate: values?.dateOfJoining,
        countryId: 0,
        email: values?.email || "",
        supervisorId: values?.superVisor?.value || 0,
        costCenterId: values?.costCenter?.value || 0,
        workplaceGroupId: values?.workplace?.workplaceGroupId || 0,
        workplaceId: values?.workplace?.value || 0,
        positionId: values?.HRposition?.value,
        empGradeId: values?.employeeGrade?.value || 0,
        employmentTypeId: values?.employmentType?.value,
        lineManagerId: values?.lineManager?.value || values?.superVisor?.value,
        lineManagerCode:
          values?.lineManager?.code || values?.superVisor?.code || "",
        employmentStatusId: values?.employeeStatus?.value,
        actionBy: profileData.userId,
        basicSalary: values?.basicSalary || 0,
        grossSalary: values?.grossSalary || 0,
        confirmationDate: values?.confirmationDate || "",
        genderId: values?.gender?.value,
        gender: values?.gender?.label,
        religionId: values?.religion?.value,
        religion: values?.religion?.label,
        intAffectedYear: values?.effectiveYear?.value,
        intAffectedMonth: values?.effectiveMonth?.value,
        separationDate: values?.separationDate,
        separationReason: values?.separationReason?.label,
      };
      EditEmployeeBasicInformation(payload, setDisabled).then((data) => {
        values?.employeeStatus?.value === 2 && IConfirmModal();
        getEmployeeBasicInfoById_api(
          headerData?.fromReRegistration || false,
          headerData?.employeeId,
          setSingleData,
          setIsConsolidatedEmpRemu
        );
        setBasicDataSave(payload);
      });
    } else {
      setDisabled(false);
    }
  };

  const customYearDDL = YearDDL(1, 3);

  return (
    <div className="employeeInformation">
      {isDisabled && <Loading />}
      <Form
        initData={singleData || initData}
        setEdit={setEdit}
        edit={edit}
        saveHandler={saveHandler}
        isDisabled={isDisabled}
        religionDDL={religionDDL}
        customYearDDL={customYearDDL}
      />
    </div>
  );
}
