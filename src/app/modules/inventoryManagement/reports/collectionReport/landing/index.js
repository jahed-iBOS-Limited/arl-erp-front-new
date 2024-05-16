/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState } from "react";
import ICustomCard from "../../../../_helper/_customCard";
import { useSelector } from "react-redux";
import { shallowEqual } from "react-redux";
import { getDeliveryCollectionDueReport } from "../helper";
import { Formik } from "formik";
import { Form } from "formik";
import Loading from "../../../../_helper/_loading";
import NewSelect from "./../../../../_helper/_select";
import { _dateFormatter } from "./../../../../_helper/_dateFormate";

const initData = {
  dueType: { value: 0, label: "All" },
};

function CollectionReportLanding() {
  const [gridData, setGridData] = useState([]);
  const [loading, setLoading] = useState(false);

  // get user profile data from store
  const storeData = useSelector((state) => {
    return {
      profileData: state?.authData?.profileData,
      selectedBusinessUnit: state?.authData?.selectedBusinessUnit,
    };
  }, shallowEqual);

  const { profileData, selectedBusinessUnit } = storeData;

  return (
    <>
      <ICustomCard title="Collection Due Report">
        {loading && <Loading />}
        <Formik enableReinitialize={true} initialValues={initData}>
          {({ values, setFieldValue }) => (
            <>
              <Form>
                <div className="row global-form">
                  <div className="col-lg-3">
                    <NewSelect
                      name="dueType"
                      options={[
                        { value: 0, label: "All" },
                        { value: 1, label: "Due" },
                        { value: 2, label: "Over Due" },
                      ]}
                      value={values?.dueType}
                      label="Due Type"
                      onChange={(valueOption) => {
                        setFieldValue("dueType", valueOption);
                        getDeliveryCollectionDueReport(
                          profileData?.accountId,
                          selectedBusinessUnit?.value,
                          valueOption?.value,
                          setGridData,
                          setLoading
                        );
                      }}
                      placeholder="Due Type"
                    />
                  </div>
                </div>

                <div className="row">
                  {loading && <Loading />}

                  <div className="col-lg-12">
                    <div className="table-responsive">
                      <table className="table table-striped table-bordered global-table table-font-size-sm">
                        <thead>
                          <tr>
                            <th>SL</th>
                            <th>Partner Name</th>
                            <th>Partner Code</th>
                            <th>Partner Address</th>
                            <th>Delivery Date</th>
                            {values?.dueType?.value === 0 ? (
                              <th>Collection Day Over</th>
                            ) : null}
                            {values?.dueType?.value === 0 ? (
                              <th>Collection Day Remaining</th>
                            ) : null}
                            {values?.dueType?.value === 2 ? (
                              <th>Collection Day Over</th>
                            ) : null}
                            {values?.dueType?.value === 1 ? (
                              <th>Collection Day Remaining</th>
                            ) : null}
                            <th>Collection Date</th>
                            <th>Delivery Code</th>
                          </tr>
                        </thead>
                        <tbody className="text-center">
                          {gridData?.map((item, index) => (
                            <tr key={index}>
                              <td>{index + 1}</td>
                              <td style={{ textAlign: "left" }}>
                                {item?.soldToPartnerName}
                              </td>
                              <td>{item?.soldToPartnerCode}</td>
                              <td style={{ textAlign: "left" }}>
                                {item?.shipToPartnerAddress}
                              </td>
                              <td>{_dateFormatter(item?.deliveryDate)}</td>
                              {values?.dueType?.value === 0 ? (
                                <td>{item?.collectionDayOver}</td>
                              ) : null}
                              {values?.dueType?.value === 0 ? (
                                <td>{item?.collectionDayRemaining}</td>
                              ) : null}
                              {values?.dueType?.value === 2 ? (
                                <td>{item?.collectionDayOver}</td>
                              ) : null}
                              {values?.dueType?.value === 1 ? (
                                <td>{item?.collectionDayRemaining}</td>
                              ) : null}
                              <td>{_dateFormatter(item?.collectionDate)}</td>
                              <td>{item?.deliveryCode}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </Form>
            </>
          )}
        </Formik>
      </ICustomCard>
    </>
  );
}

export default CollectionReportLanding;
