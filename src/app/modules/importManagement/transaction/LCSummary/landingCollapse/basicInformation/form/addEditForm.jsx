import React, { useEffect, useRef, useState } from 'react';
import { shallowEqual, useSelector } from 'react-redux';
import {
  Card,
  CardBody,
  CardHeader,
  CardHeaderToolbar,
  ModalProgressBar,
} from '../../../../../../../../_metronic/_partials/controls';
import Loading from '../../../../../../_helper/_loading';
import { GetInsuranceTypeDDL, GetProviderDDL } from '../helper';
import Form from './form';

const initData = {
  indentNumber: '',
  supplierName: '',
  bankName: '',
  LCNumber: '',
  LCDate: '',
  incoTerms: '',
  lastShipmentDate: '',
  paymentMode: '',
  HSCode: '',
  loadingPort: '',
  destinationPort: '',
  tolerance: '',
  currency: '',
  totalInvoiceAmount: '',
  cashMargin: '',
  FDRMargin: '',
  LCLength: '',
  insuranceProviderName: '',
  coverNoteNumber: '',
  noOfLCAmendments: '',
  noOfInsuranceAmendments: '',
};

export default function BasicInformation() {
  const [isDisabled, setDisabled] = useState(false);
  const [objProps, setObjprops] = useState({});
  const [rowDto, setRowDto] = useState([]);
  const [edit, setEdit] = useState(true);

  const [insuranceTypeDDL, setInsuranceTypeDDL] = useState([]);
  const [providerDDL, setProviderDDL] = useState([]);

  const saveBtnRef = useRef();
  const resetBtnRef = useRef();

  const setter = (payload) => {
    setRowDto([...rowDto, payload]);
  };

  //   // get user profile data from store
  const profileData = useSelector((state) => {
    return state.authData.profileData;
  }, shallowEqual);

  //   // get selected business unit from store
  const selectedBusinessUnit = useSelector((state) => {
    return state.authData.selectedBusinessUnit;
  }, shallowEqual);

  // GetDDL
  useEffect(() => {
    GetInsuranceTypeDDL(setInsuranceTypeDDL);
    GetProviderDDL(setProviderDDL);
  }, []);

  console.log(insuranceTypeDDL, providerDDL, 'providerDDL', 'insuranceTypeDDL');

  const saveHandler = async (values, cb) => {};

  const remover = (payload) => {
    const filterArr = rowDto.filter((itm, index) => +index !== +payload);
    setRowDto(filterArr);
  };

  return (
    <Card>
      {true && <ModalProgressBar />}
      <CardHeader title="Basic Information">
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
            setEdit={setEdit}
            isDisabled={isDisabled}
            insuranceTypeDDL={insuranceTypeDDL}
            providerDDL={providerDDL}
          />
        </div>
      </CardBody>
    </Card>
  );
}
