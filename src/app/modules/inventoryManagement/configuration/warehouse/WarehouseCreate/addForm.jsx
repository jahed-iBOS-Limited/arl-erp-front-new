import React, { useState, useRef } from 'react';
import {
  Card,
  CardBody,
  CardHeader,
  CardHeaderToolbar,
} from '../../../../../../_metronic/_partials/controls';
import { useSelector, shallowEqual } from 'react-redux';
import { ModalProgressBar } from '../../../../../../_metronic/_partials/controls';
import Form from '../common/form';
import Axios from 'axios';
import { toast } from 'react-toastify';
import shortid from 'shortid';
import Loading from '../../../../_helper/_loading';
const initProduct = {
  id: undefined,
  warehouseName: '',
  warehouseCode: '',
  warehouseAddress: '',
};

export default function AddForm({
  history,
  match: {
    params: { id },
  },
}) {
  // get user profile data from store
  const profileData = useSelector((state) => {
    return state.authData.profileData;
  }, shallowEqual);

  // get selected business unit from store

  const [isDisabled, setDisabled] = useState(false);
  const saveWarehouse = async (values, cb) => {
    if (!id && values) {
      const warehouseData = {
        accountId: profileData.accountId,
        warehouseCode: values.warehouseCode,
        warehouseName: values.warehouseName,
        warehouseAddress: values.warehouseAddress,
        actionBy: profileData.userId,
      };

      try {
        setDisabled(true);
        const res = await Axios.post(
          '/wms/Warehouse/CreateWarehouse',
          warehouseData
        );
        cb(initProduct);
        setDisabled(false);
        toast.success(res.data?.message || 'Submitted successfully', {
          toastId: shortid(),
        });
      } catch (error) {
        toast.error(error?.response?.data?.message, { toastId: shortid() });
        setDisabled(false);
      }
    } else {
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

  return (
    <Card>
      {true && <ModalProgressBar />}
      <CardHeader title="Create Warehouse">
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
            // disableHandler={disableHandler}
            accountId={profileData?.accountId}
          />
        </div>
      </CardBody>
    </Card>
  );
}
