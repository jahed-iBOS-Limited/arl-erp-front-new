/* eslint-disable no-script-url,jsx-a11y/anchor-is-valid,jsx-a11y/role-supports-aria-props */
import React, { useState, useRef } from "react";
import {
  Card,
  CardBody,
  CardHeader,
  CardHeaderToolbar,
} from "../../../../../../_metronic/_partials/controls";
import { ModalProgressBar } from "../../../../../../_metronic/_partials/controls";
import { useSelector, shallowEqual } from "react-redux";
import Form from "../common/form";
import Axios from "axios";
import { toast } from "react-toastify";
import shortid from "shortid";
import Loading from "./../../../../_helper/_loading";

const initProduct = {
  id: undefined,
  itemCategoryId: "",
  itemCategoryName: "",
  generalLedgerId: "",
  generalLedgerName: "",
};

export default function ConfigItemTypeGLAddForm({
  history,
  match: {
    params: { id },
  },
}) {
  const [isDisabled, setDisabled] = useState(false);
  // get user profile data from store
  const profileData = useSelector((state) => {
    return state.authData.profileData;
  }, shallowEqual);

  // get selected business unit from store
  const selectedBusinessUnit = useSelector((state) => {
    return state.authData.selectedBusinessUnit;
  }, shallowEqual);

  const saveBusinessUnit = async (values, cb) => {
    if (!id && values) {
      const businessData = {
        accountId: profileData.accountId,
        accountName: "Akij",
        businessUnitid: selectedBusinessUnit.value,
        businessUnitName: selectedBusinessUnit.label,
        itemCategoryId: values?.itemCategoryName.value,
        itemCategoryName: values?.itemCategoryName.label,
        generalLedgerId: values?.generalLedgerName.value,
        generalLedgerName: values?.generalLedgerName.label,
        actionBy: profileData.userId,
      };
      try {
        setDisabled(true);
        const res = await Axios.post(
          "/item/ItemCategoryGL/CreateItemCategoryGL",
          businessData
        );
        cb(initProduct);
        setDisabled(false);
        toast.success(res.data?.message || "Submitted successfully", {
          toastId: shortid(),
        });
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

  const backHandler = () => {
    history.push(`/config/material-management/config-item-type-gl`);
  };

  return (
    <Card>
      {true && <ModalProgressBar />}
      <CardHeader title="Create Config Item Category General Ledger">
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
        <div className="mt-0">
          {isDisabled && <Loading />}
          <Form
            // actionsLoading={actionsLoading}
            product={initProduct}
            btnRef={btnRef}
            saveBusinessUnit={saveBusinessUnit}
            resetBtnRef={resetBtnRef}
            accountId={profileData?.accountId}
            selectedBusinessUnit={selectedBusinessUnit}
          />
        </div>
      </CardBody>
    </Card>
  );
}
