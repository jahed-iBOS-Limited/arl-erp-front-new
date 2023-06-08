import React, { useState, useEffect } from "react";
import ICustomCard from "../../../_helper/_customCard";
import { useSelector, shallowEqual } from "react-redux";
import { Formik } from "formik";
import { Form } from "react-bootstrap";
import { useHistory } from "react-router-dom";
import {
  bonusGenarateLandingAction,
  getBonusNameDDL,
  getReligionDDL,
  getWorkplaceGroupDDL,
  createData,
} from "./helper";
import NewSelect from "../../../_helper/_select";
import { _todayDate } from "../../../_helper/_todayDate";
import Loading from "../../../_helper/_loading";
// import { _firstDateofMonth } from "../../../_helper/_firstDateOfCurrentMonth";
import { _dateFormatter } from "./../../../_helper/_dateFormate";
import numberWithCommas from "./../../../_helper/_numberWithCommas";
import { convertNumberToWords } from "./../../../_helper/_convertMoneyToWord";
import IConfirmModal from "./../../../_helper/_confirmModal";
import { downloadFile } from "./../../../_helper/downloadFile";
import "./bonusGenerate.css";

const initData = {
  // fromDate: _firstDateofMonth(),
  effectiveDate: _todayDate(),
  religion: "",
  workPlaceGroup: "",
  bonusName: "",
};

const BonusGenerateReport = () => {
  const history = useHistory();
  const [bonusNameDDL, setBonusNameDDL] = useState([]);
  const [religionDDL, setReligionDDL] = useState([]);
  const [workPlacegroupDDL, setWorkPlacegroupDDL] = useState([]);
  const [rowDto, setRowDto] = useState([]);
  const [loader, setLoader] = useState(false);

  const { profileData, selectedBusinessUnit } = useSelector((state) => {
    return state.authData;
  }, shallowEqual);

  useEffect(() => {
    if (selectedBusinessUnit?.value && profileData?.accountId) {
      getBonusNameDDL(
        profileData?.accountId,
        selectedBusinessUnit?.value,
        2,
        setBonusNameDDL
      );
      getWorkplaceGroupDDL(profileData?.accountId, setWorkPlacegroupDDL);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedBusinessUnit, profileData]);

  useEffect(() => {
    getReligionDDL(setReligionDDL);
  }, []);

  const saveHandler = (values) => {
    console.log("values", values);
  };

  let NetAmount = rowDto.reduce((total, acc) => total + acc.BonusAmount, 0);

  const bonusGenerateHandler = (values) => {
    const bonusRowData = rowDto?.map((itm) => {
      return {
        employeeId: itm?.intEmployeeId,
        employeeCode: itm?.strEmployeeCode,
        employeeName: itm?.strEmployeeFullName,
        positionGroupId: itm?.intPositionGroupId,
        positionGroupName: itm?.strPositionGroupName,
        employmentTypeId: itm?.intEmploymentTypeId,
        employmentTypeName: itm?.strEmploymentType,
        designationId: itm?.intDesignationId,
        designationName: itm?.strDesignationName,
        departmentId: itm?.intDepartmentId,
        departmentName: itm?.strDepartmentName,
        religionId: itm?.intReligionId,
        religionName: itm?.strReligion,
        businessUnitId: selectedBusinessUnit?.value,
        workPlaceGroupId: itm?.intWorkplaceGroupId,
        workPlaceGroupName: itm?.strWorkplaceGroupName,
        joiningDate: itm?.JoiningDate,
        effectedDate: itm?.effectedDate,
        serviceLength: itm?.ServiceLength,
        salary: itm?.numGrossSalary,
        basic: itm?.numBasicSalary,
        bonusAmount: itm?.BonusAmount,
        bankId: itm?.intBankId,
        bankName: itm?.strBankName,
        bankBranchId: itm?.intBankBranchId,
        bankBranchName: itm?.strBankBranchName,
        routingNumber: itm?.strBankRoutingNumber,
        bankAccountNumber: itm?.strAccountNumber,
        bonusId: itm?.intBonusId,
        bonusName: itm?.strBonusName,
      };
    });
    const payload = {
      headerData: {
        accountId: profileData?.accountId,
        businessUnitId: selectedBusinessUnit?.value,
        bonusId: values?.bonusName?.value,
        bonusName: values?.bonusName?.label,
        workPlaceGroupId: values?.workPlaceGroup?.value,
        workPlaceGroupName: values?.workPlaceGroup?.label,
        effectedDateTime: values?.effectiveDate,
        bonusAmount: NetAmount,
        insertBy: profileData?.userId,
        isForce: false,
      },
      rowData: bonusRowData,
    };
    const callBackFunc = (popMsg) => {
      let confirmObject = {
        title: ``,
        message: `${popMsg}`,
        overlayClassName: "bonus-generate-popup",
        yesAlertFunc: () => {
          const newPayload = {
            headerData: {
              accountId: profileData?.accountId,
              businessUnitId: selectedBusinessUnit?.value,
              bonusId: values?.bonusName?.value,
              bonusName: values?.bonusName?.label,
              workPlaceGroupId: values?.workPlaceGroup?.value,
              workPlaceGroupName: values?.workPlaceGroup?.label,
              effectedDateTime: values?.effectiveDate,
              bonusAmount: NetAmount,
              insertBy: profileData?.userId,
              isForce: true,
            },
            rowData: bonusRowData,
          };
          createData(newPayload, callBackFunc, setLoader);
          bonusGenarateLandingAction(
            selectedBusinessUnit?.value,
            values?.bonusName?.value,
            values?.religion?.value,
            values?.workPlaceGroup?.value,
            values?.effectiveDate,
            setRowDto,
            setLoader
          );
        },
        noAlertFunc: () => {
          history.push(
            "/human-capital-management/payrollmanagement/bonusgenerate"
          );
        },
      };
      IConfirmModal(confirmObject);
    };
    createData(payload, callBackFunc, setLoader);
  };

  return (
    <>
      {loader && <Loading />}
      <ICustomCard title="Bonus Generate">
        <Formik
          enableReinitialize={true}
          initialValues={{
            ...initData,
          }}
          onSubmit={(values, { setSubmitting, resetForm }) => {
            saveHandler(values, () => {
              resetForm(initData);
            });
          }}
        >
          {({
            handleSubmit,
            resetForm,
            values,
            errors,
            touched,
            setFieldValue,
          }) => (
            <>
              <Form className="form form-label-right">
                <div className="row">
                  <div className="col-lg-12">
                    <div className="global-form">
                      <div className="row d-flex justify-content-between align-content-center">
                        <div className="col-lg-12">
                          <div className="row">
                            <div className="col-lg-2 mb-2">
                              <NewSelect
                                name="bonusName"
                                options={bonusNameDDL || []}
                                value={values?.bonusName}
                                label="Bonus Name"
                                onChange={(valueOption) => {
                                  setFieldValue("bonusName", valueOption);
                                }}
                                placeholder="Select Bonus Name"
                                isSearchable={true}
                                errors={errors}
                                touched={touched}
                              />
                            </div>
                            <div className="col-lg-2 mb-2">
                              <NewSelect
                                name="religion"
                                options={religionDDL || []}
                                value={values?.religion}
                                label="Religion"
                                onChange={(valueOption) => {
                                  setFieldValue("religion", valueOption);
                                }}
                                placeholder="Select Religion"
                                isSearchable={true}
                                errors={errors}
                                touched={touched}
                              />
                            </div>
                            <div className="col-lg-2 mb-2">
                              <NewSelect
                                name="workPlaceGroup"
                                options={workPlacegroupDDL || []}
                                value={values?.workPlaceGroup}
                                label="Work Place Group"
                                onChange={(valueOption) => {
                                  setFieldValue("workPlaceGroup", valueOption);
                                }}
                                placeholder="Select Work Place Group"
                                isSearchable={true}
                                errors={errors}
                                touched={touched}
                              />
                            </div>
                            <div className="col-lg-2 mb-2">
                              <div>Effective Date</div>
                              <input
                                className="trans-date cj-landing-date"
                                value={values?.effectiveDate}
                                name="effectiveDate"
                                onChange={(e) => {
                                  setFieldValue(
                                    "effectiveDate",
                                    e.target.value
                                  );
                                }}
                                type="date"
                              />
                            </div>
                            <div className="col-lg-4 mt-4">
                              <button
                                type="button"
                                className="btn btn-primary"
                                onClick={() => {
                                  bonusGenarateLandingAction(
                                    selectedBusinessUnit?.value,
                                    values?.bonusName?.value,
                                    values?.religion?.value,
                                    values?.workPlaceGroup?.value,
                                    values?.effectiveDate,
                                    setRowDto,
                                    setLoader
                                  );
                                }}
                                disabled={
                                  !values?.bonusName ||
                                  !values?.religion ||
                                  !values?.workPlaceGroup ||
                                  !values?.effectiveDate
                                }
                              >
                                View
                              </button>
                              {rowDto.length > 0 && (
                                <>
                                  <button
                                    type="button"
                                    onClick={() => bonusGenerateHandler(values)}
                                    className="btn btn-primary mx-2"
                                    disabled={
                                      !values?.bonusName ||
                                      !values?.religion ||
                                      !values?.workPlaceGroup ||
                                      !values?.effectiveDate
                                    }
                                  >
                                    Generate
                                  </button>
                                  <button
                                    type="button"
                                    className="btn btn-primary bonus-generate-export"
                                    onClick={() => {
                                      downloadFile(
                                        `/hcm/BonusGenerate/GetBonusGenerateForViewDownload?intBusinessUnitId=${selectedBusinessUnit?.value}&religionId=${values?.religion?.value}&workPlaceGroupId=${values?.workPlaceGroup?.value}&bonusId=${values?.bonusName?.value}&effectedDate=${values?.effectiveDate}`,
                                        "Bonus Report",
                                        "xlsx",
                                        setLoader
                                      );
                                    }}
                                    disabled={
                                      !values?.bonusName ||
                                      !values?.religion ||
                                      !values?.workPlaceGroup ||
                                      !values?.effectiveDate
                                    }
                                  >
                                    Export Excel
                                  </button>
                                </>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                {/* Table Start */}
                {rowDto.length > 0 && (
                  <>
                    <div className="loan-scrollable-table">
                      <div className="scroll-table _table">
                        <table className="table table-striped table-bordered bj-table bj-table-landing">
                          <thead>
                            <tr>
                              <th style={{ minWidth: "30px" }}>SL</th>
                              <th style={{ minWidth: "30px" }}>Employee Id</th>
                              <th style={{ minWidth: "40px" }}>ERP Emp. Id</th>
                              <th
                                style={{
                                  position: "sticky",
                                  top: 0,
                                  left: "30px",
                                  zIndex: "9999999",
                                }}
                              >
                                Employee Code
                              </th>
                              <th>Employee Name</th>
                              <th>Group</th>
                              <th>Job Type</th>
                              <th>Designation</th>
                              <th>Department</th>
                              <th>Religion Name</th>
                              <th>Unit</th>
                              <th>Job Station Name</th>
                              <th>Joining Date</th>
                              <th>Effected Date</th>
                              <th>Service Length</th>
                              <th>Salary</th>
                              <th>Basic</th>
                              <th>Bonus Amount</th>
                              <th>Bank Name</th>
                              <th>Bank Branch Name</th>
                              <th>Routing Number</th>
                              <th>Bank Account No</th>
                              <th>Bonus Name</th>
                            </tr>
                          </thead>
                          <tbody>
                            {rowDto.length >= 0 &&
                              rowDto.map((data, index) => (
                                <tr key={index}>
                                  <td>{index + 1}</td>
                                  <td>{data?.intEmployeeId}</td>
                                  <td> {data?.erpemployeeId} </td>
                                  <td
                                    style={{
                                      position: "sticky",
                                      left: "30px",
                                      zIndex: "999999",
                                      backgroundColor:
                                        index % 2 === 0 ? "#ECF0F3" : "#fff",
                                    }}
                                  >
                                    <div className="text-center pl-2">
                                      {data?.strEmployeeCode}
                                    </div>
                                  </td>
                                  <td>
                                    <div className="text-left pl-2">
                                      {data?.strEmployeeFullName}
                                    </div>
                                  </td>
                                  <td>
                                    <div className="pl-2">
                                      {data?.strPositionGroupName}
                                    </div>
                                  </td>
                                  <td>
                                    <div className="pl-2">
                                      {data?.strEmploymentType}
                                    </div>
                                  </td>
                                  <td>
                                    <div className="pl-2">
                                      {data?.strDesignationName}
                                    </div>
                                  </td>
                                  <td>
                                    <div className="pl-2">
                                      {data?.strDepartmentName}
                                    </div>
                                  </td>
                                  <td>
                                    <div className="pl-2">
                                      {data?.strReligion}
                                    </div>
                                  </td>
                                  <td>
                                    <div className="pl-2">
                                      {data?.strBusinessUnitName}
                                    </div>
                                  </td>
                                  <td>
                                    <div className="pl-2">
                                      {data?.strWorkplaceGroupName}
                                    </div>
                                  </td>
                                  <td>
                                    <div className="text-center">
                                      {_dateFormatter(data?.JoiningDate)}
                                    </div>
                                  </td>
                                  <td>
                                    <div className="text-center">
                                      {_dateFormatter(data?.dteEffectedDate)}
                                    </div>
                                  </td>
                                  <td>
                                    <div className="pl-2">
                                      {data?.ServiceLength}
                                    </div>
                                  </td>
                                  <td>
                                    <div className="text-right">
                                      {numberWithCommas(data?.numGrossSalary)}
                                    </div>
                                  </td>
                                  <td>
                                    <div className="text-right">
                                      {numberWithCommas(data?.numBasicSalary)}
                                    </div>
                                  </td>
                                  <td>
                                    <div className="text-right">
                                      {numberWithCommas(data?.BonusAmount)}
                                    </div>
                                  </td>
                                  <td>
                                    <div className="text-left">
                                      {data?.strBankName}
                                    </div>
                                  </td>
                                  <td>
                                    <div className="text-left">
                                      {data?.strBankBranchName}
                                    </div>
                                  </td>
                                  <td>
                                    <div className="text-center">
                                      {data?.strBankRoutingNumber}
                                    </div>
                                  </td>
                                  <td>
                                    <div className="text-center">
                                      {data?.strAccountNumber}
                                    </div>
                                  </td>
                                  <td>
                                    <div className="text-left">
                                      {data?.strBonusName}
                                    </div>
                                  </td>
                                </tr>
                              ))}
                            {rowDto.length >= 0 && (
                              <tr>
                                <td>{rowDto?.length + 1}</td>
                                <td
                                  style={{
                                    position: "sticky",
                                    left: "30px",
                                    zIndex: "999999",
                                    backgroundColor:
                                      (rowDto?.length + 1) % 2 === 0
                                        ? "#ECF0F3"
                                        : "#fff",
                                  }}
                                >
                                  <div className="pl-2">
                                    <b>Total</b>
                                  </div>
                                </td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td>
                                  <div className="text-right pr-2">
                                    {numberWithCommas(NetAmount)}
                                  </div>
                                </td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>
                              </tr>
                            )}
                          </tbody>
                        </table>
                      </div>
                    </div>
                    <p className="font-weight-bold mt-2">
                      In Word: {convertNumberToWords(NetAmount)} Taka
                    </p>
                  </>
                )}
              </Form>
            </>
          )}
        </Formik>
      </ICustomCard>
    </>
  );
};

export default BonusGenerateReport;
