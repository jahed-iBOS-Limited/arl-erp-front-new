/* eslint-disable no-script-url,jsx-a11y/anchor-is-valid,jsx-a11y/role-supports-aria-props */
import React, { useState, useRef } from "react";
import {
  Card,
  CardBody,
  CardHeader,
  CardHeaderToolbar,
} from "../../../../../../_metronic/_partials/controls";
import { ModalProgressBar } from "../../../../../../_metronic/_partials/controls";
import Form from "../common/form";
import Axios from "axios";
import shortid from "shortid";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import Loading from "./../../../../_helper/_loading";
const initProduct = {
  id: undefined,
  sbuname: "",
  sbucode: "",
};

export default function SbuAddForm({
  history,
  match: {
    params: { id },
  },
}) {
  const selectedBusinessUnit = useSelector(
    (state) => state.authData.selectedBusinessUnit
  );
  const profileData = useSelector((state) => state.authData.profileData);
  const [isDisabled, setDisabled] = useState(false);

  const saveWarehouse = async (values, cb) => {
    setDisabled(true);
    if (!id && values && selectedBusinessUnit && profileData) {
      const { accountId, userId: actionBy } = profileData;
      const { value: businessunitid, label: unitname } = selectedBusinessUnit;
      const warehouseData = {
        accountId,
        businessUnitId: businessunitid,
        businessUnitName: unitname,
        sbucode: values.sbucode,
        sbuname: values.sbuname,
        actionBy,
      };

      try {
        const res = await Axios.post("/costmgmt/SBU/CreateSBU", warehouseData);
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

  const backToWarehouseList = () => {
    history.push(`/financial-management/configuration/sbu/`);
  };

  return (
    <Card>
      {true && <ModalProgressBar />}
      <CardHeader title="Create SBU">
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
        {isDisabled && <Loading />}
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
