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
import shortid from "shortid";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";

export default function SbuEditForm({
  history,
  match: {
    params: { id },
  },
}) {
  const [isDisabled, setDisabled] = useState(false);
  const [warehouseData, setData] = useState("");
  const selectedBusinessUnit = useSelector(
    (state) => state.authData.selectedBusinessUnit
  );
  const profileData = useSelector((state) => state.authData.profileData);

  useEffect(() => {
    getBusinessUnitById(id);
  }, [id]);

  const getBusinessUnitById = async (id, accountId) => {
    const res = await Axios.get(
      `/costmgmt/SBU/GetSBUEditViewDataList?SBUId=${id}`
    );
    const { data, status } = res;
    if (status === 200 && data && data.length) {
      data.forEach((r) => {
        const singleObject = {
          sbuname: r.sbuname,
          sbucode: r.sbucode,
        };

        setData(singleObject);
      });
    }
  };

  // save business unit data to DB
  const saveWarehouse = async (values, cb) => {
    // console.log(values)
    setDisabled(true);
    const warehouseData = {
      sbuid: +id,
      sbuname: values.sbuname,
      actionBy: profileData?.userId,
    };

    try {
      const res = await Axios.put("/costmgmt/SBU/EditSBU", warehouseData);
      cb();
      toast.success(res.data?.message || "Submitted successfully", {
        toastId: shortid(),
      });
      setDisabled(false);
      backToWarehouseList();
    } catch (error) {
      toast.error(error?.response?.data?.message, { toastId: shortid() });
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
      <CardHeader title="Edit SBU">
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
        {warehouseData && (
          <div className="mt-0">
            <Form
              product={warehouseData}
              btnRef={btnRef}
              saveWarehouse={saveWarehouse}
              resetBtnRef={resetBtnRef}
              warehouseName={false}
              warehouseCode={true}
              selectedBusinessUnit={selectedBusinessUnit}
              profileData={profileData}
            />
          </div>
        )}
      </CardBody>
    </Card>
  );
}
