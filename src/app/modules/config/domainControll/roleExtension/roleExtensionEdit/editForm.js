/* eslint-disable eqeqeq */
/* eslint-disable no-script-url,jsx-a11y/anchor-is-valid,jsx-a11y/role-supports-aria-props */
import React, { useEffect, useState, useRef } from "react";
import {
  Card,
  CardBody,
  CardHeader,
  CardHeaderToolbar,
} from "../../../../../../_metronic/_partials/controls";
import { ModalProgressBar } from "../../../../../../_metronic/_partials/controls";
import Form from "../common/form";
import Axios from "axios";
import shortid from "shortid";
import { toast } from "react-toastify";
// import { uniqBy } from "lodash";
import { useSelector, shallowEqual } from "react-redux";
import Loading from "../../../../_helper/_loading";

const initData = {
  businessunit: "",
  employee: "",
  orgtype: "",
  orgname: "",
};

export default function RoleEditForm({
  history,
  match: {
    params: { id },
  },
}) {
  const [isDisabled, setDisabled] = useState(false);
  const [datadb, setData] = useState("");
  const [rowdataList, setRowdataList] = useState([]);
  const [emp, setEmp] = useState(null);
  // Get profile data from store
  const profileData = useSelector((state) => {
    return state.authData.profileData;
  }, shallowEqual);

  // Get Selected Business unit data from store
  const selectedBusinessUnit = useSelector((state) => {
    return state.authData.selectedBusinessUnit;
  }, shallowEqual);

  const setRowdataListFromChild = (data) => {
   
    // var uniq = uniqBy([...rowdataList, data], function(itm) {
    //   return itm.organizationUnitReffName;
    // });
    // we check for ALL in previous page from add button
    // if(!data?.organizationTypeName === "ALL"){
    //   let isFoundSameData = rowdataList?.filter(item => item?.organizationUnitReffName === data?.organizationTypeName )
    //   isFoundSameData?.length > 0 && toast.warn("Not Allowed")
    //   return ""
    // }
    setRowdataList([...rowdataList, data]);
   
    
  };
  
  const deleteFromChild = (payload) => {
    let deleteItem = rowdataList.filter(
      (p) => p.organizationUnitReffName !== payload
    );
    setRowdataList(deleteItem);
  };
  useEffect(() => {
    if (profileData && id && profileData.accountId) {
      getDataById(id, profileData.accountId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profileData]);

  const getDataById = async (id, accId) => {
    try {
      const res = await Axios.get(
        `/domain/RoleExtension/GetRoleExtensionByAccountIdUserId?AccountId=${accId}&UserId=${id}`
      );

      const { data, status } = res;

      if (status === 200) {
        const meta = data[0]?.getRoleExtensionHeaderByAccountIdUserIdDTO;
        // console.log(meta)
        const rowdatas = data[0]?.getRoleExtensionRowByAccountIdUserIdDTO;
        setRowdataList(rowdatas);

        setData({
          ...meta,
          businessunit: {
            value: meta.businessUnitId,
            label: meta.businessUnitName,
          },
          employee: { value: meta.userId, label: meta.employeeName },
          orgtype: { value: "", label: "" },
          orgname: { value: "", label: "" },
        });
      } else {
        const tobj = {
          businessunit: { value: "", label: "" },
          employee: { value: "0", label: "" },
          orgtype: { value: "0", label: "" },
          orgname: { value: "0", label: "" },
        };
        setData(tobj);
      }
    } catch (err) {
      const tobj = {
        businessunit: { value: "", label: "" },
        employee: { value: "", label: "" },
        orgtype: { value: "", label: "" },
        orgname: { value: "", label: "" },
      };
      setData(tobj);
    }
    console.log(datadb);
  };
  const empSetter = (empPayload) => {
    if (!emp) {
      setEmp(empPayload);
      return true;
    } else {
      if (empPayload == emp) {
        setEmp(empPayload);
        return true;
      } else {
        alert("Employee already exist");
        return false;
      }
    }
  };
  // save business unit data to DB
  const saveBusinessUnit = async (empId) => {
    const RoleExtensionData = {
      objEditHeader: {
        id: 1,
        accountId: 1,
        userId: empId,
        actionBy: 1,
        isActive: true,
      },
      objEditListRow: [],
    };
    rowdataList.forEach((itm) => {
      let myObj = {
        accountId: profileData.accountId,
        userId: empId,
        organizationUnitTypeId: itm.organizationUnitTypeId,
        organizationTypeName: itm.organizationTypeName,
        organizationUnitReffId: itm.organizationUnitReffId,
        organizationUnitReffName: itm.organizationUnitReffName,
        actionBy: profileData?.userId,
        isActive: true,
      };
      RoleExtensionData.objEditListRow.push(myObj);
    });

    try {
      setDisabled(true);
      const res = await Axios.put(
        "/domain/RoleExtension/EditRoleExtension",
        RoleExtensionData
      );
      toast.success(res.data?.message || "Submitted successfully", {
        toastId: shortid(),
      });
      setDisabled(false);
      backHandler();
      setData(initData);
    } catch (error) {
      toast.error(error?.response?.data?.message, { toastId: shortid() });
      setDisabled(false);
    }
  };

  const btnRef = useRef();
  const saveBtnClicker = () => {
    if (btnRef && btnRef.current) {
      btnRef.current.click();
    }
  };
  const resetBtnRef = useRef();
  const ResetProductClick = () => {
    if (resetBtnRef && resetBtnRef.current) {
      resetBtnRef.current.click();
    }
  };

  const backHandler = () => {
    history.push(`/config/domain-controll/role-extension/`);
  };

  // const disableHandler = (cond) => {
  //   setDisabled(cond);
  // };

  return (
    <Card>
      {true && <ModalProgressBar />}
      <CardHeader title="Edit Role Extension">
        <CardHeaderToolbar>
          <button type="button" onClick={backHandler} className="btn btn-light">
            <i className="fa fa-arrow-left"></i>
            Back
          </button>
          {`  `}
          <button
            type="reset"
            onClick={ResetProductClick}
            ref={resetBtnRef}
            className="btn btn-light ml-2"
          >
            <i className="fa fa-redo"></i>
            Reset
          </button>
          {`  `}
          <button
            type="submit"
            className="btn btn-primary ml-2"
            onClick={saveBtnClicker}
            ref={btnRef}
            disabled={isDisabled}
          >
            Save
          </button>
        </CardHeaderToolbar>
      </CardHeader>
      <CardBody>
        {isDisabled && <Loading />}
        <div className="mt-0">
          <Form
            data={datadb || initData}
            btnRef={btnRef}
            saveBusinessUnit={saveBusinessUnit}
            resetBtnRef={resetBtnRef}
            // disableHandler={disableHandler}
            setRowdataListFromChild={setRowdataListFromChild}
            rowdataList={rowdataList}
            businessUnitName={false}
            businessUnitCode={true}
            deleteFromChild={deleteFromChild}
            empSetter={empSetter}
            isEdit={true}
            accountId={profileData.accountId}
            selectedBusinessUnit={selectedBusinessUnit}
          />
        </div>
      </CardBody>
    </Card>
  );
}
