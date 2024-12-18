import { Form, Formik } from 'formik';
import React, { useState } from 'react';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';
import { shallowEqual, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import NewSelect from '../../../_helper/_select';
import PaginationTable from '../../../_helper/_tablePagination';
import IViewModal from '../../../_helper/_viewModal';
import useAxiosGet from '../../../_helper/customHooks/useAxiosGet';
import IForm from './../../../_helper/_form';
import Loading from './../../../_helper/_loading';
import RepayProvisionActionModal from './repayProvision';
const initData = {};
export default function InterCompanyLoan() {
  const { selectedBusinessUnit } = useSelector((state) => {
    return state.authData;
  }, shallowEqual);

  const [pageNo, setPageNo] = useState(1);
  const [pageSize, setPageSize] = useState(15);
  const [gridData, getGridData, loading] = useAxiosGet();
  const history = useHistory();
  const [showModal, setShowModal] = useState(false);
  const [singleData, setSingleData] = useState(null);
  const [actionType, setActionType] = useState('');

  const saveHandler = (values, cb) => {};

  const getLandingData = (values, pageNo, pageSize, searchValue = '') => {
    getGridData(
      `/fino/CommonFino/InterCompanyLoanLanding?businessUnitId=${selectedBusinessUnit?.value}&loanType=${values?.loanType?.type}&pageNo=${pageNo}&pageSize=${pageSize}`,
    );
  };

  const setPositionHandler = (pageNo, pageSize, values, searchValue = '') => {
    getLandingData(values, pageNo, pageSize, searchValue);
  };

  return (
    <Formik
      enableReinitialize={true}
      initialValues={{}}
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
            title="Inter Company Loan"
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
                        '/financial-management/banking/InterCompanyLoan/create',
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
              <div className="form-group  global-form row">
                <div className="col-lg-3">
                  <NewSelect
                    name="loanType"
                    options={[
                      { value: 1, label: 'Loan Issue', type: 'Issue' },
                      { value: 2, label: 'Loan Receive', type: 'Receive' },
                    ]}
                    value={values?.loanType}
                    label="Loan Type"
                    onChange={(valueOption) => {
                      setFieldValue('loanType', valueOption);
                    }}
                    errors={errors}
                    touched={touched}
                  />
                </div>

                <div className="col-lg-3">
                  <button
                    onClick={() => {
                      getLandingData(values, pageNo, pageSize, '');
                    }}
                    type="button"
                    className="btn btn-primary mt-5"
                  >
                    View
                  </button>
                </div>
              </div>
              {gridData?.data?.length > 0 && (
                <div className="table-responsive">
                  <table className="table table-striped mt-2 table-bordered bj-table bj-table-landing">
                    <thead>
                      <tr>
                        <th>SL</th>
                        <th>Issued Business Unit</th>
                        {/* <th>Received Business Unit</th> */}
                        <th>Investment Partner</th>
                        <th>Loan Type</th>
                        <th>Principle Amount</th>
                        <th>Interest Amount</th>
                        <th>Total Payable</th>
                        <th>Remaining Principle</th>
                        <th>Repay</th>
                      </tr>
                    </thead>
                    <tbody>
                      {gridData?.data?.map((item, index) => (
                        <tr key={index}>
                          <td>{index + 1}</td>
                          <td>{item?.businessUnitIdIssuedName}</td>
                          {/* <td>{item?.businessUnitIdReceivedName}</td> */}
                          <td>{item?.businessPartnerName}</td>
                          <td>{item?.loanType}</td>
                          <td className="text-right">
                            {item?.principleAmount}
                          </td>
                          <td className="text-right">{item?.interestAmount}</td>
                          <td className="text-right">{item?.totalPayable}</td>
                          <td className="text-right">
                            {item?.remainingPrinciple}
                          </td>

                          <td className="text-center">
                            <div className="">
                              <span
                                className=""
                                onClick={() => {
                                  setSingleData(item);
                                  history.push({
                                    pathname: `/financial-management/banking/InterCompanyLoan/view`,
                                    state: item,
                                  });
                                }}
                              >
                                <OverlayTrigger
                                  overlay={<Tooltip id="cs-icon">View</Tooltip>}
                                >
                                  <i
                                    style={{ fontSize: '16px' }}
                                    class="fa fa-eye cursor-pointer"
                                    aria-hidden="true"
                                  ></i>
                                </OverlayTrigger>
                              </span>
                              {item?.isRepayButton && (
                                <span
                                  className="px-5"
                                  onClick={() => {
                                    setSingleData(item);
                                    setActionType('Repay');
                                    setShowModal(true);
                                  }}
                                >
                                  <OverlayTrigger
                                    overlay={
                                      <Tooltip id="cs-icon">Repay</Tooltip>
                                    }
                                  >
                                    <i
                                      style={{ fontSize: '16px' }}
                                      class="fa fa-history cursor-pointer"
                                      aria-hidden="true"
                                    ></i>
                                  </OverlayTrigger>
                                </span>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {gridData?.data?.length > 0 && (
                <PaginationTable
                  count={gridData?.totalCount}
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
              {showModal && (
                <IViewModal
                  show={showModal}
                  onHide={() => {
                    setShowModal(false);
                    setSingleData(null);
                  }}
                  title={actionType}
                >
                  <RepayProvisionActionModal
                    singleData={singleData}
                    actionType={actionType}
                  />
                </IViewModal>
              )}
            </Form>
          </IForm>
        </>
      )}
    </Formik>
  );
}
