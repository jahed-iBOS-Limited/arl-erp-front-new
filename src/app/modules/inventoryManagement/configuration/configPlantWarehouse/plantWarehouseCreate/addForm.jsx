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
  plantName: '',
  warehouseName: '',
};
export default function PlantWarehouseAddForm({
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
    if (!id && values && profileData && selectedBusinessUnit) {
      const businessData = {
        accountId: profileData.accountId,
        warehouseId: values.warehouseName.value,
        warehouseName: values.warehouseName.label,
        plantId: values.plantName.value,
        plantName: values.plantName.label,
        businessUnitId: selectedBusinessUnit.value,
        businessUnitName: selectedBusinessUnit.label,
        actionBy: profileData.userId,
        lastActionDateTime: '2020-07-08T09:19:27.446Z',
        isActive: true,
      };

      try {
        setDisabled(true);
        const res = await Axios.post(
          '/wms/ConfigPlantWearHouse/CreateConfigPlantWH',
          businessData
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

  const backHandler = () => {
    history.push(`/inventory-management/configuration/conf-plant-warehouse`);
  };

  return (
    <Card>
      {true && <ModalProgressBar />}
      <CardHeader title="Config. Plant Warehouse">
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
            product={initProduct}
            btnRef={btnRef}
            saveBusinessUnit={saveBusinessUnit}
            resetBtnRef={resetBtnRef}
            //disableHandler={disableHandler}
            accountId={profileData?.accountId}
            selectedBusinessUnit={selectedBusinessUnit}
          />
        </div>
      </CardBody>
    </Card>
  );
}
