/* eslint-disable react-hooks/rules-of-hooks */
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector, shallowEqual } from "react-redux";
import { useHistory } from "react-router-dom";
import Select from "react-select";
import { toast } from "react-toastify";
import customStyles from "../../../selectCustomStyle";
import ButtonStyleOne from "../../../_helper/button/ButtonStyleOne";
import { IToggleButton } from "./ToggleButton";
import { downloadFile } from "../../../_helper/downloadFile";
import ICustomTable from "../../../_helper/_customTable";
import IEdit from "../../../_helper/_helperIcons/_edit";
import IView from "../../../_helper/_helperIcons/_view";
import {
  getSbuDDLAction,
  getDepartmentDDLAction,
} from "../../individualKpi/balancedScore/_redux/Actions";
import {
  getCategoryDDLAction,
  getCorporateDepDDLAction,
  strLandingActiveInactiveAction,
} from "../Form/helper";
import { StrategicParticularsgetPaginationAction } from "../_redux/Actions";
import Loading from "../../../_helper/_loading";
import PaginationTable from "../../../_helper/_tablePagination";
import { getYearDDLAction } from "../../_redux/Actions";

const ths = ["SL", "Particulars", "Category", "SRF", "Action"];
const thsTwo = ["SL", "Particulars", "Category", "Code", "SRF", "Action"];

const TableRowTwo = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const [sbu, setSbu] = useState("");
  const [status, setStatus] = useState("");
  const [category, setCategory] = useState("");
  const [categoryDDL, setCategoryDDL] = useState([]);
  /* eslint-disable no-unused-vars */
  const [corporateDepDDL, setCorporateDepDDL] = useState([]);
  const [type, setType] = useState({value:0, label:"All"});
  const [department, setDepartment] = useState("");
  const [loading, setLoading] = useState(false);
  const [departmentDDL, setDepartmentDDL] = useState([
    { value: 0, label: "All department" },
  ]);
  const [selectedYear, setSelectedYear] = useState({value: 0, label: "All"})

  const yearDDL = useSelector((state) => {
    return state?.performanceMgt?.yearDDL;
  }, shallowEqual);

  const [pageNo, setPageNo] = React.useState(0);
  const [pageSize, setPageSize] = React.useState(15);

    //setPositionHandler
    const setPositionHandler = (pageNo, pageSize, searchValue) => {
      if ((type?.value === 2 || type?.value === 4) && !department)
      return toast.warn("Please select department");

    if (type?.value === 3 && !sbu) return toast.warn("Please select SBU");

    let refId = null;
    if (type?.value === 1 || type?.value === 0) {
      refId = 0;
    } else if (type?.value === 2 || type?.value === 4) {
      refId = department?.value;
    } else if (type?.value === 3) {
      refId = sbu?.value;
    }

    let statusId = null;
    if (status?.value === true || status?.value === false) {
      console.log("t", status.value);
      statusId = status?.value;
    } else {
      console.log("y", status.value);
      statusId = null;
    }

    dispatch(
      StrategicParticularsgetPaginationAction(
        profileData.accountId,
        selectedBusinessUnit.value,
        refId,
        type?.value,
        category?.value || null,
        statusId,
        setLoading,
        pageNo,
        pageSize,
        selectedYear?.value
      )
    );
    };

  let storeData = useSelector(
    (state) => {
      return {
        profileData: state.authData.profileData,
        selectedBusinessUnit: state.authData.selectedBusinessUnit,
        sbuDDL: state.inDividualBalancedScore.sbuDDL,
        depDDL: state.inDividualBalancedScore.departmentDDL,
        strData: state.strategicParticularsTwo?.gridData,
      };
    },
    { shallowEqual }
  );
  let {
    profileData,
    selectedBusinessUnit,
    sbuDDL,
    strData,
    depDDL,
  } = storeData;

  useEffect(() => {
    dispatch(
      getSbuDDLAction(profileData.accountId, selectedBusinessUnit.value)
    );
    dispatch(
      getDepartmentDDLAction(profileData.accountId, selectedBusinessUnit.value)
    );
    dispatch(
      getYearDDLAction(profileData.accountId, selectedBusinessUnit.value)
    );
    getCategoryDDLAction(setCategoryDDL);
    getCorporateDepDDLAction(
      profileData?.accountId,
      selectedBusinessUnit?.value,
      setCorporateDepDDL
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profileData, selectedBusinessUnit]);

  useEffect(() => {
    setDepartmentDDL([...departmentDDL, ...depDDL]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [depDDL]);

  useEffect(() => {
    if (profileData?.accountId && selectedBusinessUnit?.value) {
      dispatch(
        StrategicParticularsgetPaginationAction(
          profileData.accountId,
          selectedBusinessUnit.value,
          0,
          1,
          null,
          null,
          setLoading,
          pageNo,
          pageSize,
          selectedYear?.value
        )
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profileData, selectedBusinessUnit]);

  const viewStrParticularsLanding = () => {
    if ((type?.value === 2 || type?.value === 4) && !department)
      return toast.warn("Please select department");

    if (type?.value === 3 && !sbu) return toast.warn("Please select SBU");

    let refId = null;
    if (type?.value === 1 || type?.value === 0) {
      refId = 0;
    } else if (type?.value === 2 || type?.value === 4) {
      refId = department?.value;
    } else if (type?.value === 3) {
      refId = sbu?.value;
    }

    let statusId = null;
    if (status?.value === true || status?.value === false) {
      console.log("t", status.value);
      statusId = status?.value;
    } else {
      console.log("y", status.value);
      statusId = null;
    }

    dispatch(
      StrategicParticularsgetPaginationAction(
        profileData.accountId,
        selectedBusinessUnit.value,
        refId,
        type?.value,
        category?.value || null,
        statusId,
        setLoading,
        pageNo,
        pageSize,
        selectedYear?.value
      )
    );
  };

  const { userRole } = useSelector((state) => state?.authData, shallowEqual);

  const strategicPlan =
    userRole[userRole.findIndex((item) => item?.intFeatureId === 158)];

  return (
    <div className="str-landing">
      {loading && <Loading />}
      <div className="row">
        <div className="col-lg-2">
          <label>Strategy For</label>
          <Select
            onChange={(valueOption) => {
              setType({ value: valueOption?.value, label: valueOption?.label });
              setDepartment("");
              setSbu("");
              // if (valueOption?.value === 1) {
              //   dispatch(
              //     StrategicParticularsgetPaginationAction(
              //       profileData.accountId,
              //       selectedBusinessUnit.value,
              //       0,
              //       1
              //     )
              //   );
              // }
            }}
            value={type}
            isSearchable={true}
            options={[
              {value:0, label:"All"},
              { value: 1, label: "Employee" },
              { value: 2, label: "Department" },
              { value: 3, label: "SBU" },
              { value: 4, label: "Corporate" },
            ]}
            styles={customStyles}
            placeholder="Strategy for"
          />
        </div>
        {type?.value === 3 && (
          <div className="col-lg-2">
            <label>Select SBU</label>
            <Select
              onChange={(valueOption) => {
                setSbu({
                  value: valueOption?.value,
                  label: valueOption?.label,
                });
                // dispatch(
                //   StrategicParticularsgetPaginationAction(
                //     profileData.accountId,
                //     selectedBusinessUnit.value,
                //     valueOption?.value,
                //     3
                //   )
                // );
              }}
              value={sbu}
              isSearchable={true}
              options={sbuDDL}
              styles={customStyles}
              placeholder="Select SBU"
            />
          </div>
        )}
        {(type?.value === 2 || type?.value === 4) && (
          <div className="col-lg-2">
            <label>Select Department</label>
            <Select
              onChange={(valueOption) => {
                setDepartment({
                  value: valueOption?.value,
                  label: valueOption?.label,
                });
                // dispatch(
                //   StrategicParticularsgetPaginationAction(
                //     profileData.accountId,
                //     selectedBusinessUnit.value,
                //     valueOption?.value,
                //     2
                //   )
                // );
              }}
              value={department}
              isSearchable={true}
              options={
                type?.value === 2
                  ? departmentDDL
                  : type?.value === 4 && corporateDepDDL
              }
              styles={customStyles}
              placeholder="Select Department"
            />
          </div>
        )}
        <div className="col-lg-2">
          <label>Category</label>
          <Select
            onChange={(valueOption) => {
              setCategory(valueOption);
            }}
            value={category}
            isSearchable={true}
            options={categoryDDL}
            styles={customStyles}
            placeholder="Category"
          />
        </div>
        <div className="col-lg-2">
          <label>Status</label>
          <Select
            onChange={(valueOption) => {
              setStatus(valueOption);
            }}
            value={status}
            isSearchable={true}
            options={[
              { value: true, label: "Active" },
              { value: false, label: "Inactive" },
            ]}
            styles={customStyles}
            placeholder="Status"
          />
        </div>
        <div className="col-lg-2">
        <label>Year</label>
        <Select
            onChange={(valueOption) => {
              setSelectedYear(valueOption);
            }}
            value={selectedYear}
            isSearchable={true}
            options={yearDDL}
            styles={customStyles}
            placeholder="Status"
          />
        </div>

        <div className="col-lg-3">
          <ButtonStyleOne
            label="View"
            style={{
              padding: "6px 8px",
              marginTop: "21px",
              marginRight: "3px",
            }}
            type="button"
            onClick={() => {
              viewStrParticularsLanding();
            }}
          />
          <ButtonStyleOne
            label="Export Excel"
            style={{ padding: "6px 8px", marginTop: "21px", marginLeft:"15px" }}
            type="button"
            onClick={() => {
              let active =
                status?.value === true || status?.value === false
                  ? `&IsActive=${status?.value}`
                  : "";
              let categoryId = category?.value
                ? `&CategoryId=${category?.value}`
                : "";
              downloadFile(
                `/pms/StrategicParticulars/GetStrategicParticularsPaginationDownload?accountId=${
                  profileData?.accountId
                }&businessUnitId=${
                  selectedBusinessUnit?.value
                }&emp_dept_sbu_Type=${type?.value}&ReffId=${
                  type?.value === 3 ? sbu?.value || 0 : department?.value || 0
                }${active}${categoryId}&PageNo=1&PageSize=1000&viewOrder=desc&yearId=${selectedYear?.value}`,
                "Strategic Plan",
                "xlsx",
                setLoading
              );
            }}
          />
        </div>
      </div>
      {strData?.data?.length > 0 && (
        <ICustomTable ths={category?.value === 1 ? thsTwo : ths}>
          {strData?.data?.map((itm, index) => (
            <tr>
              <td> {index + 1} </td>
              <td className="pl-3"> {itm.objective} </td>
              <td className="pl-3"> {itm.strategicParticularsTypeName} </td>
             {category?.value === 1 && ( <td className="pl-3">{itm?.code}</td>)}
              <td className="pl-3"> {itm.freqName} </td>
              <td>
                <div className="d-flex justify-content-center">
                  <span>
                    <IView
                      title="View/Achievement Entry"
                      clickHandler={() =>
                        history.push({
                          pathname: `/performance-management/str/strategic_particulars/view/${itm.strategicParticularsId}/${itm.strategicParticularsTypeId}`,
                          state: itm,
                        })
                      }
                      classes="display-5"
                    />
                  </span>
                  <span
                    onClick={() =>
                      history.push(
                        `/performance-management/str/strategic_particulars/edit/${itm.strategicParticularsId}`
                      )
                    }
                    className="ml-2"
                  >
                    <IEdit classes="display-5" />
                  </span>
                  {strategicPlan?.isClose && (
                    <span className="ml-2">
                      <IToggleButton
                        selected={itm?.isActive}
                        toggleSelected={() =>
                          strLandingActiveInactiveAction(
                            {
                              strategicParticularsId:
                                itm?.strategicParticularsId,
                              isActive: !itm?.isActive,
                            },
                            setLoading,
                            viewStrParticularsLanding
                          )
                        }
                      />
                    </span>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </ICustomTable>
      )}
      {/* Pagination Code */}
      { strData?.data?.length > 0 && (
             <PaginationTable
             count={strData?.totalCount}
             setPositionHandler={setPositionHandler}
             paginationState={{
               pageNo,
               setPageNo,
               pageSize,
               setPageSize,
             }}
           />           
          )}
    </div>
  );
};

export default TableRowTwo;
