import Axios from 'axios';
import { toast } from 'react-toastify';
import * as Yup from 'yup';

//warehouse ddl

//create data;

//landing api;

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
