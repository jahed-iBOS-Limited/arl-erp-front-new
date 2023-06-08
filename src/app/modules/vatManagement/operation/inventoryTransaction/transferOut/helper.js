import Axios from "axios";
import { toast } from "react-toastify";
import { _dateFormatter } from "../../../../_helper/_dateFormate";


export const GetBranchDDL = async (accid, buid, setter) => {
  try {
    const res = await Axios.get(
      `/vat/TaxDDL/GetTaxBranchDDL?AccountId=${accid}&BusinessUnitId=${buid}`
    );
    if (res.status === 200 && res?.data) {
      setter(res?.data);
    }
  } catch (error) {}
};

export const GetItemNameDDL = async (accId, buId, typeId, setter) => {
  try {
    const res = await Axios.get(
      `/vat/TaxDDL/GetTaxItemListByItemTypeDDL?AccountId=${accId}&BusinessUnitId=${buId}&TaxItemTypeId=${typeId}`
    );
    if (res.status === 200 && res?.data) {
      setter(res?.data);
    }
  } catch (error) {}
};

export const GetTransactionTypeDDL = async (setter) => {
  try {
    const res = await Axios.get(`/vat/TaxDDL/GetTransactionTypeDDL`);
    if (res.status === 200 && res?.data) {
      setter(res?.data);
    }
  } catch (error) {}
};

export const GetUomDDL = async (accId, buId, setter) => {
  try {
    const res = await Axios.get(
      `/vat/TaxDDL/ItemNameWithCodeUomDDL?AccountId=${accId}&BusinessUnitId=${buId}`
    );
    if (res.status === 200 && res?.data) {
      setter(res?.data);
    }
  } catch (error) {}
};

export const GetItemTypeDDL = async (setter) => {
  try {
    const res = await Axios.get(`/vat/TaxDDL/GetTaxItemTypeDDL`);
    if (res.status === 200 && res?.data) {
      setter(res?.data);
    }
  } catch (error) {}
};

// get vat adjustment by id
export const getItemTransferOutById = async (
  taxSalesId,
  itemtypeid,
  setter,
  setLoading
) => {
  try {
    setLoading && setLoading(true);
    const res = await Axios.get(
      `/vat/ItemTransferOut/GetItemTransferOutById?taxSalesId=${taxSalesId}&itemtypeid=${itemtypeid}`
    );
    if (res.status === 200 && res?.data) {
      if (res?.data?.getByIdRow?.length > 0) {
        setter(res?.data);
        setLoading && setLoading(false);
      } else {
        toast.warning("No data found");
        setLoading && setLoading(false);
      }
    }
  } catch (error) {
    console.log(error.message);
  }
};

export const getEmployeeDesination = async (userId, setDesinationName, cb) => {
  try {
    const res = await Axios.get(
      `/vat/EmployeeBasicInfo/GetEmployeeBasicInfoById?EmployeeId=${userId}`
    );
    if (res.status === 200 && res?.data) {
      setDesinationName(res?.data[0]?.designationName);
      cb();
    }
  } catch (error) {
    console.log(error.message);
  }
};

export const GetToBusinessUnitDDL = async (setter) => {
  try {
    const res = await Axios.get(
      `/domain/BusinessUnitDomain/GetBusinessUnitDDL?AccountId=1&BusinessUnitId=1`
    );
    if (res.status === 200 && res?.data) {
      setter(res?.data);
    }
  } catch (error) {}
};

export const saveTrasnferOut = async (data, cb, setDisabled) => {
  setDisabled(true);
  try {
    const res = await Axios.post(
      `/vat/ItemTransferOut/CreateItemTransferOut`,
      data
    );
    if (res.status === 200) {
      toast.success(res.data?.message || "Submitted successfully");
      cb();
      setDisabled(false);
    }
  } catch (error) {
    toast.error(error?.response?.data?.message);
    setDisabled(false);
  }
};

export const GetTransferOutPagination = async (
  accId,
  buId,
  taxBranchId,
  itemId,
  setter,
  setLoading,
  pageNo,
  pageSize,
  search
) => {
  try {
    setLoading(true);
    const searchPath = search ? `searchTerm=${search}&` : "";
    const res = await Axios.get(
      `/vat/ItemTransferOut/GetItemTransferOutSearchPagination?${searchPath}accountId=${accId}&businessUnitId=${buId}&taxBranchId=${taxBranchId}&ItemTypeId=${itemId}&status=true&PageNo=${pageNo}&PageSize=${pageSize}&viewOrder=desc`
    );
    if (res.status === 200 && res?.data) {
      if (res?.data?.data?.length > 0) {
        setter(res?.data);
      } else {
        toast.warning("Data not found");
        setter([]);
      }
     
      setLoading(false);
    }
  } catch (error) {
    setLoading(false);
  }
};

export const getSingleData = async (
  taxSalesId,
  itemtypeid,
  setter,
  setRowDto
) => {
  try {
    const res = await Axios.get(
      `/vat/ItemTransferOut/GetItemTransferOutById?taxSalesId=${taxSalesId}&itemtypeid=${itemtypeid}`
    );
    if (res.status === 200 && res?.data) {
      const data = res?.data;

      const newData = {
        objHeader: {
          ...data?.objHeader,
          branch: {
            value: data?.getByIdHeader?.taxBranchId,
            label: data?.getByIdHeader?.taxBranchName,
          },
          branchAddress: data?.getByIdHeader?.taxBranchAddress,
          transactionType: {
            value: data?.getByIdHeader?.taxTransactionTypeId,
            label: data?.getByIdHeader?.taxTransactionTypeName,
          },
          itemType: {
            value: data?.getByIdHeader?.itemTypeId,
            label: data?.getByIdHeader?.itemTypeName,
          },
          toBusinessUnit: {
            value: data?.getByIdHeader?.businessUnitId,
            label: data?.getByIdHeader?.businessUnitName,
          },
          transferTo: {
            value: data?.getByIdHeader?.otherBranchId,
            label: data?.getByIdHeader?.otherBranchName,
          },
          address: data?.getByIdHeader?.otherBranchAddress,
          transactionDate: _dateFormatter(
            data?.getByIdHeader?.taxDeliveryDateTime
          ),
          vehicleInfo: data?.getByIdHeader?.vehicleNo,
          referenceNo: data?.getByIdHeader?.referenceNo,
          referenceDate: _dateFormatter(data?.getByIdHeader?.referenceDate),
          totalAmount: data?.getByIdHeader?.totalAmount,
        },
        objRow: [...data?.getByIdRow],
      };

      const newRowDto = newData?.objRow.map((item) => ({
        itemName: {
          value: item?.taxItemGroupId,
          label: item?.taxItemGroupName,
        },
        uom: {
          value: item?.uomid,
          label: item?.uomname,
        },
        quantity: item?.quantity,
        rate: item?.basePrice,
        amount: item?.baseTotal,
        basePrice: Math.abs(item?.basePrice),
        individualAmount: Math.abs(item?.baseTotal),
      }));
      setRowDto(newRowDto);
      setter(newData);
    }
  } catch (error) {}
};

export const saveEditedTransferOut = async (data, setDisabled) => {
  setDisabled(true);
  try {
    const res = await Axios.put(
      `/vat/ItemTransferOut/EditItemTransferOut`,
      data
    );
    if (res.status === 200) {
      toast.success(res.data?.message || "Edited successfully");
      setDisabled(false);
    }
  } catch (error) {
    toast.error(error?.response?.data?.message);
    setDisabled(false);
  }
};

export const GetItemDDLForLanding = async (setter) => {
  try {
    const res = await Axios.get(`/vat/TaxDDL/GetTaxItemTypeDDL`);
    if (res.status === 200 && res?.data) {
      setter(res?.data);
    }
  } catch (error) {}
};

export const getBranchName_api = async (userId, accId, buId, setter) => {
  try {
    const res = await Axios.get(
      `/vat/OrganizationalUnitUserPermissionFotVat/GetOrganizationalUnitUserPermission?UserId=${userId}&AccId=${accId}&BusinessUnitId=${buId}&OrgUnitTypeId=15`
    );
    if (res.status === 200 && res?.data) {
      setter(res?.data);
    }
  } catch (error) {}
};