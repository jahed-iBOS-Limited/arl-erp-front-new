/* eslint-disable no-script-url,jsx-a11y/anchor-is-valid,jsx-a11y/role-supports-aria-props */
import React, { useState, useRef } from "react";
import {
  Card,
  CardBody,
  CardHeader,
  CardHeaderToolbar,
} from "../../../../../../_metronic/_partials/controls";
import { useSelector, shallowEqual } from "react-redux";
import { uniqBy } from "lodash";
import { ModalProgressBar } from "../../../../../../_metronic/_partials/controls";
import Form from "../common/form";
import Axios from "axios";
//
import { toast } from "react-toastify";
import shortid from "shortid";
import Loading from "../../../../_helper/_loading";
const initData = {
  userId: "",
  userGroupName: "",
  userGroupCode: "",
  warehouseName: "",
};

export default function UserGroupAddForm({
  history,
  match: {
    params: { id },
  },
}) {
  const [isDisabled, setDisabled] = useState(false);
  const [data, setData] = useState([]);

  // get user profile data from store
  const profileData = useSelector((state) => {
    return state.authData.profileData;
  }, shallowEqual);

  // get selected business unit from store
  const selectedBusinessUnit = useSelector((state) => {
    return state.authData.selectedBusinessUnit;
  }, shallowEqual);

  const saveBusinessUnit = async (values, cb) => {
    window.payload = values
    setDisabled(true);
    if (
      !id &&
      values &&
      profileData?.accountId &&
      selectedBusinessUnit?.value
    ) {
      const dataObj = data.map((itm) => {
        return {
          userId: itm?.userId,
        };
      });
      const formData = {
        objCreateUserGroupHeaderDTO: {
          userGroupCode: values?.userGroupCode,
          userGroupName: values?.userGroupName,
          accountId: profileData?.accountId,
          actionBy: profileData?.userId,
          businessUnitId: selectedBusinessUnit?.value,
          lastActionDateTime: "2020-08-09T11:16:57.939Z",
          isActive: true,
        },
        objListCreateUserGroupRowDTO: dataObj,
      };
      try {
        setDisabled(true);
        const res = await Axios.post(
          "/domain/CreateUserGroup/CreateUserGroupInfo",
          formData
        );
        cb(initData);
        setDisabled(false);
        toast.success(res.data?.message || "Submitted successfully", {
          toastId: shortid(),
        });
        setData([]);
      } catch (error) {
        toast.error(error?.response?.data?.message, { toastId: shortid() });
        setDisabled(false);
      }
    } else {
      // setDisabled(false);
      
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
    // console.log("Reset Handler");
    if (resetBtnRef && resetBtnRef.current) {
      resetBtnRef.current.click();
    }
  };

  // Check duplicate for show warning
  function hasDuplicates(a) {
    return (
      uniqBy(a, function(itm) {
        return itm.userId;
      }).length !== a.length
    );
  }

  // Remove duplicate from alternateuom list
  const setDataToState = (payload) => {
    const duplicate = hasDuplicates([...data, payload]);
    if (duplicate) {
      toast.warn("Not allow duplicate attribute", {
        toastId: "attribute_duplicate",
      });
    } else {
      var uniq = uniqBy([...data, payload], function(itm) {
        return itm.userId;
      });
      setData(uniq);
    }
  };

  const backHandler = () => {
    history.push(`/config/domain-controll/user-group`);
  };

  // const disableHandler = (cond) => {
  //   setDisabled(cond);
  // };

  const remover = (payload) => {
    const filterArr = data.filter((itm) => itm.userId !== payload);
    setData(filterArr);
  };

  return (
    <Card>
      {true && <ModalProgressBar />}
      <CardHeader title="Create User Group">
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
            initData={initData}
            tableData={data}
            btnRef={btnRef}
            saveBusinessUnit={saveBusinessUnit}
            resetBtnRef={resetBtnRef}
            // disableHandler={disableHandler}
            profileData={profileData}
            setDataToState={setDataToState}
            accountId={profileData?.accountId}
            selectedBusinessUnit={selectedBusinessUnit}
            remover={remover}
          />
        </div>
      </CardBody>
    </Card>
  );
}
