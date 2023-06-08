import axios from 'axios'
import { toast } from 'react-toastify'

export const partnerBasicAttachment_action = async (attachment, cb) => {
  let formData = new FormData()
  attachment.forEach((file) => {
    formData.append('files', file?.file)
  })
  try {
    let { data } = await axios.post('/domain/Document/UploadFile', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    // toast.success(res?.data?.message || "Submitted Successfully");
    toast.success('Upload  successfully')
    return data
  } catch (error) {
    toast.error('Document not upload')
    
  }
}


// createPartnerBasic_api
export const createPartnerBasic_api = async (data, cb, setDisabled) => {
  try {
    setDisabled(true)
    const res = await axios.post(
      `/partner/BusinessPartnerBasicInfo/CreateBusinessPartner`,
      data
    )
    if (res.status === 200) {
      toast.success(res?.message || 'Submitted successfully')
      cb()
      setDisabled(false)
    }
  } catch (error) {
    
    toast.error(error?.response?.data?.message)
    setDisabled(false)
  }
}

export const editPartnerBasic_api = async (data, cb, setDisabled) => {
  try {
    setDisabled(true)
    const res = await axios.put(
      `/partner/BusinessPartnerBasicInfo/EditBusinessPartner`,
      data
    )
    if (res.status === 200) {
      toast.success(res?.message || 'Submitted successfully')
      cb()
      setDisabled(false)
    }
  } catch (error) {
    
    toast.error(error?.response?.data?.message)
    setDisabled(false)
  }
}
export const EditBPShippingAddressDefaultById_api = async (
  data,

  setDisabled
) => {
  try {
    setDisabled(true)
    const res = await axios.put(
      `/partner/BusinessPartnerShippingAddress/EditBPShippingAddressDefaultById`,
      data
    )
    if (res.status === 200) {
      // toast.success(res?.message || 'Submitted successfully', {
      //   toastId: 'editBPShipping',
      // })
      setDisabled(false)
    }
  } catch (error) {
    
    // toast.error(error?.response?.data?.message)
    setDisabled(false)
  }
}
