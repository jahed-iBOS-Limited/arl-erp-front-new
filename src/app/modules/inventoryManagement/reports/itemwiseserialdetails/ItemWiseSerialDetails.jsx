import React, { useEffect, useState } from "react";
import HeaderPortion from "./HeaderPortion";
import TablePortion from "./TablePortion";
import { Form, Formik } from "formik";
import { initData } from "./constants";
import ICustomCard from "../../../_helper/_customCard";
import useAxiosGet from "../../../_helper/customHooks/useAxiosGet";
import Loading from "../../../_helper/_loading";
import { shallowEqual, useSelector } from "react-redux";

const ItemWiseSerialDetails = () => {
  const storeData = useSelector((state) => {
    return {
      profileData: state?.authData?.profileData,
      selectedBusinessUnit: state?.authData?.selectedBusinessUnit,
    };
  }, shallowEqual);

  const { profileData, selectedBusinessUnit } = storeData;
  const [itemWiseSerialDetailsReport, getItemWiseSerialDetailsReport, itemWiseSerialDetailsLoading] = useAxiosGet([]);

  const getReportData = (values) => {
    getItemWiseSerialDetailsReport(
      `/wms/Delivery/ItemSerialWiseSalesReport?ItemId=${values?.item?.value || 0}&UsingStatus=${values?.usingStatus
        ?.value || 0}&FromDate=${values?.fromDate}&ToDate=${values?.toDate}&SearchableText=${values?.serialNumber ||
        ""}`
    );
  };

  return (
    <ICustomCard title="Item Wise Serial Details">
      <Formik enableReinitialize={true} initialValues={initData}>
        {({ setFieldValue, values, errors, touched }) => (
          <>
            {itemWiseSerialDetailsLoading && <Loading />}
            <div className="row">
              <div className="col-lg-12">
                <Form className="form form-label-right">
                  <div className="row global-form">
                    <HeaderPortion
                      values={values}
                      setFieldValue={setFieldValue}
                      getReportData={getReportData}
                      errors={errors}
                      touched={touched}
                      selectedBusinessUnit={selectedBusinessUnit}
                      profileData={profileData}
                    />
                  </div>
                </Form>
              </div>
              <div className="col-lg-12">
                <TablePortion landingData={itemWiseSerialDetailsReport} />
              </div>
            </div>
          </>
        )}
      </Formik>
    </ICustomCard>
  );
};

export default ItemWiseSerialDetails;
