/* eslint-disable no-unused-vars */
/* eslint-disable no-script-url,jsx-a11y/anchor-is-valid,jsx-a11y/role-supports-aria-props */
import React, { useState, useRef } from "react";
import {
  Card,
  CardBody,
  CardHeader,
  CardHeaderToolbar,
} from "../../../../../../_metronic/_partials/controls";
import { useSelector } from "react-redux";
import { ModalProgressBar } from "../../../../../../_metronic/_partials/controls";

import Form from "../common/form";
import Axios from "axios";
import { toast } from "react-toastify";
import shortid from "shortid";
import Loading from "./../../../../_helper/_loading";
const initProduct = {
  id: undefined,
  attribute: "",
  itemCategoryId: "",
  uom: "",
};

export default function ItemCategoryAddForm({
  history,
  match: {
    params: { id },
  },
}) {
  const [isDisabled, setDisabled] = useState(false);
  const selectedBusinessUnit = useSelector(
    (state) => state.authData.selectedBusinessUnit
  );
  const profileData = useSelector((state) => state.authData.profileData);

  const saveWarehouse = async (values, cb) => {
    if (!id && values && selectedBusinessUnit && profileData) {
      const { accountId, userId: actionBy } = profileData;
      const warehouseData = {
        accountId,
        itemAttributeName: values.attribute,
        businessUnitId: selectedBusinessUnit.value,
        itemCategoryId: values.itemCategoryName.value,
        uomId: values.uom.value,
        actionBy: profileData.userId,
      };
      try {
        setDisabled(true);
        const res = await Axios.post(
          "/item/ItemAttriute/CreateItemAttribute",
          warehouseData
        );
        cb(initProduct);
        toast.success(res.data?.message || "Submitted successfully", {
          toastId: shortid(),
        });
        setDisabled(false);
        // console.log(warehouseData);
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

  const backToWarehouseList = () => {
    history.push(`/config/material-management/item-attribute/`);
  };

  return (
    <Card>
      {true && <ModalProgressBar />}
      <CardHeader title="Create Item Attribute">
        <CardHeaderToolbar>
          <button
            type="button"
            onClick={backToWarehouseList}
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
        <div className="mt-0">
          {isDisabled && <Loading />}
          <Form
            product={initProduct}
            btnRef={btnRef}
            saveWarehouse={saveWarehouse}
            resetBtnRef={resetBtnRef}
            selectedBusinessUnit={selectedBusinessUnit}
            accountId={profileData.accountId}
          />
        </div>
      </CardBody>
    </Card>
  );
}
