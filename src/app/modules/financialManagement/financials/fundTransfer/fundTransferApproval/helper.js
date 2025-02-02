export const approveHandeler = ({ item, onApproveHandler, profileData, cb, isApproved, isTransferCreated, journalCode, bankPaymentValues, actionName }) => {

    const isBankRelatedAction = ["Bank Payments", "Cash Transfer"].includes(actionName);

    const commonFileds = {
        intFundTransferRequestId: item.intFundTransferRequestId || 0,
        strRequestCode: item.strRequestCode || "",
        intRequestTypeId: item.intRequestTypeId,
        strRequestType: item.strRequestType || "",
        intRequestByUnitId: item.intRequestByUnitId || 0,
        strRequestByUnitName: item.strRequestByUnitName || "",
        intRequestToUnitId: item.intRequestToUnitId || 0,
        strRequestToUnitName: item.strRequestToUnitName || "",
        dteRequestDate: item.dteRequestDate || "",
        numAmount: item.numAmount || 0,

        strRemarks: item.strRemarks || "",
        dteExpectedDate: item.dteExpectedDate || "",
        intResponsibleEmpId: item.intResponsibleEmpId || 0,
        strResponsibleEmpName: item.strResponsibleEmpName || "",
        isActive: item.isActive ?? true,
        isApproved: isApproved,
        intApproveBy: profileData?.userId || 0,
        dteApproveDatetime: new Date().toISOString(),

        strRequestPartnerId: item?.strRequestPartnerId || 0,
        strRequestPartnerName: item?.strRequestPartnerName || "",
        isTransferCreated: isTransferCreated || 0,
        strGivenPartnerName: item?.strGivenPartnerName || "",
        strGivenstrPartnerCode: item?.strGivenstrPartnerCode || "",
        strRequestPartnerCode: item?.strRequestPartnerCode || "",
        intUpdateBy: profileData?.userId,
        intGivenPartnerId: item?.intGivenPartnerId || 0


    }

    const commonBankFields = {

        intRequestedBankId: item.intRequestedBankId || 0,
        strRequestedBankName: item.strRequestedBankName || "",
        intRequestedBankBranchId: item.intRequestedBankBranchId || 0,
        strRequestedBankBranchName: item.strRequestedBankBranchName || "",
        strRequestedBankAccountNumber: item.strRequestedBankAccountNumber || "",
        strRequestedBankAccountName: item.strRequestedBankAccountName || "",
        intRequestedBankAccountId: item.intRequestedBankAccountId || 0,
        strRequestedBankRouting: item.strRequestedBankRouting || "",
        intRequestGLId: item?.intRequestGLId?.generalLedgerId || item?.intRequestGlid || 0,
        strRequestGlName: item?.strRequestGlName?.generalLedgerName || item?.strRequestGlName || "",
        strRequestGlCode: item?.strRequestGlCode?.generalLedgerCode || item?.strRequestGlCode || "",
        intGivenBankId: isBankRelatedAction ? bankPaymentValues?.bankAcc?.bankId : item.intGivenBankId || 0,
        strGivenBankName: isBankRelatedAction ? bankPaymentValues?.bankAcc?.bankName : item.strGivenBankName || "",
        intGivenBankBranchId: isBankRelatedAction ? bankPaymentValues?.bankAcc?.bankBranch_Id : item.intGivenBankBranchId || 0,
        strGivenBankBranchName: isBankRelatedAction ? bankPaymentValues?.bankAcc?.bankBranchName : item.strGivenBankBranchName || "",
        strGivenBankAccountNumber: isBankRelatedAction ? bankPaymentValues?.bankAcc?.bankAccNo : item.strGivenBankAccountNumber || "",
        strGivenBankAccountName: isBankRelatedAction ? bankPaymentValues?.bankAcc?.label : item.strGivenBankAccountName || "",
        strGivenBankAccountId: isBankRelatedAction ? bankPaymentValues?.bankAcc?.value : item?.strGivenBankAccountId || 0,
        strGivenBankRouting: isBankRelatedAction ? bankPaymentValues?.bankAcc?.bankRouting : item?.strGivenBankRouting || "",
        intGivenGlid: isBankRelatedAction ? bankPaymentValues?.bankAcc?.generalLedgerId : item?.intGivenGlid || 0,
        strGivenGlCode: isBankRelatedAction ? bankPaymentValues?.bankAcc?.generalLedgerCode : item?.strGivenGlCode || "",
        strGivenGlName: isBankRelatedAction ? bankPaymentValues?.bankAcc?.generalLedgerName : item?.strGivenGlName || "",


    }

    const finalBankFields = { ...commonBankFields };
    const commonPayload = {
        ...commonFileds,
        ...finalBankFields,
        strReceivingJournal: "",
        strSendingJournal: journalCode || "",
        isFundReceived: false,
    }

    const forFundRecievedPayload = {
        ...commonFileds,
        ...finalBankFields,
        strReceivingJournal: journalCode || "",
        strSendingJournal: item?.strSendingJournal || "",
        isFundReceived: ["Bank Receipt"].includes(actionName),
    }

    const finalPayload = ["Bank Receipt"].includes(actionName) ? forFundRecievedPayload : commonPayload;

    onApproveHandler(`/fino/FundManagement/CreateOrEditFundTransferRequest`, finalPayload, cb, true);


}