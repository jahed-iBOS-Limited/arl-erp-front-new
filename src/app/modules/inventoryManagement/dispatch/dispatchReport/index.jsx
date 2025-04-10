import { Form, Formik } from 'formik';
import React, { useEffect, useState } from 'react';
import InputField from '../../../_helper/_inputField';
import NewSelect from '../../../_helper/_select';
import IForm from './../../../_helper/_form';
import Loading from './../../../_helper/_loading';
import { _todayDate } from '../../../_helper/_todayDate';
import useAxiosGet from '../../../_helper/customHooks/useAxiosGet';
import { shallowEqual, useSelector } from 'react-redux';
import { _dateFormatter } from '../../../_helper/_dateFormate';
import PaginationSearch from '../../../_helper/_search';
import createDebounceHandler from '../../../_helper/debounceForSave';
const initData = {
  fromDate: _todayDate(),
  toDate: _todayDate(),
  status: '',
};
export default function DispatchReport() {
  const saveHandler = (values, cb) => {};
  const [gridData, getGridData, loader] = useAxiosGet();
  const [statusDDl, getStatus, , setStatusDDL] = useAxiosGet();
  const { profileData, selectedBusinessUnit } = useSelector((state) => {
    return state.authData;
  }, shallowEqual);
  const debounceHandler = createDebounceHandler(5000);
  const [isLoading, setLoading] = useState(false);

  const getLandingData = (values, searchTerm = '') => {
    const strStatus = values?.status?.label
      ? `&Status=${values?.status?.label}`
      : '';
    const strSearch = searchTerm ? `&Search=${searchTerm}` : '';

    getGridData(
      `/tms/DocumentDispatch/DispatchReport?AccountId=${profileData?.accountId}&BusinessUnitId=${selectedBusinessUnit?.value}&fromDate=${values?.fromDate}&toDate=${values?.toDate}${strStatus}${strSearch}`
    );
  };
  useEffect(() => {
    getStatus(
      `/tms/DocumentDispatch/GetDispatchStatusDDL?businessUnitId=${selectedBusinessUnit?.value}`,
      (data) => {
        const updatedStatus = data?.map((item, index) => {
          return {
            ...item,
            value: index + 1,
          };
        });
        setStatusDDL(updatedStatus);
      }
    );
  }, []);

  return (
    <Formik
      enableReinitialize={true}
      initialValues={{}}
      // validationSchema={{}}
      onSubmit={(values, { setSubmitting, resetForm }) => {
        setLoading(true);
        debounceHandler({
          setLoading: setLoading,
          CB: () => {
            saveHandler(values, () => {
              resetForm(initData);
            });
          },
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
          {(loader || isLoading) && <Loading />}
          <IForm
            title="Dispatch Report"
            isHiddenReset
            isHiddenBack
            isHiddenSave
          >
            <Form>
              <div>
                <div className="form-group  global-form row">
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
                  <div className="col-lg-3">
                    <NewSelect
                      name="status"
                      options={statusDDl || []}
                      value={values?.status}
                      label="Status"
                      onChange={(valueOption) => {
                        setFieldValue('status', valueOption);
                      }}
                      errors={errors}
                      touched={touched}
                    />
                  </div>
                  <div className="mt-5">
                    <button
                      onClick={() => {
                        getLandingData(values);
                      }}
                      type="button"
                      className="btn btn-primary"
                    >
                      View
                    </button>
                  </div>
                </div>
                <div className="mt-5">
                  {gridData?.length > 0 && (
                    <div className="my-3">
                      <PaginationSearch
                        placeholder="Search..."
                        paginationSearchHandler={(searchTerm, values) => {
                          getLandingData(values, searchTerm);
                        }}
                        values={values}
                      />
                    </div>
                  )}
                  <div className="table-responsive">
                    <table class="table table-striped table-bordered bj-table bj-table-landing">
                      <thead>
                        <tr>
                          <th>SL</th>
                          <th>Document Type</th>
                          <th>Document Code</th>
                          <th>From Location</th>
                          <th>To Location</th>
                          <th>Sender Name</th>
                          <th>Receiver Name</th>
                          <th>Requisition Date</th>
                          <th>Dispatch Send Date</th>
                          <th>Dispatch Receive Date</th>
                          <th>Owner Receive Date</th>
                          <th>Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {gridData?.map((item, index) => (
                          <tr key={index}>
                            <td>
                              <div className="text-center">{index + 1}</div>
                            </td>
                            <td>
                              <div className="pl-2">{item?.documentType}</div>
                            </td>
                            <td>
                              <div className="pl-2">{item?.documentCode}</div>
                            </td>

                            <td>
                              <div className="pl-2">{item?.fromLocation}</div>
                            </td>
                            <td>
                              <div className="pl-2">{item?.toLocation}</div>
                            </td>
                            <td>
                              <div className="pl-2">{item?.senderName}</div>
                            </td>
                            <td>
                              <div className="pl-2">{item?.receiverName}</div>
                            </td>
                            <td>
                              <div className="text-center">
                                {_dateFormatter(item?.requsitionDate)}
                              </div>
                            </td>
                            <td>
                              <div className="text-center">
                                {_dateFormatter(item?.dispatchSendDate)}
                              </div>
                            </td>
                            <td>
                              <div className="text-center">
                                {_dateFormatter(item?.dispatchReceiveDate)}
                              </div>
                            </td>
                            <td>
                              <div className="text-center">
                                {_dateFormatter(item?.ownerReceiveDate)}
                              </div>
                            </td>
                            <td>
                              <div className="pl-2">
                                <span className="text-bold">
                                  {item?.status}
                                </span>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </Form>
          </IForm>
        </>
      )}
    </Formik>
  );
}
