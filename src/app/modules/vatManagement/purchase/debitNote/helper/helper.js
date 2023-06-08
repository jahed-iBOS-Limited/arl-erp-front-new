import axios from 'axios'
import { toast } from 'react-toastify'
import shortid from 'shortid';

// getDebitNoteLandingGridData
export const getDebitNoteLandingGridData = async (
  accId,
  buId,
  taxBranchId,
  fromDate,
  toDate,
  setter,
  setLoading,
  pageNo,
  pageSize,
  search
) => {
  try {
    setLoading(true)
    const searchPath = search ? `searchTerm=${search}&` : ''
    const res = await axios.get(
      `/vat/DebitNote/GetDebitNoteLandingSearchPasignation?${searchPath}AccountId=${accId}&BusinessUnitId=${buId}&TaxBranchId=${taxBranchId}&PageNo=${pageNo}&PageSize=${pageSize}&viewOrder=desc&Fromdate=${fromDate}&Todate=${toDate}`
    )
    if (res.status === 200 && res.data) {
      setter(res.data)
      setLoading(false)
    }
  } catch (error) {
    
    setLoading(false)
  }
}
//getDebitNoteById
export const getDebitNoteById = async (id, setter, setRowData) => {
  try {
    const res = await axios.get(
      `/vat/DebitNote/GetDebitNoteById?TaxPurchaseId=${id}`
    )
    if (res.status === 200 && res.data) {
      const data = res?.data

      const newData = {
        objHeader: {
          ...data?.objHeader,
          branchName: {
            value: data?.objHeader?.taxBranchId,
            label: data?.objHeader?.taxBranchName,
          },
          fiscalYear: {
            value: data?.objHeader?.taxYear,
            label: data?.objHeader?.taxYear,
          },
          purchaseInvoice: {
            value: data?.objHeader?.taxPurchaseId,
            label: data?.objHeader?.taxPurchaseCode,
          },
          partnerName: {
            value: data?.objHeader?.supplierId,
            label: data?.objHeader?.supplierName,
          },
        },
        objRow: [...data?.objRowList],
      }

      const newRowData = newData?.objRow.map((item) => ({
        ...item,
        // itemName: {
        //   value: item?.taxItemGroupId,
        //   label: item?.taxItemGroupName,
        // },
        purchaseInvoice: {
          value: data?.objHeader?.taxPurchaseId,
          label: data?.objHeader?.taxPurchaseCode,
        },
        returnQty: item?.returnQty,
        returnVat: item?.returnVat,
        returnSd: item?.returnSd,
        apiQuantity: +item?.quantity,
        apivatTotal: +item?.vatTotal,
        apiSdtotal: +item?.sdtotal,
        itemNameLabel: item?.taxItemGroupName,
        itemName: item?.taxItemGroupId
      }))
      setter(newData)
      setRowData(newRowData)
    }
  } catch (error) {
    
  }
}

// getBranchDDl
export const getBranchDDl = async (userId, accid, buid, setter) => {
  try {
    const res = await axios.get(
      `/wms/BusinessUnitPlant/GetOrganizationalUnitUserPermission?UserId=${userId}&AccId=${accid}&BusinessUnitId=${buid}&OrgUnitTypeId=15`
    )
    if (res.status === 200 && res.data) {
      setter(res.data)
    }
  } catch (error) {
    
  }
}
//getPurchaseInvoiceDDl
export const getPurchaseInvoiceDDl = async (partnerId, setter) => {
  try {
    const res = await axios.get(`/vat/TaxDDL/PurchaseInvoiceDDL?partnerId=${partnerId}`)
    if (res.status === 200 && res.data) {
      setter(res.data)
    }
  } catch (error) {
    
  }
}

// getFiscalYearDDL
export const getFiscalYearDDL = async (setter) => {
  try {
    const res = await axios.get('/vat/TaxDDL/FiscalYearDDL')

    if (res.status === 200 && res.data) {
      setter(res.data)
    }
  } catch (error) {
    
  }
}

// Partner DDl
export const getPartnerDDl = async (accId, buId, setter) => {
  try {
    const res = await axios.get(
      `/partner/PManagementCommonDDL/GetBusinessPartnerbyIdDDL?AccountId=${accId}&BusinessUnitId=${buId}&PartnerTypeId=1`
    )

    if (res.status === 200 && res.data) {
      setter(res.data)
    }
  } catch (error) {
    
  }
}

//get View Information
export const getViewDataApi = async (taxPurchaseId, setter) => {
  try {
    const res = await axios.get(
      `/vat/TaxPurchase/GetTaxPurchaseById?TaxPurchaseId=${taxPurchaseId}`
    )
    if (res.status === 200 && res?.data) {
      setter(res?.data)
    }
  } catch (error) {
    
  }
}
//save Debite Data
export const saveDebitNote = async (payload, cb, setter, setDisabled) => {
  try {
    setDisabled(true)
    const res = await axios.post(`/vat/DebitNote/CreateDebitNote`, payload)
    if (res.status === 200) {
      toast.success("Submitted Successfully", {
        toastId: shortid(),
      });
      setter([])
      cb()
      setDisabled(false)
    }
  } catch (error) {
    console.log(error)
    setDisabled(false)
  }
}
//Edit Debite Data
export const editDebitNote_api = async (payload, setDisabled) => {
  try {
    setDisabled(true)
    const res = await axios.put(`/vat/DebitNote/EditDebitNote`, payload)
    if (res.status === 200) {
      toast.success(res.data?.message || 'Submitted successfully')
      setDisabled(false)
    }
  } catch (error) {
    console.log(error)
    setDisabled(false)
  }
}
//getTaxItemByPurchaseInvoiceId_api
export const getTaxItemByPurchaseInvoiceId_api = async (invoiceId, setter) => {
  try {
    const res = await axios.get(
      `/vat/TaxDDL/GetTaxItemByPurchaseInvoiceId?SalesInvoiceId=${invoiceId}`
    )

    if (res.status === 200 && res.data) {
      setter(res.data)
    }
  } catch (error) {}
}

export const getTaxPurchaseItemDetailsSingle_api = async (
  itemGroupId,
  PurchaseCode,
  setter
) => {
  try {
    const res = await axios.get(
      `/vat/TaxPurchase/GetTaxPurchaseItemDetailsByTaxItemGroupId?taxItemGroupId=${itemGroupId}&TaxPurchaseCode=${PurchaseCode}`
    )

    if (res.status === 200 && res.data) {
      setter(res.data)
    }
  } catch (error) {}
}
export const getTaxPurchaseItemDetailsALL_api = async (
  PurchaseCode,
  setter
) => {
  try {
    const res = await axios.get(
      `/vat/TaxPurchase/GetTaxPurchaseItemDetailsALL?TaxPurchaseCode=${PurchaseCode}`
    )

    if (res.status === 200 && res.data) {
      setter(res.data)
    }
  } catch (error) {}
}
