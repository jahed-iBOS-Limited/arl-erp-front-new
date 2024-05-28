import React, { useEffect } from "react";
import { shallowEqual, useSelector } from "react-redux";
import { useHistory, useParams,useLocation } from "react-router-dom";
import CommonTable from "../../../_helper/commonTable";
import IForm from "../../../_helper/_form";
import useAxiosGet from "../../../_helper/customHooks/useAxiosGet";
import Loading from "../../../_helper/_loading";
import useAxiosPost from "../../../_helper/customHooks/useAxiosPost";
export default function CreateApprovePartner() {
  // const [partnerInfo,setPartnerInfo] = useState()

  const [annualData, getAnnualTurn, loadAnnualData] = useAxiosGet();
  const [, createPartner, loadCreatePartner] = useAxiosPost();
  const [, createApproval, loadCreateApproval] = useAxiosGet();
  const [
    mainBusinessData,
    getMainBusinessData,
    loadMainBusinessData,
  ] = useAxiosGet();
  const [
    majorCustomerData,
    getMajorCustomerData,
    loadMajorCustomerData,
  ] = useAxiosGet();
  const [ownershipData, getOwnershipData, loadOwnershipData] = useAxiosGet();

  const annualheadersData = ["SL", "Year", "Amount"];
  const mainheadersData = ["SL", "Name"];
  const majorheadersData = [
    "SL",
    "Name",
    "Contact-Person",
    "Mobile",
    "Customer Type",
  ];
  const ownerheadersData = ["SL", "Name", "Mobile", "Address"];
  const history = useHistory();
  const location = useLocation();
const {state}=location
  const backToPrevPage = () => {
    history.push(`/config/partner-management/partner-registration-approval`);
  };
  const { id } = useParams();

  const storeData = useSelector((state) => {
    return {
      profileData: state?.authData?.profileData,
      selectedBusinessUnit: state?.authData?.selectedBusinessUnit,
    };
  }, shallowEqual);
  const { profileData, selectedBusinessUnit } = storeData;

  useEffect(() => {
    if (+id) {
      getAnnualTurn(
        `/partner/BusinessPartnerBasicInfo/PartnerRegistration?partName=GetAnnualTurnOverById&autoId=${+id}`
      );
      getMainBusinessData(
        `partner/BusinessPartnerBasicInfo/PartnerRegistration?partName=GetMainBusinessAreaById&autoId=${+id}`
      );
      getMajorCustomerData(
        `partner/BusinessPartnerBasicInfo/PartnerRegistration?partName=GetMajorCustomerById&autoId=${+id}`
      );
      getOwnershipData(
        `partner/BusinessPartnerBasicInfo/PartnerRegistration?partName=GetOwnershipById&autoId=${+id}`
      );
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);
console.log({state});
console.log({ownershipData});
console.log({mainBusinessData});
console.log({majorCustomerData});


  return (
    <IForm
      customTitle="Partner Create & Approve"
      isHiddenReset
      isHiddenBack
      isHiddenSave
      renderProps={() => {
        return (
          <>
            <button
              type="button"
              className="btn btn-primary mx-2"
              onClick={backToPrevPage}
            >
              Go Back
            </button>
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => {
                createPartner(
                  `/partner/BusinessPartnerBasicInfo/CreateBusinessPartner`,
                  {
                    accountId: profileData?.accountId,
                    businessUnitId: selectedBusinessUnit?.value,
                    businessPartnerCode: "",
                    businessPartnerName: state?.businessPartnerName,
                    businessPartnerAddress: state?.businessPartnerAddress,
                    contactNumber: state?.contactNumber,
                    bin:state?.bin,
                    licenseNo:state?.licenseNo,
                    email:  state?.email,
                    businessPartnerTypeId:  state?.businessPartnerTypeId,
                    partnerSalesType: state?.partnerSalesType,
                    actionBy: profileData?.userId,
                    attachmentLink: "",
                    // isCreateUser: false,
                    propitor: profileData?.employeeFullName,
                    contactPerson: "",
                    contactNumber2: "",
                    contactNumber3: "",
                  },
                  (res)=>{
                   
                    
                    if(res?.statuscode === 200){
                        createApproval(`/partner/BusinessPartnerBasicInfo/PartnerRegistration?partName=ApproveRegistration&autoId=${+id}&actionByEmployeeId=${profileData?.employeeId}&actionByErpUserId=${profileData?.userId}`,{},()=>{},true)
                    }
                  },
                  true
                );
              }}
            >
              Create
            </button>
          </>
        );
      }}
    >
      {(loadOwnershipData ||
        loadMajorCustomerData ||
        loadMainBusinessData ||
        loadAnnualData ||
        loadCreatePartner ||
        loadCreateApproval) && <Loading />}
      <>
        {mainBusinessData?.length > 0 ? (
          <div style={{ marginTop: "7px", gap: "5px" }}>
            <>
              <h4> Main Business Information</h4>
              <CommonTable headersData={mainheadersData}>
                <tbody>
                  {mainBusinessData?.map((item, index) => (
                    <tr>
                      <td className="text-center">{index + 1}</td>
                      <td className="text-center">{item?.strName}</td>
                    </tr>
                  ))}
                </tbody>
              </CommonTable>
            </>
          </div>
        ) : null}
        {majorCustomerData?.length > 0 ? (
          <div style={{ marginTop: "7px", gap: "5px" }}>
            <>
              <h4> Major Customer Information </h4>

              <CommonTable headersData={majorheadersData}>
                <tbody>
                  {majorCustomerData?.map((item, index) => (
                    <tr>
                      <td className="text-center">{index + 1}</td>
                      <td className="text-center">{item?.strCompanyName}</td>
                      <td className="text-center">
                        {item?.strContactPersonName}
                      </td>
                      <td className="text-center">{item?.strContactNumber}</td>
                      <td className="text-center">{item?.strCustomerType}</td>
                    </tr>
                  ))}
                </tbody>
              </CommonTable>
            </>
          </div>
        ) : null}
        {ownershipData?.length > 0 ? (
          <div style={{ marginTop: "7px", gap: "5px" }}>
            <>
              <h4> Owner Information </h4>

              <CommonTable headersData={ownerheadersData}>
                <tbody>
                  {ownershipData?.map((item, index) => (
                    <tr>
                      <td className="text-center">{index + 1}</td>
                      <td className="text-center">{item?.strName}</td>
                      <td className="text-center">{item?.strMobileNumber}</td>
                      <td className="text-center">{item?.strAddress}</td>
                    </tr>
                  ))}
                </tbody>
              </CommonTable>
            </>
          </div>
        ) : null}
        {annualData?.length > 0 ? (
          <div style={{ marginTop: "7px", gap: "5px" }}>
            <>
              <h4>Annual Information</h4>
              <CommonTable headersData={annualheadersData}>
                <tbody>
                  {annualData?.map((item, index) => (
                    <tr>
                      <td className="text-center">{index + 1}</td>
                      <td className="text-center">{item?.intYear}</td>
                      <td className="text-center">{item?.numTaka}</td>
                    </tr>
                  ))}
                </tbody>
              </CommonTable>
            </>
          </div>
        ) : null}
      </>
    </IForm>
  );
}
