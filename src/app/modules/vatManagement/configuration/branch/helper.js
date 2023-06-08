import Axios from 'axios'
import { toast } from 'react-toastify'
// /vat/TaxBranch/GetTaxBranchById?TaxBrachId=11
export const GetTaxBranchById = async (taxBranchId, setter) => {
  try {
    const res = await Axios.get(
      `/vat/TaxBranch/GetTaxBranchById?TaxBrachId=${taxBranchId}`
    )
    if (res.status === 200 && res?.data) {
      let newData = {
        ...res?.data[0],
        taxBranchName: res?.data[0]?.taxBranchName,
        taxBranchAddress: res?.data[0]?.taxBranchAddress,
      }
      setter(newData)
    }
  } catch (error) {
    
  }
}
//create shippoint api
export const createTaxShipmentExtend = async (data, cb, setDisabled) => {
  setDisabled(true)
  try {
    const res = await Axios.post(
      `/vat/TaxShipmentExtend/CreateTaxShipmentExtend`,
      data
    )
    if (res.status === 200) {
      toast.success(res?.message || 'Submitted successfully')
      cb()
      setDisabled(false)
    }
  } catch (error) {
    
    setDisabled(false)
  }
}
//
export const getTaxShipmentExtendByBranchId = async (
  accId,
  buId,
  taxBranchId,
  setter
) => {
  try {
    const res = await Axios.get(
      `/vat/TaxShipmentExtend/GetTaxShipmentExtendByBranchId?AccountId=${accId}&BusinessUnitId=${buId}&TaxBranchId=${taxBranchId}`
    )
    // if (res.status === 200 && res?.data) {
    //   const data = res?.data;
    //   let newData = [
    //     {
    //       ...res?.data,
    //       shipPointNames: data?.shipPointId,
    //     },
    //   ];
    //   setter(newData);
    //   console.log(newData);
    // }
    if (res.status === 200 && res?.data) {
      const data = res?.data
      const newData = data.map((item) => {
        return {
          shipPointId: item.shipPointId,
          shipPointNames: item.shipPointName,
        }
      })
      setter(newData)
    }
  } catch (error) {
    
  }
}
