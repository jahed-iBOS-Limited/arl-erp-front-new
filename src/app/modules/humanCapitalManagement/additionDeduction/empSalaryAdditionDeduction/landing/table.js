/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import { useSelector, shallowEqual } from "react-redux";
import { useHistory } from "react-router-dom";
import {
  getLandingData,
  deleteEmpSalaryAdditionDeductionById,
  getBuDDL,
  getAdditionDeductionDDL,
} from "../helper";
import Loading from "./../../../../_helper/_loading";
import Axios from "axios";
import {
  Card,
  CardHeader,
  CardHeaderToolbar,
  CardBody,
} from "./../../../../../../_metronic/_partials/controls";
import SearchAsyncSelect from "./../../../../_helper/SearchAsyncSelect";
import Select from "react-select";
import customStyles from "./../../../../selectCustomStyle";
import IDelete from "./../../../../_helper/_helperIcons/_delete";
import IConfirmModal from "./../../../../_helper/_confirmModal";
// import IView from "./../../../../_helper/_helperIcons/_view";
import { toast } from "react-toastify";
// import IViewModal from "./../../../../_helper/_viewModal";
// import EmpSalaryAdditionDeductionViewForm from "./../view/addEditForm";
import { monthDDL } from "./../form/utils";
import { yearDDLList } from "../../../../_helper/_yearDDLList";
import moment from "moment";
import { _formatMoney } from "../../../../_helper/_formatMoney";

// initial date
let date = new Date();
let initYear = date.getFullYear(); // 2022
let initMonth = date.getMonth() + 1; // 6

const EmpSalaryAdditionDeductionLanding = () => {
  const history = useHistory();

  const [gridData, setGridData] = useState([]);
  const [isloading, setIsLoading] = useState(false);
  const [employeeName, setEmployeeName] = useState("");
  const [busisnessUnit, setBusisnessUnit] = useState("");
  const [monthId, setMonthId] = useState("");
  const [yaerId, setYearId] = useState("");
  const [isProcessStatus, setIsProcessStatus] = useState("");
  const [typeName, setTypeName] = useState("");
  const [isAuto, setIsAuto] = useState(false);

  // create modal
  // const [isShowModal, setisShowModal] = useState(false);
  // const [singleData, setSingleData] = useState("");
  const [busisnessUnitDDL, setBusisnessUnitDDL] = useState("");
  const [additionDeductionDDL, setAdditionDeductionDDL] = useState([]);
  const [monthDDLList, setMonthDDLList] = useState([]);
  const [yearDDL, setYearDDL] = useState([]);

  // get user profile data from store
  const profileData = useSelector((state) => {
    return state.authData.profileData;
  }, shallowEqual);

  // get selected business unit from store
  // const selectedBusinessUnit = useSelector((state) => {
  //   return state.authData.selectedBusinessUnit;
  // }, shallowEqual);

  const loadUserList = (v) => {
    if (v?.length < 2) return [];
    return Axios.get(
      `/hcm/HCMDDL/GetEmployeeByAcIdDDL?AccountId=${profileData?.accountId}&search=${v}`
    ).then((res) => {
      return res?.data;
    });
  };

  useEffect(() => {
    getBuDDL(profileData?.accountId, setBusisnessUnitDDL);
    setYearDDL(yearDDLList(10));
    setMonthDDLList(monthDDL);
    setMonthId({
      value: initMonth,
      label: moment().format("MMMM"),
    });
    setYearId({
      value: initYear,
      label: `${initYear}`,
    });
    setIsProcessStatus({ value: 1, label: "Addition" });
    setTypeName({ value: 0, label: "All" });
    getAdditionDeductionDDL(
      profileData?.accountId,
      true,
      setAdditionDeductionDDL,
      true
    );
  }, [profileData?.accountId]);

  // Loation For Cretae Page
  const createPageLocation = {
    pathname:
      "/human-capital-management/additionanddeduction/salaryadditiondeduction/create",
    state: { employee: employeeName },
  };

  const searchHanlder = () => {
    if (!monthId || !yaerId || !isProcessStatus || !typeName)
      return toast.warn(
        "Please select month, year & allowance/deduction fields"
      );

    getLandingData(
      employeeName?.value,
      busisnessUnit?.value,
      monthId?.value,
      yaerId?.value,
      typeName?.value,
      isAuto,
      setIsLoading,
      setGridData
    );
  };

  const remover = (id) => {
    const singleData = gridData?.[id];
    let confirmObject = {
      title: "Are you sure?",
      message: `Do you want to delete this?`,
      yesAlertFunc: () => {
        const callBack = () => {
          getLandingData(
            employeeName?.value,
            busisnessUnit?.value,
            monthId?.value,
            yaerId?.value,
            typeName?.value,
            isAuto,
            setIsLoading,
            setGridData
          );
        };

        deleteEmpSalaryAdditionDeductionById(
          singleData?.intId,
          singleData?.intEmployeeId,
          profileData?.userId,
          callBack
        );
      },
      noAlertFunc: () => {
        history.push(
          `/human-capital-management/additionanddeduction/salaryadditiondeduction`
        );
      },
    };
    IConfirmModal(confirmObject);
  };

  return (
    <>
      <Card>
        <CardHeader title="Allowance and Deduction">
          <CardHeaderToolbar>
            <button
              type="button"
              onClick={() => history.push(createPageLocation)}
              className="btn btn-primary"
            >
              Create
            </button>
          </CardHeaderToolbar>
        </CardHeader>
        <CardBody>
          {isloading && <Loading />}

          {/* Search Employee */}
          <div className="global-form row">
            <div className="col-lg-3">
              <label>Employee Name</label>
              <SearchAsyncSelect
                isSearchIcon={true}
                selectedValue={employeeName}
                handleChange={(valueOption) => {
                  setEmployeeName(valueOption);
                }}
                loadOptions={loadUserList}
              />
            </div>
            <div className="col-lg-3">
              <label>Business Unit</label>
              <Select
                options={
                  [{ value: 0, label: "All" }, ...busisnessUnitDDL] || []
                }
                value={busisnessUnit}
                isSearchable={true}
                name="busisnessUnit"
                styles={customStyles}
                placeholder="Busisness Unit"
                isClearable={true}
                onChange={(valueOption) => {
                  setBusisnessUnit(valueOption);
                }}
              />
            </div>
            <div className="col-lg-2 mb-3">
              <label>Month</label>
              <Select
                options={monthDDLList || []}
                value={monthId}
                name="monthId"
                styles={customStyles}
                isSearchable={true}
                placeholder="Month"
                isClearable={false}
                onChange={(valueOption) => {
                  setGridData([]);
                  setMonthId(valueOption);
                }}
              />
            </div>
            <div className="col-lg-2 mb-3">
              <label>Year</label>
              <Select
                options={yearDDL || []}
                value={yaerId}
                name="yaerId"
                styles={customStyles}
                isSearchable={true}
                placeholder="Year"
                isClearable={false}
                onChange={(valueOption) => {
                  setGridData([]);
                  setYearId(valueOption);
                }}
              />
            </div>
            <div className="col-lg-2">
              <label>Type Name</label>
              <Select
                options={[
                  { value: 1, label: "Addition" },
                  { value: 2, label: "Deduction" },
                ]}
                value={isProcessStatus}
                isSearchable={true}
                name="isProcessStatus"
                styles={customStyles}
                placeholder="Type Name"
                isClearable={false}
                onChange={(valueOption) => {
                  setTypeName("");
                  setIsProcessStatus(valueOption);
                  getAdditionDeductionDDL(
                    profileData?.accountId,
                    valueOption?.value === 1 ? true : false,
                    setAdditionDeductionDDL,
                    true
                  );
                }}
              />
            </div>
            <div className="col-lg-3 mb-3">
              <label>Allowance/Deduction Name</label>
              <Select
                options={[...additionDeductionDDL] || []}
                value={typeName}
                isSearchable={true}
                name="typeName"
                styles={customStyles}
                placeholder="Allowance/Deduction Name"
                isClearable={false}
                onChange={(valueOption) => {
                  setTypeName(valueOption);
                }}
              />
            </div>
            <div className="col-lg-2 mb-3">
              <div style={{ marginTop: "20px" }} className="mr-2">
                <input
                  style={{
                    position: "absolute",
                    top: "20px",
                  }}
                  id="isAuto"
                  type="checkbox"
                  value={isAuto}
                  checked={isAuto}
                  name="isAuto"
                  onChange={(e) => {
                    setIsAuto(e.target.checked);
                  }}
                />
                <label className="ml-5">Auto Renewal</label>
              </div>
            </div>
            <div style={{ marginTop: "15px" }} className="col-lg-3">
              <button
                type="button"
                onClick={() => searchHanlder()}
                className="btn btn-primary"
              >
                Show
              </button>
            </div>
          </div>

          {/* Table */}
          <table className="table table-striped table-bordered mt-3 bj-table bj-table-landing">
            <thead>
              <tr>
                <th>SL</th>
                <th style={{ minWidth: "30px" }}>Employee Id</th>
                <th>Employee Code</th>
                <th>Employee Name</th>
                <th>Designation</th>
                <th>Department</th>
                <th>Busisness Unit</th>
                <th>Work Place Group</th>
                <th>Work Place</th>
                <th>Allowance/Deduction Type</th>
                <th>Amount</th>
                {monthId?.value === initMonth && yaerId?.value === initYear && (
                  <th style={{ width: "60px!important" }}>Action</th>
                )}
              </tr>
            </thead>
            <tbody>
              {gridData?.length > 0 &&
                gridData?.map((item, index) => {
                  return (
                    <tr key={index}>
                      <td style={{ width: "30px" }} className="text-center">
                        {index + 1}
                      </td>
                      <td>{item?.intEmployeeId}</td>
                      <td className="text-center" style={{ width: "30px" }}>
                        <span>{item?.strEmployeeCode}</span>
                      </td>
                      <td>
                        <span>{item?.strEmployeeFullName}</span>
                      </td>
                      <td>
                        <span>{item?.strDesignationName}</span>
                      </td>
                      <td>
                        <span>{item?.strDepartmentName}</span>
                      </td>
                      <td>
                        <span>{item?.strBusinessUnitName}</span>
                      </td>
                      <td>
                        <span>{item?.strWorkplaceGroupName}</span>
                      </td>
                      <td>
                        <span>{item?.strWorkplaceName}</span>
                      </td>
                      <td>
                        <span>{item?.strAdditionNDeduction}</span>
                      </td>
                      <td className="text-right">
                        <span>{_formatMoney(item?.numAmount)}</span>
                      </td>
                      {monthId?.value === initMonth &&
                        yaerId?.value === initYear && (
                          <td className="text-center">
                            <div className="d-flex justify-content-around">
                              {/* <span
                            className="view"
                            onClick={() => {
                              setisShowModal(true);
                              setSingleData(item);
                            }}
                          >
                            <IView />
                          </span> */}
                              {/* {!item?.isProcessed && ( */}
                              <span
                                className="delete d-flex align-items-center justify-content-center"
                                onClick={() => remover(index)}
                              >
                                <IDelete />
                              </span>
                              {/* )} */}
                            </div>
                          </td>
                        )}
                    </tr>
                  );
                })}
            </tbody>
          </table>

          {/* Create page modal*/}
          {/* <IViewModal show={isShowModal} onHide={() => setisShowModal(false)}>
            <EmpSalaryAdditionDeductionViewForm
              setisShowModal={setisShowModal}
              singleData={singleData}
            />
          </IViewModal> */}
        </CardBody>
      </Card>
    </>
  );
};

export default EmpSalaryAdditionDeductionLanding;
