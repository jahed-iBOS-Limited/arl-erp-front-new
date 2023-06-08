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
import Form from "../Table/tableRow";
import Axios from "axios";
import { toast } from "react-toastify";
import shortid from "shortid";
import { isUniq } from "../../../../../../_helper/uniqChecker";
import {
  getCategoryDDLAction,
  getGeneralLedgerById,
  setGeneralLedgerSingleEmpty,
  editGeneralLedger,
} from "../../../_redux/Actions";
import { useParams } from "react-router-dom";
import { useHistory } from "react-router-dom";
import { getGeneralLedgerPasignation_action } from "./../../../_redux/Actions";
const initData = {
  generalLedgerName: "",
  generalLedgerCode: "",
  accountCategoryName: "",
};

export default function GeneralLadgerEditForm() {
  const history = useHistory();

  const dispatch = useDispatch();

  const { id } = useParams();

  // Get profile data from store
  const profileData = useSelector((state) => {
    return state.authData.profileData;
  }, shallowEqual);

  // Get Selected Business unit data from store
  const selectedBusinessUnit = useSelector((state) => {
    return state.authData.selectedBusinessUnit;
  }, shallowEqual);

  const [isDisabled, setDisabled] = useState(true);

  // get categoryDDL from store
  const categoryDDL = useSelector((state) => {
    return state?.generalLedger?.categoryDDL;
  }, shallowEqual);

  // get single controlling  unit from store
  const singleData = useSelector((state) => {
    return state.generalLedger?.singleData;
  }, shallowEqual);

  // pagination
  const generalLedgerPagination = useSelector((state) => {
    return state.generalLedger?.generalLedger;
  }, shallowEqual);

  useEffect(() => {
    if (profileData?.accountId) {
      dispatch(getCategoryDDLAction(profileData?.accountId));
      dispatch(getGeneralLedgerPasignation_action(profileData?.accountId));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profileData]);

  // delete singleData from row
  const deleteSingleRow = async (id) => {
    try {
      const res = await Axios.delete(
        `/costmgmt/GeneralLedger/DeleteGL?GLId=${id}`
      );
      if (res.status === 200) {
        dispatch(getGeneralLedgerPasignation_action(profileData?.accountId));
        toast.success("Successfully deleted");
      }
    } catch (error) {
      toast.error("Something went wrong");
    }
  };

  const saveGeneralLedgerLedger = async (values, cb) => {
    setDisabled(true);

    if (values && profileData?.accountId && selectedBusinessUnit?.value) {
      const { accountId, userId: actionBy } = profileData;

      if (id) {
        const payload = {
          generalLedgerId: +id,
          accountId: profileData?.accountId,
          generalLedgerName: values.generalLedgerName,
          actionBy: profileData?.userId,
        };
        dispatch(editGeneralLedger(payload));
      } else {
        let obj = {
          accountId,
          actionBy,
          accountCategoryId: values?.accountCategoryName?.value,
          generalLedgerName: values?.generalLedgerName,
          generalLedgerId: 0,
          generalLedgerCode: values?.generalLedgerCode,
        };
        try {
          setDisabled(true);
          const res = await Axios.post(
            "/costmgmt/GeneralLedger/CreateGL",
            obj
          );
          dispatch(getGeneralLedgerPasignation_action(profileData?.accountId));
          cb(initData);
          toast.success(res.data?.message || "Submitted successfully", {
            toastId: shortid(),
          });
          setDisabled(false);
        } catch (error) {
          toast.error(error?.response?.data?.message, { toastId: shortid() });
          setDisabled(false);
        }
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
  const backHandler = () => {
    history.goBack();
  };

  return (
    <Card>
      <ModalProgressBar />
      <CardHeader title={id ? "Edit General Ledger" : "Create General Ledger"}>
        <CardHeaderToolbar>
        <div className="row">
          <div className="offset-lg-2 col-lg-2">
          <button type="button" onClick={backHandler} className="btn btn-secondary">Back</button>
          </div>
        </div>
        </CardHeaderToolbar>
      </CardHeader>
      <CardBody>
        <div className="mt-0">
          <Form
            initData={singleData || initData}
            btnRef={btnRef}
            saveBtnClicker={saveBtnClicker}
            resetBtnRef={resetBtnRef}
            disableHandler={disableHandler}
            saveGeneralLedgerLedger={saveGeneralLedgerLedger}
            accountId={profileData.accountId}
            actionBy={profileData.userId}
            profileData={profileData}
            selectedBusinessUnit={selectedBusinessUnit}
            categoryDDL={categoryDDL}
            glId={id}
            isEdit={id || false}
            generalLedgerPagination={generalLedgerPagination}
            deleteSingleRow={deleteSingleRow}
          />
        </div>
      </CardBody>
    </Card>
  );
}
