/* eslint-disable no-unused-vars */
/* eslint-disable no-script-url,jsx-a11y/anchor-is-valid,jsx-a11y/role-supports-aria-props */
import React, { useState, useRef, useEffect } from "react";
import {
  ModalProgressBar,
  Card,
  CardBody,
  CardHeader,
  CardHeaderToolbar,
} from "../../../../../../../../_metronic/_partials/controls";
import { useSelector, shallowEqual, useDispatch } from "react-redux";
import Form from "./form";
import Axios from "axios";
import { toast } from "react-toastify";
import shortid from "shortid";
import { getGroupDDLAction } from "../../../_redux/Actions";
import { getAccountClassPagination_action } from "./../../../_redux/Actions";
const initData = {
  accountClassName: "",
  accountClassCode: "",
  accountGroupName: "",
};

export default function AccountClass() {
  const dispatch = useDispatch();

  // const [rowDto, setRowDto] = useState([]);

  // Get profile data from store
  const profileData = useSelector((state) => {
    return state.authData.profileData;
  }, shallowEqual);

  // Get Selected Business unit data from store
  const selectedBusinessUnit = useSelector((state) => {
    return state.authData.selectedBusinessUnit;
  }, shallowEqual);

  const [isDisabled, setDisabled] = useState(true);

  // get groupDDL from store
  const groupDDL = useSelector((state) => {
    return state?.generalLedger?.groupDDL;
  }, shallowEqual);

  // get accountClass pagination from store
  const accountClassPagination = useSelector((state) => {
    return state?.generalLedger?.accountClass;
  }, shallowEqual);

  useEffect(() => {
    if (selectedBusinessUnit?.value && profileData?.accountId) {
      dispatch(getGroupDDLAction());
      dispatch(getAccountClassPagination_action(profileData?.accountId));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedBusinessUnit, profileData]);

  // delete singleData from row

  const deleteSingleRow = async (id) => {
    try {
      const res = await Axios.delete(`/costmgmt/GeneralLedger/DeleteAccountClass?ClassId=${id}`);
      if (res.status === 200) {
        dispatch(getAccountClassPagination_action(profileData?.accountId));
        toast.success("Successfully deleted");
      }
    } catch (error) {
      toast.error("Something went wrong");
    }
  };

  const saveAccountClassLedger = async (values, cb) => {
    setDisabled(true);
    if (values && profileData?.accountId && selectedBusinessUnit?.value) {
      const { accountId, userId: actionBy } = profileData;

      let data = {
        accountId,
        actionBy,
        accountClassId: 0,
        accountGroupId: values?.accountGroupName?.value,
        accountClassName: values?.accountClassName,
        accountClassCode: values?.accountClassCode,
      };

      try {
        setDisabled(true);
        const res = await Axios.post(
          "/costmgmt/GeneralLedger/CreateAccountClass",
          data
        );

        cb(initData);
        toast.success(res.data?.message || "Submitted successfully", {
          toastId: shortid(),
        });

        dispatch(getAccountClassPagination_action(profileData?.accountId));

        setDisabled(false);
      } catch (error) {
        toast.error(error?.response?.data?.message, { toastId: shortid() });
        setDisabled(false);
      }
    } else {
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

  const disableHandler = (cond) => {
    setDisabled(cond);
  };

  return (
    <Card>
      {true && <ModalProgressBar />}
      <CardHeader title="Create Account Class">
        <CardHeaderToolbar></CardHeaderToolbar>
      </CardHeader>
      <CardBody>
        <div className="mt-0">
          <Form
            initData={initData}
            btnRef={btnRef}
            saveBtnClicker={saveBtnClicker}
            resetBtnRef={resetBtnRef}
            disableHandler={disableHandler}
            saveAccountClassLedger={saveAccountClassLedger}
            accountId={profileData.accountId}
            actionBy={profileData.userId}
            profileData={profileData}
            selectedBusinessUnit={selectedBusinessUnit}
            groupDDL={groupDDL}
            accountClassPagination={accountClassPagination}
            deleteSingleRow={deleteSingleRow}
          />
        </div>
      </CardBody>
    </Card>
  );
}
