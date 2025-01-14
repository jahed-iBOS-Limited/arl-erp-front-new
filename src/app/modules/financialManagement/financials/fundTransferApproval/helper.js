export const approveHandeler = ({ item, onApproveHandler, profileData, cb, isApproved }) => {



    const payload = {

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
        intRequestedBankId: item.intRequestedBankId || 0,
        strRequestedBankName: item.strRequestedBankName || "",
        intRequestedBankBranchId: item.intRequestedBankBranchId || 0,
        strRequestedBankBranchName: item.strRequestedBankBranchName || "",
        strRequestedBankAccountNumber: item.strRequestedBankAccountNumber || "",
        strRequestedBankAccountName: item.strRequestedBankAccountName || "",
        intRequestedBankAccountId: item.intRequestedBankAccountId || 0,
        intGivenBankId: item.intGivenBankId || 0,
        strGivenBankName: item.strGivenBankName || "",
        intGivenBankBranchId: item.intGivenBankBranchId || 0,
        strGivenBankBranchName: item.strGivenBankBranchName || "",
        strGivenBankAccountNumber: item.strGivenBankAccountNumber || "",
        strGivenBankAccountName: item.strGivenBankAccountName || "",
        strGivenBankAccountId: item?.strGivenBankAccountId || 0,
        strRemarks: item.strRemarks || "",
        dteExpectedDate: item.dteExpectedDate || "",
        intResponsibleEmpId: item.intResponsibleEmpId || 0,
        strResponsibleEmpName: item.strResponsibleEmpName || "",
        isActive: item.isActive ?? true,
        isApproved: isApproved,
        intApproveBy: profileData?.userId || 0,
        dteApproveDatetime: new Date().toISOString(),
        intRequestGLId: item?.intRequestGLId || 0,
        strRequestGlName: item?.strRequestGlName || "",
        strRequestPartnerId: item?.strRequestPartnerId || 0,
        strRequestPartnerName: item?.strRequestPartnerName || "",
        isTransferCreated: 0,

        "intGivenGlid": item?.intGivenGlid || 0,
        "strGivenGlCode": item?.strGivenGlCode || "",
        "strGivenGlName": item?.strGivenGlName || "",
        "strGivenPartnerName": item?.strGivenPartnerName || "",
        "intUpdateBy": profileData?.userId,
    }

    onApproveHandler(`/fino/FundManagement/CreateOrEditFundTransferRequest`, payload, cb, true);


}