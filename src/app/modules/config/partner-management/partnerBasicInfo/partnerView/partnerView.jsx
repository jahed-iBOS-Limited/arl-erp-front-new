import React, { useEffect } from "react";
import { shallowEqual, useSelector } from "react-redux";
import { useHistory, useParams } from "react-router-dom";
import {
  Card,
  CardBody,
  CardHeader,
  CardHeaderToolbar,
  ModalProgressBar,
} from "../../../../../../_metronic/_partials/controls";
import Loading from "../../../../_helper/_loading";
import useAxiosGet from "../../../../_helper/customHooks/useAxiosGet";
import PartnerBankInfo from "./partnerBankInfo";
import PartnerBasicInfo from "./partnerBasicInfo";
import PartnerSalesInfo from "./partnerSelesInfo";
export default function PartnerView() {
  // const [partnerInfo,setPartnerInfo] = useState()
  const [partnerInfo, getPartnerInfo, loadPartnerInfo] = useAxiosGet();
  const history = useHistory();
  const partnerNameFromHistory =
    history?.location?.state?.tableData?.businessPartnerName;
  const customerTypeFromHistory =
    history?.location?.state?.tableData?.businessPartnerTypeName;
  const businessPartnerCodeFromHistory =
    history?.location?.state?.tableData?.businessPartnerCode;
  const businessPartnerIdFromHistory =
    history?.location?.state?.tableData?.businessPartnerId;

  const backToPrevPage = () => {
    history.push(`/config/partner-management/partner-basic-info`);
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
    getPartnerInfo(
      `/partner/BusinessPartnerBasicInfo/GetBusinessPartnerInformationByPartnerID?accountId=${profileData?.accountId}&businessUnitId=${selectedBusinessUnit?.value}&partnerId=${id}`
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [businessPartnerIdFromHistory]);
  return (
    <Card>
      {loadPartnerInfo && <Loading />}
      {true && <ModalProgressBar />}
      <CardHeader
        title={`View partner Info : [${partnerNameFromHistory ||
          customerTypeFromHistory} - ${businessPartnerCodeFromHistory}]`}
      >
        <CardHeaderToolbar>
          <button
            type="button"
            onClick={backToPrevPage}
            className="btn btn-light"
          >
            <i className="fa fa-arrow-left"></i>
            Back
          </button>
        </CardHeaderToolbar>
      </CardHeader>
      <CardBody>
        <div className="mt-3">
          <PartnerBasicInfo basicInfo={partnerInfo?.basicInfo} />
          {partnerInfo?.bankInfo && (
            <PartnerBankInfo bankInfo={partnerInfo?.bankInfo} />
          )}
          {partnerInfo?.sales && (
            <PartnerSalesInfo
              sales={partnerInfo?.sales}
              shippintAddress={partnerInfo?.shippintAddress}
            />
          )}
        </div>
      </CardBody>
    </Card>
  );
}
