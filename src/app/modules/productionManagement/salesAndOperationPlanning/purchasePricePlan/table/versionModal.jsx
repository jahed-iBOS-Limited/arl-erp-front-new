/* eslint-disable react-hooks/exhaustive-deps */
import { Formik } from "formik";
import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import ICustomCard from "../../../../_helper/_customCard";
import { getLogVersionDDL, getVersionGridData } from "../helper";
import Loading from "../../../../_helper/_loading";
import NewSelect from "../../../../_helper/_select";

const initData = {
  log: "",
};

const VersionModal = ({ versionModalData }) => {
  const [loading, setLoading] = useState(false);
  const [logDDL, setLogDDL] = useState([]);
  const [gridData, setGridData] = useState();

  const { profileData, selectedBusinessUnit } = useSelector((state) => {
    return {
      profileData: state.authData.profileData,
      selectedBusinessUnit: state.authData.selectedBusinessUnit,
    };
  });

  useEffect(() => {
    if (versionModalData?.salesPlanId) {
      getLogVersionDDL(
        profileData?.accountId,
        selectedBusinessUnit?.value,
        versionModalData?.salesPlanId,
        setLogDDL
      );
    }
  }, [profileData, selectedBusinessUnit, versionModalData?.salesPlanId]);

  return (
    <ICustomCard title="View Log Version">
      <Formik
        enableReinitialize={true}
        initialValues={initData}
        onSubmit={(values, { setSubmitting, resetForm }) => {}}
      >
        {({
          handleSubmit,
          resetForm,
          values,
          errors,
          touched,
          setFieldValue,
        }) => (
          <>
            {loading && <Loading />}

            {/* Create Row */}
            <div className="global-form row">
              <div className="col-lg-3">
                <NewSelect
                  isHiddenToolTip
                  name="log"
                  options={logDDL}
                  value={values?.log}
                  isSearchable={true}
                  label="Log Version"
                  placeholder="Log Version"
                  onChange={(valueOption) => {
                    setFieldValue("log", valueOption);
                    getVersionGridData(
                      versionModalData?.salesPlanId,
                      valueOption?.value,
                      setGridData,
                      setLoading
                    );
                  }}
                  errors={errors}
                  touched={touched}
                />
              </div>
            </div>

            {gridData?.length > 0 ? (
              <div className="table-responsive">
                <table className="global-table table">
                  <thead>
                    <tr>
                      <th>SL</th>
                      <th>Item Name</th>
                      <th>UoM Name</th>
                      <th style={{ width: "100px" }}>Plan Quantity</th>
                      <th style={{ width: "100px" }}>Entry Plan Quantity</th>
                    </tr>
                  </thead>
                  <tbody>
                    {gridData?.map((item, index) => (
                      <tr key={index}>
                        <td className="text-center">{index + 1}</td>
                        <td className="pl-2">{item?.itemName}</td>
                        <td className="pl-2">{item?.uomName}</td>
                        <td className="text-right">{item?.itemPlanQty}</td>
                        <td className="text-right">{item?.entryItemPlanQty}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : null}
          </>
        )}
      </Formik>
    </ICustomCard>
  );
};

export default VersionModal;
