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
import Loading from "../../../../_helper/_loading";

const initData = {
  id: undefined,
  inventoryLocationName: "....",
  plantName: "....",
  warehouseName: "....",
};
export default function InventoryLocationEditForm({
  history,
  match: {
    params: { id },
  },
}) {
  const [isDisabled, setDisabled] = useState(false);
  const [businessUnitData, setData] = useState("");
  useEffect(() => {
    getBusinessUnitById(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const getBusinessUnitById = async (id, accountId) => {
    const res = await Axios.get(
      `/wms/InventoryLocation/GetInventoryLocationInfoById?InventoryLocationId=${id}&Status=true`
    );
    const { data } = res;
    const itm = data[0];
    const singleObject = {
      ...itm,
      warehouseName: { value: itm.warehouseId, label: itm.warehouseName },
      plantName: { value: itm.plantId, label: itm.plantName },
    };
    setData(singleObject);
  };

  // get user profile data from store
  const profileData = useSelector((state) => {
    return state.authData.profileData;
  }, shallowEqual);

  // get selected business unit from store
  const selectedBusinessUnit = useSelector((state) => {
    return state.authData.selectedBusinessUnit;
  }, shallowEqual);

  // save business unit data to DB
  const saveBusinessUnit = async (values, cb) => {
    const businessData = {
      inventoryLocationId: values.inventoryLocationId,
      inventoryLocationName: values.inventoryLocationName,
      actionBy: profileData.accountId,
    };

    try {
      setDisabled(true);
      const res = await Axios.put(
        "/wms/InventoryLocation/EditInventoryLocation",
        businessData
      );
      cb(initData);
      setDisabled(false);
      toast.success(res.data?.message || "Submitted successfully", {
        toastId: shortid(),
      });
      backHandler();
      setData(initData);
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

  const backHandler = () => {
    history.push(`/inventory-management/configuration/inventory-location/`);
  };

  // const disableHandler = (cond) => {
  //   setDisabled(cond);
  // };

  return (
    <Card>
      {true && <ModalProgressBar />}
      <CardHeader title="Edit Inventory Location">
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
      {isDisabled && <Loading />}
        <div className="mt-0">
          <Form
            product={businessUnitData || initData}
            btnRef={btnRef}
            saveBusinessUnit={saveBusinessUnit}
            resetBtnRef={resetBtnRef}
            //disableHandler={disableHandler}
            businessUnitName={false}
            businessUnitCode={true}
            isEdit={true}
            accountId={profileData?.accountId}
            selectedBusinessUnit={selectedBusinessUnit}
            lastDisabled={true}
          />
        </div>
      </CardBody>
    </Card>
  );
}
