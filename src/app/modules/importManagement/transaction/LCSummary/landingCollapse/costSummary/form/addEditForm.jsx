import React, { useRef, useState } from 'react';
import { shallowEqual, useSelector } from 'react-redux';
import {
  Card,
  CardBody,
  CardHeader,
  CardHeaderToolbar,
  ModalProgressBar,
} from '../../../../../../../../_metronic/_partials/controls';
import Loading from '../../../../../../_helper/_loading';
import Form from './form';

const initData = {
  shipment: '',
  BLAWBTRNo: '',
  BLAWBTRDate: '',
  LCOpeningCharge: '',
  insurancePolicy: '',
  totalDocReleaseCharges: '',
  paymentOnMaturityAndPG: '',
  customDutyAndTaxes: '',
  portCharges: '',
  shippingCharges: '',
  transportCharges: '',
  CFCharges: '',
  surveyCharges: '',
  cleaningCharges: '',
  unloadingCharges: '',
  shipmentWiseTotalCost: '',
};

export default function CostSummary() {
  const [isDisabled, setDisabled] = useState(false);
  const [objProps, setObjprops] = useState({});
  const [rowDto, setRowDto] = useState([]);
  const saveBtnRef = useRef();
  const resetBtnRef = useRef();

  const setter = (payload) => {
    setRowDto([...rowDto, payload]);
  };

  const profileData = useSelector((state) => {
    return state.authData.profileData;
  }, shallowEqual);

  const selectedBusinessUnit = useSelector((state) => {
    return state.authData.selectedBusinessUnit;
  }, shallowEqual);

  const saveHandler = async (values, cb) => {};

  const remover = (payload) => {
    const filterArr = rowDto.filter((itm, index) => +index !== +payload);
    setRowDto(filterArr);
  };

  return (
    <Card>
      <ModalProgressBar />
      <CardHeader title="Cost Summary (BDT)">
        <CardHeaderToolbar>
          <>
            <button
              type="reset"
              ref={resetBtnRef}
              className="btn btn-light ml-2"
            >
              <i className="fa fa-redo"></i>
              Reset
            </button>
            <button
              type="submit"
              className="btn btn-primary ml-2"
              ref={saveBtnRef}
              disabled={isDisabled}
            >
              Save
            </button>
          </>
        </CardHeaderToolbar>
      </CardHeader>
      <CardBody>
        {isDisabled && <Loading />}
        {/* {data && ( */}
        <div className="mt-0">
          <Form
            {...objProps}
            initData={initData}
            saveHandler={saveHandler}
            profileData={profileData}
            accountId={profileData?.accountId}
            selectedBusinessUnit={selectedBusinessUnit}
            setter={setter}
            remover={remover}
            rowDto={rowDto}
            setRowDto={setRowDto}
            isDisabled={isDisabled}
          />
        </div>
      </CardBody>
    </Card>
  );
}
