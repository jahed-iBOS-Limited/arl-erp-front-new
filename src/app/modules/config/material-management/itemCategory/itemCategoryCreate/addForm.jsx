/* eslint-disable no-script-url,jsx-a11y/anchor-is-valid,jsx-a11y/role-supports-aria-props */
import React, { useState, useRef } from "react";
import {
  Card,
  CardBody,
  CardHeader,
  CardHeaderToolbar,
} from "../../../../../../_metronic/_partials/controls";
import { useSelector, shallowEqual } from "react-redux";
import { ModalProgressBar } from "../../../../../../_metronic/_partials/controls";
import Form from "../common/form";
import Axios from "axios";
import { toast } from "react-toastify";
import shortid from "shortid";
import Loading from "../../../../_helper/_loading";
const initProduct = {
  id: undefined,
  itemCategoryName: "",
  itemTypeName: "",
};

export default function ItemCategoryAddForm({
  history,
  match: {
    params: { id },
  },
}) {
  const [isDisabled, setDisabled] = useState(false);

  // get selected business unit from store
  const selectedBusinessUnit = useSelector((state) => {
    return state.authData.selectedBusinessUnit;
  }, shallowEqual);

  // get user profile data from store
  const profileData = useSelector((state) => {
    return state.authData.profileData;
  }, shallowEqual);

  const saveItemCategory = async (values, cb) => {
    console.log("mm m", values, id, profileData);
    setDisabled(true);
    if (!id && values && profileData) {
      // const warehouseData = {
      //   accountId: profileData?.accountId,
      //   itemCategoryName: values?.itemCategoryName,
      //   businessUnitId: selectedBusinessUnit?.value,
      //   businessUnitName: selectedBusinessUnit?.label,
      //   accountName: "Akij",
      //   generalLedgerId: values?.generalLedger?.value || 0,
      //   generalLedgerName: values?.generalLedger?.label || "",
      //   itemTypeId: values?.itemTypeName?.value,
      //   actionBy: profileData?.userId,
      // };

      const itemCategoryCreatePayload = {
        sl: 0,          
        itemMasterCategoryId: 0,
        accountId: profileData?.accountId,
        itemMasterCategoryCode: "",
        itemMasterCategoryName: values?.itemCategoryName || '',
        itemMasterTypeId: values?.itemTypeName?.value || 0,
        actionBy: profileData?.userId,
      }

      try {
        setDisabled(true);
        const res = await Axios.post(
          "/item/MasterCategory/CreateItemMasterCategory",
          itemCategoryCreatePayload
        );
        cb(initProduct);
        toast.success(res.data?.message || "Submitted successfully", {
          toastId: shortid(),
        });
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

  const backToItemCategoryList = () => {
    history.push(`/config/material-management/item-category/`);
  };

  // const disableHandler = (cond) => {
  //   setDisabled(cond);
  // };

  return (
    <Card>
      {true && <ModalProgressBar />}
      <CardHeader title="Create Item Category">
        <CardHeaderToolbar>
          <button
            type="button"
            onClick={backToItemCategoryList}
            className="btn btn-light"
          >
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
            product={initProduct}
            btnRef={btnRef}
            saveItemCategory={saveItemCategory}
            resetBtnRef={resetBtnRef}
            // disableHandler={disableHandler}
            selectedBusinessUnit={selectedBusinessUnit}
            profileData={profileData}
          />
        </div>
      </CardBody>
    </Card>
  );
}
