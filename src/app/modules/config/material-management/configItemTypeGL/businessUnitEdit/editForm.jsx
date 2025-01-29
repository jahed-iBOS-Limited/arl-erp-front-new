/* eslint-disable no-unused-vars */
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

import { useSelector, shallowEqual } from "react-redux";

const initData = {
  id: undefined,
  itemCategoryName: "....",
  generalLedgerName: "....",
};

export default function ConfigItemTypeGLEditForm({
  history,
  match: {
    params: { id },
  },
}) {
  const [isDisabled, setDisabled] = useState(false);

  const [businessUnitData, setData] = useState("");

  // get user profile data from store
  const profileData = useSelector((state) => {
    return state.authData.profileData;
  }, shallowEqual);

  // get selected business unit from store
  const selectedBusinessUnit = useSelector((state) => {
    return state.authData.selectedBusinessUnit;
  }, shallowEqual);

  useEffect(() => {
    getBusinessUnitById(
      profileData?.accountId,
      selectedBusinessUnit?.value,
      id
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const getBusinessUnitById = async (accId, buId, id) => {
    const res = await Axios.get(
      `/item/ItemCategoryGL/GetItemCategoryGL?AccountId=${accId}&BusinessUnitId=${buId}&ItemCategoryId=${id}`
    );
    const { data, status } = res;
    console.log(res);
    const itm = data[0];
    const singleObject = {
      ...itm,
      itemCategoryName: {
        value: itm.itemCategoryId,
        label: itm.itemCategoryName,
      },
      generalLedgerName: {
        value: itm.generalLedgerId,
        label: itm.generalLedgerName,
      },
    };
    setData(singleObject);
  };

  // save business unit data to DB
  const saveBusinessUnit = async (values, cb) => {
    
    const businessData = {
      configId: +id,
      itemCategoryId: values?.itemCategoryName.value,
      itemCategoryName: values?.itemCategoryName.label,
      generalLedgerId: values?.generalLedgerName.value,
      generalLedgerName: values?.generalLedgerName.label,
      actionBy: profileData.userId,
      isActive: true,
    };

    try {
      setDisabled(true);
      await Axios.put("/item/ItemCategoryGL/EditItemCategoryGL", businessData);
      cb(initData);
      setDisabled(false);
      backHandler();
      setData(initData);
    } catch (error) {
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
    history.push(`/config/material-management/config-item-type-gl/`);
  };

  return (
    <Card>
      {true && <ModalProgressBar />}
      <CardHeader title="Edit Config Item Category General Ledger">
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
          <Form
            product={businessUnitData || initData}
            btnRef={btnRef}
            saveBusinessUnit={saveBusinessUnit}
            resetBtnRef={resetBtnRef}
            businessUnitName={false}
            businessUnitCode={true}
            isEdit={true}
            isDisabled
            accountId={profileData?.accountId}
            selectedBusinessUnit={selectedBusinessUnit}
          />
        </div>
      </CardBody>
    </Card>
  );
}
