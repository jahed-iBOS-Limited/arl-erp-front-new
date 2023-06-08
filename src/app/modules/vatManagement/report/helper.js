import Axios from 'axios'
import { toast } from 'react-toastify'
import shortid from "shortid";

export const GetVatItemPagination = async (accountId, buId, setter) => {
  try {
    const res = await Axios.get(
      `/vat/TaxItemGroup/GetTaxItemGroupPagination?accountId=${accountId}&businessUnitId=${buId}&PageNo=1&PageSize=20&viewOrder=desc`
    )
    if (res.status === 200 && res?.data?.data) {
      setter(res?.data?.data)
    }
  } catch (error) {
    
  }
}

export const GetVatItemView = async (taxItemGroupId, setter) => {
  try {
    const res = await Axios.get(
      `/vat/TaxItemGroup/GetTaxItemGroupById?taxItemGroupId=${taxItemGroupId}
      `
    )
    if (res.status === 200 && res?.data) {
      const data = res?.data[0]
      const newData = {
        ...data,
        taxItemTypeId: {
          value: data.taxItemTypeId,
          label: data.taxItemTypeName,
        },
        taxItemCategoryId: {
          value: data.taxItemCategoryId,
          label: data.taxItemCategoryName,
        },
        supplyTypeId: {
          value: data.supplyTypeId,
          label: data.supplyTypeName,
        },
        itemTypeId: {
          value: data.supplyTypeId,
          label: data.supplyTypeName,
        },
        hsCode: {
          value: data.hsCode,
          label: data.hsCode,
        },
        uomName: {
          value: data.uomId,
          label: data.uomName,
        },
        businessUnitId: {
          value: data.businessUnitId,
          label: data.businessUnitName,
        },
      }
      setter(newData)
    }
  } catch (error) {
    
  }
}
export const getItemTypeListDDL_api = async (setter) => {
  try {
    const res = await Axios.get(
      `/item/ItemCategory/GetItemTypeListDDL
      `
    )
    if (res.status === 200 && res?.data) {
      const data = res?.data
      const newData = data.map((item) => {
        return {
          value: item.itemTypeId,
          label: item.itemTypeName,
        }
      })
      setter(newData)
    }
  } catch (error) {
    
  }
}

export const saveVatItem = async (data, cb) => {
  try {
    const res = await Axios.post(`/vat/TaxItemGroup/CreateTaxItemGroup`, data)
    if (res.status === 200) {
      toast.success("Submitted Successfully", {
        toastId: shortid(),
      });
      cb()
    }
  } catch (error) {
    
    toast.error(error?.response?.data?.message)
  }
}

export const saveEditedVatItem = async (data, cb) => {
  try {
    const res = await Axios.put(`/vat/TaxItemGroup/EditTaxItemGroup`, data)
    if (res.status === 200) {
      toast.success(res.data?.message || 'Edited successfully')
      cb()
    }
  } catch (error) {
    
    toast.error(error?.response?.data?.message)
  }
}

export const getItemCategoryDDL_api = async (setter) => {
  try {
    const res = await Axios.get(`/item/ItemCategoryGL/ItemCategoryDDL`)
    if (res.status === 200 && res?.data) {
      setter(res?.data)
    }
  } catch (error) {
    
  }
}

export const getSupplyTypeDDL_api = async (setter) => {
  try {
    const res = await Axios.get(`/vat/TaxDDL/SupplyTypeDDL`)
    if (res.status === 200 && res?.data) {
      setter(res?.data)
    }
  } catch (error) {
    
  }
}

export const getHSCodeDDL_api = async (setter) => {
  try {
    const res = await Axios.get(`/vat/TaxDDL/HSCodeDDL`)
    if (res.status === 200 && res?.data) {
      setter(res?.data)
    }
  } catch (error) {
    
  }
}

export const getTaxItemTypeDDL_api = async (setter) => {
  try {
    const res = await Axios.get(`/vat/TaxDDL/GetTaxItemTypeDDL`)
    if (res.status === 200 && res?.data) {
      setter(res?.data)
    }
  } catch (error) {
    
  }
}

export const getItemUOMDDL_api = async (accountId, buId, setter) => {
  try {
    const res = await Axios.get(
      `/item/ItemUOM/GetItemUOMDDL?AccountId=${accountId}&BusinessUnitId=${buId}`
    )
    if (res.status === 200 && res?.data) {
      setter(res?.data)
    }
  } catch (error) {
    
  }
}
