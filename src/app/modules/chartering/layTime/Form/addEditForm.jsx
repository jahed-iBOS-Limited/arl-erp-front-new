import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { shallowEqual, useSelector } from 'react-redux';
import { useParams } from 'react-router';
import { toast } from 'react-toastify';
import { getBusinessPartnerTypeDDL, getVesselDDL } from '../../helper';
import Loading from '../../_chartinghelper/loading/_loading';
import { _todayDate } from '../../_chartinghelper/_todayDate';
import { editLayTime, saveLayTime } from '../helper';
import '../style.css';
import Form from './form';
import { saveLayTimePayloadMaker } from '../../../_helper/_helperUtils/laytimeUtils';

export const initData = {
  /* Header */
  vesselName: '',
  voyageNo: '',
  layTimeType: { value: 1, label: 'Load Port' },
  timeAllowedForLoading: '',
  vesselArrived: '',
  portAt: '',
  cargoQty: '',
  cargo: '',
  loadingRate: '',
  notTendered: '',
  demurrageRate: '',
  loadingCommenced: '',
  despatchRate: '',
  loadingCompleted: '',
  stackHolderName: '',
  stackHolderType: '',
  cargoUomSuffix: '',
  loadUnloadRateSuffix: '',

  /* Row */
  ratio: 100,
  workingTime: '',
  workingTimeFrom: '',
  layTimeDate: _todayDate(),
  layhTimeDay: moment(_todayDate()).format('ddd').toUpperCase(),
  remark: '',
};

export default function LayTimeForm() {
  const { type } = useParams();
  const [loading, setLoading] = useState(false);
  const [rowData, setRowData] = useState([]);
  const [singleData, setSingleData] = useState({});
  const [id, setId] = useState(0);

  const [vesselDDL, setVesselDDL] = useState([]);
  const [stackHolderTypeDDL, setStackHolderTypeDDL] = useState([]);
  const [stackHolderNameDDL, setStackHolderNameDDL] = useState([]);

  const { profileData, selectedBusinessUnit } = useSelector((state) => {
    return state?.authData;
  }, shallowEqual);

  useEffect(() => {
    getVesselDDL(
      profileData?.accountId,
      selectedBusinessUnit?.value,
      setVesselDDL
    );
    getBusinessPartnerTypeDDL(setStackHolderTypeDDL);
  }, [profileData, selectedBusinessUnit]);

  const saveHandler = (values, cb) => {
    if (rowData?.length === 0) {
      return toast.warning('Please add at least lay time', {
        toastId: 112345,
      });
    }

    const payload = saveLayTimePayloadMaker({
      id,
      profileData,
      selectedBusinessUnit,
      values,
      rowData,
    });

    if (id > 0) {
      editLayTime(payload, setLoading, cb);
    } else {
      saveLayTime(payload, setLoading, cb);
    }
  };

  return (
    <React.Fragment>
      {loading && <Loading />}
      <Form
        title={
          type === 'edit'
            ? 'Edit Lay Time'
            : type === 'view'
              ? 'View Lay Time'
              : 'Lay Time'
        }
        initData={initData}
        saveHandler={saveHandler}
        viewType={type}
        vesselDDL={vesselDDL}
        stackHolderTypeDDL={stackHolderTypeDDL}
        setStackHolderTypeDDL={setStackHolderTypeDDL}
        stackHolderNameDDL={stackHolderNameDDL}
        setStackHolderNameDDL={setStackHolderNameDDL}
        setLoading={setLoading}
        id={id}
        rowData={rowData}
        setRowData={setRowData}
        setId={setId}
        singleData={singleData}
        setSingleData={setSingleData}
      />
    </React.Fragment>
  );
}
