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

export default function EditForm({
  history,
  match: {
    params: { id },
  },
}) {
  const [isDisabled, setDisabled] = useState(false);

  const [warehouseData, setData] = useState("");
  useEffect(() => {
    getBusinessUnitById(id);
  }, [id]);

  // get user profile data from store
  const profileData = useSelector((state) => {
    return state.authData.profileData;
  }, shallowEqual);
  // get selected business unit from store
  const selectedBusinessUnit = useSelector((state) => {
    return state.authData.selectedBusinessUnit;
  }, shallowEqual);

  const getBusinessUnitById = async (id) => {
    const res = await Axios.get(
      `/wms/Plant/GetPlantEditViewDataById?Id=${id}`
    );
    const { data } = res;
    if (data.length) {
      res.data.forEach((r) => {
        const singleObject = {
          plantName: r.plantName,
          plantCode: r.plantCode,
          plantAddress: r.plantAddress,
        };
        setData(singleObject);
      });
    }
  };

  // save business unit data to DB
  const saveWarehouse = async (values, cb) => {
    
    setDisabled(true);
    const warehouseData = {
      plantId: +id,
      accountId: profileData.accountId,
      plantCode: values.plantCode,
      plantName: values.plantName,
      plantAddress: values.plantAddress,
      businessUnitId: selectedBusinessUnit.value,
      businessUnit: selectedBusinessUnit.label,
      actionBy: profileData.userId,
    };

    try {
      setDisabled(true);
      await Axios.put(
        "/wms/Plant/EditPlant",
        warehouseData
      );
      cb();
      setDisabled(false);
      toast.success("Save successfully", { toastId: shortid() });
      backToWarehouseList();
    } catch (error) {
     
      setDisabled(false);
      toast.error(error?.response?.data?.message, { toastId: shortid() });
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
    history.push(`/inventory-management/configuration/plant/`);
  };

  // const disableHandler = (cond) => {
  //   setDisabled(cond);
  // };

  return (
    <Card>
      {true && <ModalProgressBar />}
      <CardHeader title="Edit Plant">
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
        {warehouseData && (
          <div className="mt-0">
            <Form
              product={warehouseData}
              btnRef={btnRef}
              saveWarehouse={saveWarehouse}
              resetBtnRef={resetBtnRef}
             // disableHandler={disableHandler}
              plantName={false}
              plantCode={true}
              accountId={profileData?.accountId}
              selectedBusinessUnit={selectedBusinessUnit}
            />
          </div>
        )}
      </CardBody>
    </Card>
  );
}
