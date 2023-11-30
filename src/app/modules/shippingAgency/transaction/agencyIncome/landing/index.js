import { Formik } from "formik";
import React, { useEffect, useState } from "react";
import { shallowEqual, useSelector } from "react-redux";
import ICustomCard from "../../../../_helper/_customCard";
import InputField from "../../../../_helper/_inputField";
import Loading from "../../../../_helper/_loading";
import NewSelect from "../../../../_helper/_select";
import { _todayDate } from "../../../../_helper/_todayDate";
import { getASLLAgencyBill } from "../helper";
import LandingTable from "./table";

const initData = {
  fromDate: _todayDate(),
  toDate: _todayDate(),
};

const AgencyIncomeLanding = () => {
  const [gridData, setGridData] = useState([]);
  const [loading, setLoading] = useState(false);

  // get user data from store
  const {
    profileData: { accountId: accId },
    selectedBusinessUnit: { value: buId },
  } = useSelector((state) => state?.authData, shallowEqual);

  useEffect(() => {
    if (accId && buId) {
      // commonGridData( initData);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [accId, buId]);

  const commonGridData = (values) => {
    getASLLAgencyBill(
      values?.type?.value,
      buId,
      values?.fromDate,
      values?.toDate,
      setGridData,
      setLoading
    );
  };
  return (
    <>
      {loading && <Loading />}
      <Formik enableReinitialize={true} initialValues={initData}>
        {({ values, setFieldValue, touched, errors }) => (
          <>
            <ICustomCard title='Agency Income'>
              <div className='row global-form my-3'>
                <div className='col-lg-3'>
                  <NewSelect
                    isSearchable={true}
                    options={
                      [
                        {
                          value: 1,
                          label: "Own",
                        },
                        {
                          value: 2,
                          label: "PDA",
                        },
                      ] || []
                    }
                    name='type'
                    onChange={(valueOption) => {
                      setFieldValue("type", valueOption);
                    }}
                    placeholder='Type'
                    value={values?.type}
                    errors={errors}
                    touched={touched}
                  />
                </div>
                <div className='col-lg-3'>
                  <InputField
                    value={values?.fromDate}
                    label='From Date'
                    name='fromDate'
                    type='date'
                    onChange={(e) => {
                      setFieldValue("fromDate", e.target.value);
                      setGridData([]);
                    }}
                  />
                </div>

                <div className='col-lg-3'>
                  <InputField
                    value={values?.toDate}
                    label='To Date'
                    name='toDate'
                    type='date'
                    onChange={(e) => {
                      setFieldValue("toDate", e.target.value);
                      setGridData([]);
                    }}
                  />
                </div>
                <div className='col d-flex align-items-end justify-content-end'>
                  <button
                    className='btn btn-primary mt-3'
                    onClick={() => {
                      commonGridData(values);
                    }}
                    disabled={!values?.fromDate || !values?.toDate || !values?.type}
                  >
                    View
                  </button>
                </div>
              </div>

              <LandingTable
                obj={{
                  gridData,
                }}
              />
            </ICustomCard>
          </>
        )}
      </Formik>
    </>
  );
};

export default AgencyIncomeLanding;
