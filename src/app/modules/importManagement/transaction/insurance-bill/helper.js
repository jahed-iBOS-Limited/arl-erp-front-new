import Axios from 'axios';
import { toast } from 'react-toastify';
import * as Yup from 'yup';
import { _dateFormatter } from '../../../_helper/_dateFormate';

export const getSingleData = async (
  id,
  setter,
  setInitDataForEdit,
  setDisabled
) => {
  setDisabled(true);
  try {
    const res = await Axios.get(
      `/wms/GatePass/GetGatePassById?GatePassId=${id}`
    );
    if (res.status === 200) {
      setInitDataForEdit({
        date: _dateFormatter(res?.data?.objHeader?.dteTransactionDate),
        fromAddress: res?.data?.objHeader?.strFromAddress,
        toAddress: res?.data?.objHeader?.isOthers
          ? res?.data?.objHeader?.strToAddress
          : {
              label: res?.data?.objHeader?.strToAddress,
              value: res?.data?.objHeader?.intToEmployeeId,
            },
        receiversName: res?.data?.objHeader?.strDriverName,
        contactNo: res?.data?.objHeader?.strContact,
        remarks: res?.data?.objHeader?.strRemarks,
        reason: {
          value: res?.data?.objHeader?.strReason,
          label: res?.data?.objHeader?.strReason,
        },
        vehicle: res?.data?.objHeader?.strVehicleNumber,
        others: res?.data?.objHeader?.isOthers,
        actionByName: res?.data?.objHeader?.actionByName,
        dteApproved: res?.data?.objHeader?.dteApprovedm,
        plant: {
          value: res?.data?.objHeader?.intPlantId,
          label: res?.data?.objHeader?.plantName,
        },
        warehouse: {
          value: res?.data?.objHeader?.intWareHouseId,
          label: res?.data?.objHeader?.warehouseName,
        },
        isPrint: res?.data?.objHeader?.isPrint,
        strGatePassCode: res?.data?.objHeader?.strGatePassCode,
        strApprovedBy: res?.data?.objHeader?.strApprovedBy,
        gatePassId: res?.data?.objHeader?.intGatePassId,
        intAccountId: res?.data?.objHeader?.intAccountId,
        intBusinessUnitId: res?.data?.objHeader?.intBusinessUnitId,
        intActionBy: res?.data?.objHeader?.intActionBy,
        businessUnitAddress: res?.data?.objHeader?.businessUnitAddress,
        businessUnitName: res?.data?.objHeader?.businessUnitName,

        intApprovedBy: res?.data?.objHeader?.intApprovedBy,
      });
      setter(
        res?.data?.objRow?.map((item) => ({
          item: item?.strItemName,
          uom: item?.strUom,
          quantity: item?.numQuantity,
          isReturnable: item?.isReturnable,
          intRowId: item?.intRowId,
        }))
      );
      setDisabled(false);
    }
  } catch (error) {
    setDisabled(false);
    toast.error(error?.response?.data?.message);
  }
};
export const approveGatePass = async (id, setDisabled, userId, cb) => {
  setDisabled(true);
  try {
    let obj = {
      actionBy: userId,
    };
    const res = await Axios.put(
      `/domain/GatePass/ApproveGatePass?gatePassId=${id}`,
      obj
    );
    toast.success(res?.data?.message);
    setDisabled(false);
    cb();
  } catch (error) {
    setDisabled(false);
    toast.error(error?.response?.data?.message);
  }
};

export const reason = [
  { value: 'Sample', label: 'Sample' },
  { value: 'Material Return', label: 'Material Return' },
  { value: 'Repair & Maintenance', label: 'Repair & Maintenance' },
  { value: 'Transfer', label: 'Transfer' },
  { value: 'Others', label: 'Others' },
];

//validation schema;
export const validationSchema = Yup.object().shape({
  receiversName: Yup.string().required('Driver/Receive Name is required'),
  contactNo: Yup.string()
    .required('Contact no is required')
    .matches(/^[0-9]+$/, 'Must be only digits')
    .min(11, 'Must be exactly 11 digits')
    .max(11, 'Must be exactly 11 digits'),
  remarks: Yup.string().required('Remarks is required'),
});

//send to email api;
export const sendEmailPostApi = async (dataObj) => {
  let formData = new FormData();
  formData.append('to', dataObj?.toMail);
  formData.append('cc', dataObj?.toCC);
  formData.append('bcc', dataObj?.toBCC);
  formData.append('subject', dataObj?.subject);
  formData.append('body', dataObj?.message);
  formData.append('file', dataObj?.attachment);
  try {
    let { data } = await Axios.post('/domain/MailSender/SendMail', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    toast.success('Mail Send Successfully');
    return data;
  } catch (error) {
    toast.error(
      error?.response?.data?.message || 'Mail cant not send successfully'
    );
  }
};
