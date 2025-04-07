import * as Yup from 'yup';
import { _currentTime } from '../../../_helper/_currentTime';
import { toast } from 'react-toastify';

// init data
export const initData = {
  businessUnit: '',
  cardNo: '',
  outTime: '',
};

// validation schema
export const validationSchema = Yup.object().shape({
  businessUnit: Yup.object({
    value: Yup.number().required('Business unit is required'),
    label: Yup.string().required('Business unit is required'),
  }).required('Business unit is required'),
  cardNo: Yup.string().required('Card no is required'),
  outTime: Yup.string().required('Out time is required'),
});

// qr style
export const qrStyles = {
  right: 0,
  top: 0,
  cursor: 'pointer',
  color: 'blue',
  zIndex: '1',
};

// set gate out current time
export const setGateOutCurrentTime = (setFieldValue) => {
  setFieldValue('outTime', _currentTime());
};

// qr code scanner handler
export function qrCodeScannerHandler(obj) {
  const { setFieldValue, values, getCardNoDetails } = obj;

  setGateOutCurrentTime(setFieldValue);
  document.getElementById('cardNo').disabled = true;

  fetchCardNoDetails({
    values,
    getCardNoDetails,
    cb: function (data) {
      if (data?.length <= 0) {
        setCardNoFormFieldEmpty(setFieldValue);
      }
    },
  });
}

export function setCardNoFormFieldEmpty(setFieldValue) {
  setFieldValue('cardNo', '');
  toast.warn('Vehicle entry not found');
  document.getElementById('cardNo').disabled = false;
  document.getElementById('cardNo').focus();
}

// fetch card no details
export function fetchCardNoDetails(obj) {
  const { values, getCardNoDetails, cb } = obj;
  const { businessUnit, cardNo } = values;

  getCardNoDetails(
    `/mes/MSIL/GetAllMSIL?PartName=GetVehicleInfoByCardForForcedGateOut&BusinessUnitId=${businessUnit?.value}&search=${cardNo}`,
    function (res) {
      cb && cb(res);
    }
  );
}
