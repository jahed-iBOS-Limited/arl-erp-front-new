import React, { useEffect, useState } from 'react';
// import { useHistory } from "react-router-dom";
import { Formik } from 'formik';
import { Form, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { shallowEqual, useSelector } from 'react-redux';
import { useHistory } from 'react-router';
import IConfirmModal from '../../../../_helper/_confirmModal';
import { _dateFormatter } from '../../../../_helper/_dateFormate';
import Loading from '../../../../_helper/_loading';
import PaginationTable from '../../../../_helper/_tablePagination';
import { getPurchaseReqGridData } from './helper';
// import { setPRApprovalId } from "../../../../_helper/reduxForLocalStorage/Actions";
import IView from '../../../../_helper/_helperIcons/_view';
import IViewModal from '../../../../_helper/_viewModal';
import useAxiosPost from '../../../../_helper/customHooks/useAxiosPost';
import PaginationSearch from './../../../../_helper/_search';
import { approvalApi } from './helper';
import { ApprovalModal } from './viewModal';

let initData = {};

const RequestForQuotationApprovalGrid = ({
  onChangeForActivity,
  activityName,
  activityChange,
  selectedPlant,
}) => {
  const history = useHistory();

  const [loader, setLoader] = useState(false);
  const [pageNo, setPageNo] = React.useState(0);
  const [pageSize, setPageSize] = React.useState(15);
  const [rowDto, setRowDto] = useState([]);
  const [, setBillSubmitBtn] = useState(true);
  const [, rejectPuchase, rejectPuchaseLoading] = useAxiosPost();
  // const dispatch = useDispatch();

  const profileData = useSelector((state) => {
    return state.authData.profileData;
  }, shallowEqual);

  // get selected business unit from store
  const selectedBusinessUnit = useSelector((state) => {
    return state.authData.selectedBusinessUnit;
  }, shallowEqual);

  useEffect(() => {
    cb();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activityChange]);

  let cb = () => {
    setIsShowModal(false);
    getPurchaseReqGridData(
      activityName?.value,
      profileData?.accountId,
      selectedBusinessUnit?.value,
      profileData?.userId,
      setRowDto,
      setLoader,
      pageNo,
      pageSize,
      '',
      selectedPlant?.value,
    );
  };

  //setPositionHandler
  const setPositionHandler = (pageNo, pageSize) => {
    getPurchaseReqGridData(
      activityName?.value,
      profileData?.accountId,
      selectedBusinessUnit?.value,
      profileData?.userId,
      setRowDto,
      setLoader,
      pageNo,
      pageSize,
      '',
      selectedPlant.value,
    );
  };

  // approveSubmitlHandler btn submit handler
  const approveSubmitlHandler = ({ currentRowData, data }) => {
    console.log('dd', data);
    let confirmObject = {
      title: 'Are you sure?',
      message: `Do you want to post the selected approve submit`,
      yesAlertFunc: () => {
        const filterSelectedData = data?.filter((item) => item?.isSelect);

        const payload = [
          {
            approvalId: currentRowData?.approvalId,
            reffId: currentRowData?.transectionId,
            quantity: currentRowData?.quantity,
            supplierId: filterSelectedData?.[0]?.businessPartnerId || 0,
            isApprove: true,
          },
        ];

        let parameter = {
          accid: profileData?.accountId,
          buId: selectedBusinessUnit?.value,
          userId: profileData?.userId,
          activityId: activityName?.value,
        };
        approvalApi(parameter, payload, activityName, cb, setBillSubmitBtn);
        //setBillSubmitBtn(true);
      },
      noAlertFunc: () => {},
    };
    IConfirmModal(confirmObject);
  };

  //reject handler
  const rejectSubmitlHandler = ({ currentRowData, data }) => {
    let confirmObject = {
      title: 'Are you sure?',
      message: `Do you want to reject the selected CS?`,
      yesAlertFunc: () => {
        const filterSelectedData = data?.filter((item) => item?.isSelect);

        const payload = [
          {
            transactionId: currentRowData?.transectionId,
            supplierId: filterSelectedData?.[0]?.businessPartnerId || 0,
            actionBy: profileData?.userId,
          },
        ];
        rejectPuchase(
          `/procurement/RequestForQuotation/RejectRequestForQuotation`,
          payload,
          (data) => {
            setBillSubmitBtn(true);
            cb();
          },
          true,
        );
        // setBillSubmitBtn(true);
      },
      noAlertFunc: () => {},
    };
    IConfirmModal(confirmObject);
  };

  const paginationSearchHandler = (value) => {
    getPurchaseReqGridData(
      activityName?.value,
      profileData?.accountId,
      selectedBusinessUnit?.value,
      profileData?.userId,
      setRowDto,
      setLoader,
      0,
      pageSize,
      value,
      selectedPlant.value,
    );
    setPageNo(0);
  };

  const [isShowModal, setIsShowModal] = useState(false);
  const [currentRowData, setCurrentRowData] = useState('');

  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={{
          ...initData,
          applicationType: { value: 1, label: 'Pending Application' },
        }}
        // validationSchema={validationSchema}
        onSubmit={(values, { setSubmitting, resetForm }) => {
          resetForm(initData);
        }}
      >
        {({
          handleSubmit,
          resetForm,
          values,
          errors,
          touched,
          setFieldValue,
          setValues,
          isValid,
        }) => (
          <>
            {(loader || rejectPuchaseLoading) && <Loading />}
            {/* Table Start */}
            <Form className="form form-label-right">
              <div>
                <PaginationSearch
                  placeholder="Request For Quotation Code Search"
                  paginationSearchHandler={paginationSearchHandler}
                  values={values}
                />
              </div>
            </Form>
            {rowDto?.data?.length ? (
              <div className="table-responsive">
                <table className="table table-striped table-bordered global-table">
                  <thead>
                    <tr>
                      <th>SL</th>
                      <th>Reff Code</th>
                      <th>Warehouse Name</th>
                      <th>Transaction Date</th>
                      {/* <th>Due Date</th> */}
                      <th>Quantity</th>
                      <th>Description</th>
                      <th>CS Details</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rowDto?.data?.map((item, i) => (
                      <tr>
                        <td className="text-center">{item?.sl}</td>
                        <td>
                          <span className="pl-2">{item.strCode}</span>
                        </td>
                        <td>
                          <span className="pl-2">{item.whName}</span>
                        </td>
                        <td className="text-center">
                          {_dateFormatter(item.transectionDate)}
                        </td>

                        <td className="text-center">{item.quantity}</td>
                        <td className="text-center">{item.strNarration}</td>
                        <td className="text-center">
                          {
                            <IView
                              title="CS Details"
                              clickHandler={() =>
                                history.push({
                                  pathname: `/personal/approval/request-for-quotation/${item?.transectionId}`,
                                  state: { ...item },
                                })
                              }
                            />
                          }
                        </td>
                        <td className="text-center">
                          <span
                            onClick={(e) => {
                              setCurrentRowData(item);
                              setIsShowModal(true);
                            }}
                          >
                            <OverlayTrigger
                              overlay={<Tooltip id="cs-icon">{'View'}</Tooltip>}
                            >
                              <span style={{ cursor: 'pointer' }}>
                                <i
                                  className={`fas fa-eye`}
                                  aria-hidden="true"
                                ></i>
                              </span>
                            </OverlayTrigger>
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              ''
            )}
            {rowDto?.data?.length > 0 && (
              <PaginationTable
                count={rowDto?.totalCount}
                setPositionHandler={setPositionHandler}
                paginationState={{
                  pageNo,
                  setPageNo,
                  pageSize,
                  setPageSize,
                }}
              />
            )}

            <IViewModal show={isShowModal} onHide={() => setIsShowModal(false)}>
              <ApprovalModal
                currentRowData={currentRowData}
                approveSubmitlHandler={approveSubmitlHandler}
                rejectSubmitlHandler={rejectSubmitlHandler}
              />
            </IViewModal>
          </>
        )}
      </Formik>
    </>
  );
};

export default RequestForQuotationApprovalGrid;
