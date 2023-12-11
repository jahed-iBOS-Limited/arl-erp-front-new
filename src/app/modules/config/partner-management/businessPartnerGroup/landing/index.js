/* eslint-disable react-hooks/exhaustive-deps */
import { Formik } from "formik";
import React, { useEffect, useState } from "react";
import ICustomCard from "../../../../_helper/_customCard";
import BusinessPartnerGroupLandingForm from "./form";
import BusinessPartnerGroupLandingTable from "./table";
import { useHistory } from "react-router-dom";
import useAxiosGet from "../../../../_helper/customHooks/useAxiosGet";
import { shallowEqual, useSelector } from "react-redux";
import PaginationTable from "../../../../_helper/_tablePagination";

const initData = {
  channel: "",
  customer: "",
  partnerGroup: "",
};

export default function BusinessPartnerGroupLanding() {
  const history = useHistory();
  const [rowData, getRowData, , setRowData] = useAxiosGet();
  const [partnerGroups, getPartnerGroups] = useAxiosGet();
  const [pageNo, setPageNo] = useState(0);
  const [pageSize, setPageSize] = useState(25);
  const [businessPartnerGroup, GetBusinessPartnerGroupList] = useAxiosGet()


  const {
    profileData: { accountId: accId },
    selectedBusinessUnit: { value: buId },
  } = useSelector((state) => state.authData, shallowEqual);

  const getLandingData = (values, _pageNo = 0, _pageSize = 25) => {
    getRowData(
      `/partner/BusinessPartnerBasicInfo/GetBusinessPartnerGroupDetailPagination?businessUnitId=${buId}&businessPartnerId=${values
        ?.customer?.value || 0}&businessPartnerGroupId=${values?.partnerGroup
        ?.value || 0}&pageNo=${_pageNo}&pageSize=${_pageSize}`
    );
  };

  useEffect(() => {
    GetBusinessPartnerGroupList(`/partner/BusinessPartnerBasicInfo/GetBusinessPartnerGroupDDL`);
    getPartnerGroups(
      `/partner/BusinessPartnerBasicInfo/GetBusinessPartnerGroupDDL`
    );
    getLandingData(initData);
  }, [buId]);

  const setPositionHandler = (pageNo, pageSize, values) => {
    getLandingData(values, pageNo, pageSize);
  };

  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={{}}
        onSubmit={(values, { resetForm }) => {}}
      >
        {({ handleSubmit, resetForm, values, setFieldValue }) => (
          <ICustomCard
            title={"Business Partner Group"}
            createHandler={() => {
              history.push(
                `/config/partner-management/businesspartnergroup/create`
              );
            }}
          >
            <BusinessPartnerGroupLandingForm
              obj={{
                accId,
                buId,
                partnerGroups,
                values,
                setFieldValue,
                getLandingData,
              }}
            />
            <BusinessPartnerGroupLandingTable obj={{ rowData, businessPartnerGroup, setRowData}} />
            {rowData?.data?.data?.length > 0 && (
              <PaginationTable
                count={rowData?.data?.totalCount}
                setPositionHandler={setPositionHandler}
                paginationState={{
                  pageNo,
                  setPageNo,
                  pageSize,
                  setPageSize,
                }}
                values={values}
              />
            )}
          </ICustomCard>
        )}
      </Formik>
    </>
  );
}
