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
import Loading from "../../../../_helper/_loading";
const initProduct = {
  id: undefined,
  itemSubCategoryName: "",
  itemTypeId: "",
  itemCategoryId: "",
};

export default function ItemSubCategoryAddForm({
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
    setDisabled(true);
    // 
    if (!id && values) {
      // const businessData = {
      //   accountId: profileData.accountId,
      //   itemSubCategoryName: values.itemSubCategoryName,
      //   businessUnitId: selectedBusinessUnit.value,
      //   itemTypeId: values.itemTypeName.value,
      //   itemCategoryId: values.itemCategoryName.value,
      //   actionBy: profileData.userId,
      //   lastActionDateTime: "2020-07-08T09:19:27.446Z",
      // };
      const itemSubCategoryPayload = {
        sl: 0,        
        itemMasterubCategoryId: 0,
        accountId: profileData.accountId,
        itemMasterSubCategoryCode: "",
        itemMasterSubCategoryName: values.itemSubCategoryName || '',
        itemMasterTypeId: values.itemTypeName.value || 0,
        itemMasterTypeName: values.itemTypeName.label || '',
        itemMasterCategoryId: values.itemCategoryName.value || 0,
        itemMasterCategoryName: values.itemCategoryName.label || '',
        actionBy: profileData.userId,
      }

      try {
        setDisabled(true);
        const res = await Axios.post(
          "/item/ItemSubCategory/CreateItemSubCategory",
          itemSubCategoryPayload
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
    if (resetBtnRef && resetBtnRef.current) {
      resetBtnRef.current.click();
    }
  };

  const backHandler = () => {
    history.push(`/config/material-management/item-sub-category`);
  };

  // const disableHandler = (cond) => {
  //   setDisabled(cond);
  // };

  return (
    <Card>
      {true && <ModalProgressBar />}
      <CardHeader title="Create Item Sub-Category">
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
        {isDisabled && <Loading/>}
        <div className="mt-0">
          <Form
            product={initProduct}
            btnRef={btnRef}
            saveBusinessUnit={saveBusinessUnit}
            resetBtnRef={resetBtnRef}
            // disableHandler={disableHandler}
            accountId={profileData?.accountId}
            selectedBusinessUnit={selectedBusinessUnit}
          />
        </div>
      </CardBody>
    </Card>
  );
}
