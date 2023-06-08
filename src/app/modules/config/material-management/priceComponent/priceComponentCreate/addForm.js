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
import Loading from "../../../../_helper/_loading";
const initProduct = {
  id: undefined,
  priceComponentCode: "",
  priceComponentName: "",
  priceComponentType: "",
  priceStuctureTypeDDL: "",
  factor: "",
  roundingType: "",
  generalledger: "",
};

export default function PriceCpomponentAddForm({
  history,
  match: {
    params: { id },
  },
}) {
  const profileData = useSelector((state) => {
    return state.authData.profileData;
  });
  const selectedBusinessUnit = useSelector((state) => {
    return state.authData.selectedBusinessUnit;
  });
  const [isDisabled, setDisabled] = useState(false);

  const saveWarehouse = async (values, cb) => {
    setDisabled(true);
    if (!id && values) {
      const warehouseData = {
        priceComponentCode: values.priceComponentCode,
        priceComponentName: values.priceComponentName,
        accountId: profileData.accountId,
        businessUnitId: selectedBusinessUnit.value,
        priceComponentTypeId: values.priceComponentType.value,
        factor: values.factor.value === "null" ? 1 : values.factor.value,
        roundingTypeId:
          values.roundingType.value === "null" ? 1 : values.roundingType.value,
        generalLedgerId: values?.generalledger?.value || 0,
        priceStructureTypeId: values.priceStuctureTypeDDL.value,
        priceStructureTypename: values.priceStuctureTypeDDL.label,
        actionBy: profileData?.userId,
      };
      try {
        setDisabled(true);
        const res = await Axios.post(
          "/item/PriceComponent/CreatePrice",
          warehouseData
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

  const backToWarehouseList = () => {
    history.push(`/config/material-management/price-component/`);
  };

  return (
    <Card>
      {true && <ModalProgressBar />}
      <CardHeader title="Create Price Component">
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
        {isDisabled && <Loading/>}
        <div className="mt-0">
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
