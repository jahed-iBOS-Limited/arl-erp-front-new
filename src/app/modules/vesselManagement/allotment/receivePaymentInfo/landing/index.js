/* eslint-disable react-hooks/exhaustive-deps */
import { Formik } from "formik";
import React, { useEffect } from "react";
import { shallowEqual, useSelector } from "react-redux";
import ICustomCard from "../../../../_helper/_customCard";
import Loading from "../../../../_helper/_loading";
import useAxiosGet from "../../../../_helper/customHooks/useAxiosGet";
import ReceivePaymentInfoLandingForm from "./form";
import ReceivePaymentInfoLandingTable from "./table";

const initData = {
  port: "",
  motherVessel: "",
  soldToPartner: "",
  shipToPartner: "",
  status: "",
};

const ReceivePaymentInfoLanding = () => {
  const [gridData, getGridData, isLoading] = useAxiosGet();
  const [soldToPartnerDDL, getSoldToPartnerDDL] = useAxiosGet();
  const [godownDDL, getGodownDDL] = useAxiosGet();

  // get user data from store
  const {
    profileData: { accountId: accId },
    selectedBusinessUnit: { value: buId },
  } = useSelector((state) => state?.authData, shallowEqual);

  const setLandingData = (values) => {
    const url = `/tms/GtoGDeliveryInfo/GetG2GDeliveryInfoForReceivePayment?businessUnitId=${buId}&portId=${
      values?.port?.value
    }&motherVesselId=${values?.motherVessel?.value}&soldToPartnerId=${
      values?.soldToPartner?.value
    }&shipToPartnerId=${values?.shipToPartner?.value}&paymentReceiveStatus=${
      values?.status?.value
    }&pageNo=${0}&pageSize=${1000}`;

    getGridData(url);
  };

  useEffect(() => {
    getSoldToPartnerDDL(
      `/tms/LigterLoadUnload/GetG2GBusinessPartnerDDL?BusinessUnitId=${buId}&AccountId=${accId}`
    );
  }, [accId, buId]);

  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={initData}
        onSubmit={() => {}}
      >
        {({ values, setFieldValue }) => (
          <>
            <ICustomCard title="Receive Payment Info">
              {isLoading && <Loading />}
              <ReceivePaymentInfoLandingForm
                obj={{
                  buId,
                  values,
                  godownDDL,
                  getGodownDDL,
                  setFieldValue,
                  setLandingData,
                  soldToPartnerDDL,
                }}
              />
              <ReceivePaymentInfoLandingTable obj={{ gridData }} />
            </ICustomCard>
          </>
        )}
      </Formik>
    </>
  );
};

export default ReceivePaymentInfoLanding;
