import Axios from "axios";
import { toast } from "react-toastify";

export const sendEmailPostApi = async (dataObj) => {
    let formData = new FormData()
      formData.append('to', dataObj?.toMail)
      formData.append('cc', dataObj?.toCC)
      formData.append('bcc', dataObj?.toBCC)
      formData.append('subject', dataObj?.subject)
      formData.append('body', dataObj?.message)
      formData.append('file', dataObj?.attachment)
    try {
      let { data } = await Axios.post('/domain/MailSender/SendMail', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
  
      toast.success('Mail Send Successfully')
      return data
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Mail cant not send successfully')
      
    }
  }