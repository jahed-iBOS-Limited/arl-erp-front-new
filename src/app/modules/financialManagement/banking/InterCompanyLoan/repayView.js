import { Form, Formik } from 'formik';
import React, { useEffect, useState } from 'react';
import { shallowEqual, useSelector } from 'react-redux';
import { useLocation } from 'react-router';
import { _dateFormatter } from '../../../_helper/_dateFormate';
import { _todayDate } from '../../../_helper/_todayDate';
import useAxiosGet from '../../../_helper/customHooks/useAxiosGet';
import useAxiosPost from '../../../_helper/customHooks/useAxiosPost';
import IForm from './../../../_helper/_form';
import Loading from './../../../_helper/_loading';

const initData = {
  transactionDate: _todayDate(),
  amount: '',
};

export default function RepayViewModal() {
  const [objProps, setObjprops] = useState({});

  const { profileData } = useSelector((state) => {
    return state.authData;
  }, shallowEqual);
  const [rowData, getRowData, loader] = useAxiosGet();
  const [, onSavePost] = useAxiosPost();

  const location = useLocation();

  useEffect(() => {
    getData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location]);

  const saveHandler = (values, cb) => {};

  const getData = () => {
    getRowData(
      `/fino/CommonFino/InterCompanyLoanGetById?loanId=${location.state?.loanId}&type=repay&viewByBusinessUnitId=${location?.state?.viewByBusinessUnitId}`,
    );
  };

  return (
    <Formik
      enableReinitialize={true}
      initialValues={initData}
      //   validationSchema={validationSchema}
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
          {loader && <Loading />}
          <IForm
            title="Repay View"
            getProps={setObjprops}
            isHiddenReset={true}
            isHiddenSave={true}
          >
            <Form>
              <div>
                {rowData?.length > 0 && (
                  <div className="table-responsive">
                    <table className="table table-striped mt-2 table-bordered bj-table bj-table-landing">
                      <thead>
                        <tr>
                          <th>SL</th>
                          <th>Transaction Date</th>
                          <th>Interest Amount</th>
                          <th>Amount</th>
                          <th>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {rowData.map((item, index) => (
                          <tr key={index}>
                            <td>{index + 1}</td>
                            <td className="text-center">
                              {_dateFormatter(item?.transactionDate)}
                            </td>
                            <td className="text-right">
                              {item?.interestAmount}
                            </td>
                            <td className="text-right">{item?.amount}</td>
                            <td className="text-center">
                              {item?.isActionButton && (
                                <button
                                  type="button"
                                  className="btn btn-primary"
                                  onClick={() => {
                                    onSavePost(
                                      `/fino/CommonFino/InterCompanyLoanBankJournal`,
                                      {
                                        loanId: item?.loanId,
                                        rowId: item?.rowId,
                                        createdBy: profileData?.userId,
                                      },
                                      () => {
                                        getData();
                                      },
                                      true,
                                    );
                                  }}
                                >
                                  Post
                                </button>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>

              <button
                type="submit"
                style={{ display: 'none' }}
                ref={objProps?.btnRef}
                onSubmit={() => handleSubmit()}
              ></button>

              <button
                type="reset"
                style={{ display: 'none' }}
                ref={objProps?.resetBtnRef}
                onSubmit={() => resetForm(initData)}
              ></button>
            </Form>
          </IForm>
        </>
      )}
    </Formik>
  );
}
