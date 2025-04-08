import React, { useRef, useState } from 'react';
import { shallowEqual, useSelector } from 'react-redux';
import { useHistory } from 'react-router';
import {
  Card,
  CardBody,
  CardHeader,
  CardHeaderToolbar,
  ModalProgressBar,
} from '../../../../../../_metronic/_partials/controls';
import Loading from '../../../../_helper/_loading';
import Form from './form';

const initData = {
  reason: '',
  commission: '',
  charges: '',
  swift: '',
  stationary: '',
  vat: '',
  LCExpireDate: '',
  lastShipDate: '',
  PIAmount: '',
  paymentDate: '',
};

export default function InspectionAndSurveyForm() {
  const [isDisabled, setDisabled] = useState(false);
  const [objProps, setObjprops] = useState({});
  const [rowDto, setRowDto] = useState([]);
  const [edit, setEdit] = useState(true);

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

  const remover = (payload) => {
    const filterArr = rowDto.filter((itm, index) => +index !== +payload);
    setRowDto(filterArr);
  };

  const history = useHistory();

  const backHandler = () => {
    history.goBack();
  };

  return (
    <Card>
      {true && <ModalProgressBar />}
      <CardHeader title="Create Inspection And Survey">
        <CardHeaderToolbar>
          <>
            <button
              type="reset"
              onClick={backHandler}
              ref={resetBtnRef}
              className="btn btn-light ml-2"
            >
              <i className="fa fa-arrow-left"></i>
              Back
            </button>
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
            profileData={profileData}
            accountId={profileData?.accountId}
            selectedBusinessUnit={selectedBusinessUnit}
            setter={setter}
            remover={remover}
            rowDto={rowDto}
            setRowDto={setRowDto}
            setEdit={setEdit}
            isDisabled={isDisabled}
          />
        </div>
      </CardBody>
    </Card>
  );
}
