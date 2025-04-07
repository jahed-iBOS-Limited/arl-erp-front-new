import { Form, Formik } from 'formik';
import React, { useEffect, useState } from 'react';
import { shallowEqual, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import IForm from '../../../_helper/_form';
import InputField from '../../../_helper/_inputField';
import Loading from '../../../_helper/_loading';
import PaginationSearch from '../../../_helper/_search';
import NewSelect from '../../../_helper/_select';
import PaginationTable from '../../../_helper/_tablePagination';
import { _firstDateOfMonth, _todayDate } from '../../../_helper/_todayDate';
import IViewModal from '../../../_helper/_viewModal';
import useAxiosGet from '../../../_helper/customHooks/useAxiosGet';
import ConfidentialAuditForm from './confidentialAuditForm';
import AuditScheduleLandingTable from './landingTable';

const initData = {
  businessUnit: '',
  fromDate: _firstDateOfMonth(),
  toDate: _todayDate(),
};
export default function AuditSchedules() {
  // redux selector
  const { businessUnitList } = useSelector((state) => {
    return state.authData;
  }, shallowEqual);

  // state
  const [pageNo, setPageNo] = useState(0);
  const [pageSize, setPageSize] = useState(15);
  const [showConfidentialModal, setShowConfidentialModal] = useState(false);
  const [singleAuditData, setSingleAuditData] = useState({});

  // axios get
  const [gridData, getGridData, loading] = useAxiosGet();

  useEffect(() => {}, []);
  const saveHandler = (values, cb) => {};
  const history = useHistory();

  // get audit landing data
  const getLandingData = (values, pageNo, pageSize, searchValue = '') => {
    const strBusinessUnit = values?.businessUnit
      ? `&BusinessUnitId=${values?.businessUnit?.value}`
      : '';
    const strDate =
      values?.fromDate && values?.toDate
        ? `&FromDate=${values?.fromDate}&ToDate=${values?.toDate}`
        : '';
    getGridData(
      `/fino/Audit/GetAuditEngagementSchedules?pageNumber=${pageNo}&pageSize=${pageSize}${strDate}${strBusinessUnit}`
    );
  };

  // landing data position handler
  const setPositionHandler = (pageNo, pageSize, values, searchValue = '') => {
    getLandingData(values, pageNo, pageSize, searchValue);
  };

  // pagination seach
  const paginationSearchHandler = (searchValue, values) => {
    setPositionHandler(pageNo, pageSize, values, searchValue);
  };

  //
  return (
    <Formik
      enableReinitialize={true}
      initialValues={initData}
      // validationSchema={{}}
      onSubmit={(values, { setSubmitting, resetForm }) => {
        saveHandler(values, () => {
          resetForm(initData);
        });
      }}
    >
      {({
        handleSubmit,
        resetForm,
        values,
        setFieldValue,
        isValid,
        errors,
        touched,
      }) => (
        <>
          {loading && <Loading />}
          <IForm
            title="Audit Schedules"
            isHiddenReset
            isHiddenBack
            isHiddenSave
            renderProps={() => {
              return (
                <div>
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={() => {
                      history.push(
                        '/internal-control/internalaudits/auditschedules/entry'
                      );
                    }}
                  >
                    Create
                  </button>
                </div>
              );
            }}
          >
            <Form>
              <>
                <div className="form-group  global-form row">
                  <div className="col-lg-3">
                    <NewSelect
                      name="businessUnit"
                      options={businessUnitList}
                      value={values?.businessUnit}
                      label="Business Unit"
                      onChange={(valueOption) => {
                        setFieldValue('businessUnit', valueOption);
                      }}
                    />
                  </div>
                  <div className="col-lg-3">
                    <InputField
                      value={values?.fromDate}
                      label="From Date"
                      name="fromDate"
                      type="date"
                      onChange={(e) => {
                        setFieldValue('fromDate', e.target.value);
                      }}
                    />
                  </div>
                  <div className="col-lg-3">
                    <InputField
                      value={values?.toDate}
                      label="To Date"
                      name="toDate"
                      type="date"
                      onChange={(e) => {
                        setFieldValue('toDate', e.target.value);
                      }}
                    />
                  </div>
                  <div>
                    <button
                      disabled={
                        !values?.fromDate ||
                        !values?.toDate ||
                        !values?.businessUnit
                      }
                      onClick={() => {
                        getLandingData(values, pageNo, pageSize, '');
                      }}
                      className="btn btn-primary mt-4"
                    >
                      Show
                    </button>
                  </div>
                </div>
                {gridData?.itemList?.length > 0 && (
                  <div className="my-3">
                    <PaginationSearch
                      placeholder="Search Enroll & Name"
                      paginationSearchHandler={paginationSearchHandler}
                      values={values}
                    />
                  </div>
                )}
                {gridData?.length > 0 && (
                  <AuditScheduleLandingTable
                    objProps={{
                      gridData,
                      setShowConfidentialModal,
                      setSingleAuditData,
                    }}
                  />
                )}

                {gridData?.length > 0 && (
                  <PaginationTable
                    count={getGridData?.length}
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

                {/* Confidential Audit Modal Form */}
                <IViewModal
                  show={showConfidentialModal}
                  onHide={() => {
                    setShowConfidentialModal(false);
                    setSingleAuditData({});
                  }}
                >
                  <ConfidentialAuditForm
                    objProps={{
                      singleAuditData,
                      setSingleAuditData,
                    }}
                  />
                </IViewModal>
              </>
            </Form>
          </IForm>
        </>
      )}
    </Formik>
  );
}
