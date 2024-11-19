import axios from "axios";
import { toast } from "react-toastify";

export const getBankDDL = async (setter, setLoading) => {
    try {
        setLoading(true);
        const res = await axios.get(`/hcm/HCMDDL/GetBankDDL`);
        setter(res?.data);
        setLoading(false);
    } catch (error) {
        setLoading(false);
        setter([]);
    }
};

export const getBankAccountDDLByBankId = async (
    accId,
    buId,
    bankId,
    setter,
    setLoading
) => {
    try {
        setLoading(true);
        const res = await axios.get(
            `/fino/FinanceCommonDDL/BankAccountNumberByBankIdDDL?AccountId=${accId}&BusinessUnitId=${buId}&BankId=${bankId}`
        );
        setter(res?.data);
        setLoading(false);
    } catch (error) {
        setLoading(false);
        setter([]);
    }
};

export const getFacilityDLL = async (buiId, bankId, setter, setLoading) => {
    try {
        setLoading(true);
        const res = await axios.get(`/fino/FundManagement/GetFacilityDDL?BusinessUnitId=${buiId}&BankId=${bankId ||
            0}
      `);
        setter(res?.data);
        setLoading(false);
    } catch (error) {
        setLoading(false);
        setter([]);
    }
};

export const disbursementPurposeDDL = [
    { value: 1, label: "Duty" },
    { value: 2, label: "Bill Payment" },
    { value: 3, label: "Utility Payment" },
    { value: 4, label: "Working Capital" },
];


// export const createLoanRegister = async ({
//     accId,
//     buId,
//     loanAcc,
//     bankId,
//     bankAccId,
//     facilityId,
//     startDate,
//     tenureDays,
//     principle,
//     interest,
//     disbursementPurposeId,
//     disbursementPurposeName = "",
//     actionId,
//     cb,
//     isConfirm = false,
//     loanAccountId = 0
// }
// ) => {
//     try {
//         const res = await axios.post(
//             `/fino/FundManagement/FundLoanAccountCreate?accountId=${accId}&businessUnitId=${buId}&loanAcc=${loanAcc}&bankId=${bankId}&bankAccId=${bankAccId}&facilityId=${facilityId}&startDate=${startDate}&tenureDays=${tenureDays}&numPrinciple=${principle}&numIntRate=${interest}&actionById=${actionId}&disbursementPurposeId=${disbursementPurposeId}&disbursementPurposeName=${disbursementPurposeName ||
//             ""}&isConfirm=${isConfirm}&loanAccountId=${loanAccountId}`
//         );
//         if (res.status === 200) {
//             toast.success(res?.message || "Submitted successfully");
//             cb();
//         }
//     } catch (error) {
//         toast.error(error?.response?.data?.message);
//     }
// };



export const createLoanRegister = async ({
    accId,
    buId,
    loanAcc,
    bankId,
    bankAccId,
    facilityId,
    startDate,
    tenureDays,
    principle,
    interest,
    disbursementPurposeId,
    disbursementPurposeName = "",
    actionId,
    cb,
    isConfirm = false,
    loanAccountId = 0,
    facilityRemarks = "",
    remarks = "",
}) => {
    try {
        // Construct the request body
        const requestBody = {
            accountId: accId,
            businessUnitId: buId,
            loanAcc,
            bankId,
            bankAccId,
            facilityId,
            startDate,
            tenureDays,
            numPrinciple: principle,
            numIntRate: interest,
            actionById: actionId,
            disbursementPurposeId,
            disbursementPurposeName,
            isConfirm,
            loanAccountId,
            facilityRemarks,
            remarks,
        };

        // Send the POST request with the request body
        const res = await axios.post(`/fino/FundManagement/LTRFundLoanAccountCreate`, requestBody);

        if (res.status === 200) {
            toast.success(res?.message || "Submitted successfully");
            cb();
        }
    } catch (error) {
        toast.error(error?.response?.data?.message || "An error occurred");
    }
};
