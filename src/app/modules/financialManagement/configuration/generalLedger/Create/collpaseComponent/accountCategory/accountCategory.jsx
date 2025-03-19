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
import Loading from "./../../../../../../_helper/_loading";
import {
  getAccountCategoryPasignation_action,
  getClassDDLAction,
} from "../../../_redux/Actions";
const initData = {
  accountCategoryName: "",
  accountCategoryCode: "",
  accountClassName: "",
};

export default function AccountCategory() {
  const dispatch = useDispatch();

  // Get profile data from store
  const profileData = useSelector((state) => {
    return state.authData.profileData;
  }, shallowEqual);

  // Get Selected Business unit data from store
  const selectedBusinessUnit = useSelector((state) => {
    return state.authData.selectedBusinessUnit;
  }, shallowEqual);

  const [isDisabled, setDisabled] = useState(false);

  // get classDDL from store
  const classDDL = useSelector((state) => {
    return state?.generalLedger?.classDDL;
  }, shallowEqual);

  // get accountCategory from store
  const accountCategoryPagination = useSelector((state) => {
    return state?.generalLedger?.accountCategory;
  }, shallowEqual);

  //Dispatch Get emplist action for get emplist ddl
  useEffect(() => {
    if (profileData?.accountId) {
      dispatch(getClassDDLAction(profileData.accountId));
      dispatch(getAccountCategoryPasignation_action(profileData.accountId));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profileData]);

  // delete singleData from row
  const deleteSingleRow = async (id) => {
    try {
      const res = await Axios.delete(
        `/costmgmt/GeneralLedger/DeleteAccountCategory?CategoryId=${id}`
      );
      if (res.status === 200) {
        dispatch(getAccountCategoryPasignation_action(profileData?.accountId));
        toast.success("Successfully deleted");
      }
    } catch (error) {
      toast.error("Something went wrong");
    }
  };

  const saveAccountCategoryJournal = async (values, cb) => {
    setDisabled(true);
    if (values && profileData?.accountId && selectedBusinessUnit?.value) {
      const { accountId, userId: actionBy } = profileData;

      let obj = {
        accountId,
        actionBy,
        accountClassId: values?.accountClassName?.value,
        accountCategoryName: values?.accountCategoryName,
        accountCategoryCode: values?.accountCategoryCode,
        accountCategoryId: 0,
      };

      try {
        const res = await Axios.post(
          "/costmgmt/GeneralLedger/CreateAccountCategory",
          obj
        );

        cb(initData);
        toast.success(res.data?.message || "Submitted successfully", {
          toastId: shortid(),
        });
        dispatch(getAccountCategoryPasignation_action(profileData.accountId));

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
      <CardHeader title="Create Account Category">
        <CardHeaderToolbar></CardHeaderToolbar>
      </CardHeader>
      <CardBody>
        <div className="mt-0">
          {isDisabled && <Loading />}
          <Form
            initData={initData}
            btnRef={btnRef}
            saveBtnClicker={saveBtnClicker}
            resetBtnRef={resetBtnRef}
            disableHandler={disableHandler}
            saveAccountCategoryJournal={saveAccountCategoryJournal}
            accountId={profileData.accountId}
            actionBy={profileData.userId}
            profileData={profileData}
            selectedBusinessUnit={selectedBusinessUnit}
            classDDL={classDDL}
            accountCategoryPagination={accountCategoryPagination}
            deleteSingleRow={deleteSingleRow}
            isDisabled={isDisabled}
          />
        </div>
      </CardBody>
    </Card>
  );
}
