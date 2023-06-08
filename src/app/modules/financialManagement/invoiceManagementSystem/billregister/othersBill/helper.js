import Axios from 'axios'
import { toast } from 'react-toastify';



export const getPartnerTypeDDL = async (setter) => {
    try {
        const res = await Axios.get(
            "/fino/AccountingConfig/GetAccTransectionTypeDDL"
        );
        setter(res?.data);
    } catch (error) {
        console.log(error);
    }
};


export const loadPartners = (
    searchValue,
    accountId,
    businessUnitId,
    partnerTypeId
) => {
    if (searchValue?.length < 3) return [];
    return Axios
        .get(
            `/partner/BusinessPartnerPurchaseInfo/GetTransactionByTypeSearchDDL?AccountId=${accountId
            }&BusinessUnitId=${businessUnitId
            }&Search=${searchValue}&PartnerTypeName=${""}&RefferanceTypeId=${partnerTypeId
            }`
        )
        .then((res) => {
            return res?.data;
        })
        .catch((err) => []);
};


export const postOthersBillEntry = async (payload, cb) => {
    try {
        await Axios.post(`/fino/Advice/PostOthersBillEntry`, payload);
        toast.success("Saved successfully");
        cb && cb()
    } catch (error) {

    }
};


export const billRegisterGetById = async (id, setter, setDisabled) => {
    try {
        setDisabled(true)
        const res = await Axios.get(
            `/fino/BillRegister/BillRegisterGetById?Id=${id}`
        );
        setter(res?.data);
        setDisabled(false)
    } catch (error) {
        console.log(error);
        setDisabled(false)
    }
};

export const othersBillEntriesGetById = async (id, setter, setDisabled) => {
    try {
        setDisabled(true)
        const res = await Axios.get(
            `/fino/OthersBillEntry/OthersBillEntriesGetById?billId=${id}`
        );
        setter(res?.data);
        setDisabled(false)
    } catch (error) {
        console.log(error);
        setDisabled(false)
    }
};

export const billApproved = async (
    actionById,
    data,
    setDisabled,
    cb
) => {

    try {
        setDisabled(true);
        const res = await Axios.post(
            `/fino/BillRegister/BillApproved?ActionById=${actionById}`,
            data
        );

        toast.success(res?.data?.message || "Submitted successfully", {
            toastId: "BillApproved",
        });
        setDisabled(false);
        cb()
    } catch (error) {
        setDisabled(false);
        toast.error(error?.response?.data?.message, {
            toastId: "BillApproved",
        });
    }
};