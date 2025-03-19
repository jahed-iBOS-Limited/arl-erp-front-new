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
import { useSelector, shallowEqual } from "react-redux";

export default function EditForm({
  history,
  match: {
    params: { id },
  },
}) {
  const [isDisabled, setDisabled] = useState(false);
  const [initProduct, setInitProduct] = useState("");

  // get user profile data from store
  const profileData = useSelector((state) => {
    return state.authData.profileData;
  }, shallowEqual);

  // get selected business unit from store

  // save business unit data to DB
  const saveWarehouse = async (values, cb) => {
    setDisabled(true);
    const warehouseData = {
      warehouseId: +id,
      accountId: profileData.accountId,
      warehouseCode: values.warehouseCode,
      warehouseName: values.warehouseName,
      warehouseAddress: values.warehouseAddress,
      actionBy: profileData.userId,
    };

    try {
      setDisabled(true);
      const res = await Axios.put(
        "/wms/Warehouse/EditWarehouse",
        warehouseData
      );
      cb();
      setDisabled(false);
      toast.success(res.data?.message || "Submitted successfully", {
        toastId: shortid(),
      });
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
    history.push(`/inventory-management/configuration/warehouse/`);
  };

  // const disableHandler = (cond) => {
  //   setDisabled(cond);
  // };

  // gat by id
  const getWarehouseById_api = async (id) => {
    const res = await Axios.get(`/wms/Warehouse/GetWarehouseById?accountId=${profileData.accountId}&warehouseId=${id}
    `);
    const { data, status } = res;
    // console.log(res)
    if (status === 200) {
      setInitProduct(data[0]);
    }
  };

  useEffect(() => {
    if (id) {
      getWarehouseById_api(id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);
  return (
    <Card>
      {true && <ModalProgressBar />}
      <CardHeader title="Edit Warehouse">
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
          <Form
            btnRef={btnRef}
            saveWarehouse={saveWarehouse}
            resetBtnRef={resetBtnRef}
            //disableHandler={disableHandler}
            warehouseName={false}
            warehouseCode={true}
            accountId={profileData?.accountId}
            product={initProduct}
          />
        </div>
      </CardBody>
    </Card>
  );
}
