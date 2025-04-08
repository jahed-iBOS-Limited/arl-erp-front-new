import React, { useEffect, useState } from 'react';
// import { useHistory } from "react-router-dom";
import { Formik } from 'formik';
import { Form, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { shallowEqual, useSelector } from 'react-redux';
import IConfirmModal from '../../../../_helper/_confirmModal';
import { _dateFormatter } from '../../../../_helper/_dateFormate';
import Loading from '../../../../_helper/_loading';
import PaginationTable from '../../../../_helper/_tablePagination';
import IViewModal from '../../../../_helper/_viewModal';
import useAxiosPost from '../../../../_helper/customHooks/useAxiosPost';
import { ItemReqViewTableRow } from '../../../../procurement/purchase-management/purchaseRequestNew/report/tableRow';
import PaginationSearch from './../../../../_helper/_search';
import { approvalApi, getItemGridData } from '../../../../_helper/_commonApi';
import ApproveAndRejectBtn from '../../../../_helper/commonComponent/approveAndRejectBtn';
import { allGridCheck, itemSlectedHandler } from '../helper';

let initData = {};

const PurchaseRequestApprovalGrid = ({
  onChangeForActivity,
  activityName,
  activityChange,
  selectedPlant,
}) => {
  // const history = useHistory();

  const [loader, setLoader] = useState(false);
  const [pageNo, setPageNo] = React.useState(0);
  const [pageSize, setPageSize] = React.useState(15);
  const [rowDto, setRowDto] = useState([]);
  const [billSubmitBtn, setBillSubmitBtn] = useState(true);
  const [, rejectPuchase, rejectPuchaseLoading] = useAxiosPost();
  // const dispatch = useDispatch();

  const profileData = useSelector((state) => {
    return state.authData.profileData;
  }, shallowEqual);

  // get selected business unit from store
  const selectedBusinessUnit = useSelector((state) => {
    return state.authData.selectedBusinessUnit;
  }, shallowEqual);

  const LastPrApprovalId = useSelector((state) => {
    return state.localStorage.LastPrApprovalId;
  });

  useEffect(() => {
    cb();
  }, [activityChange]);

  let cb = () => {
    getItemGridData(
      activityName?.value,
      profileData?.accountId,
      selectedBusinessUnit?.value,
      profileData?.userId,
      setRowDto,
      setLoader,
      pageNo,
      pageSize,
      '',
      selectedPlant?.value
    );
  };

  //setPositionHandler
  const setPositionHandler = (pageNo, pageSize) => {
    getItemGridData(
      activityName?.value,
      profileData?.accountId,
      selectedBusinessUnit?.value,
      profileData?.userId,
      setRowDto,
      setLoader,
      pageNo,
      pageSize,
      '',
      selectedPlant.value
    );
  };

  // approveSubmitlHandler btn submit handler
  const approveSubmitlHandler = (values) => {
    let confirmObject = {
      title: 'Are you sure?',
      message: `Do you want to post the selected approve submit`,
      yesAlertFunc: () => {
        const filterSelectedData = rowDto?.data?.filter(
          (item) => item?.isSelect
        );
        const payload = filterSelectedData?.map((item) => {
          return {
            approvalId: item?.approvalId,
            reffId: item?.transectionId,
            quantity: item?.quantity,
            isApprove: true,
          };
        });

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
  const rejectSubmitlHandler = () => {
    let confirmObject = {
      title: 'Are you sure?',
      message: `Do you want to reject the selected PR?`,
      yesAlertFunc: () => {
        const filterSelectedData = rowDto?.data?.filter(
          (item) => item?.isSelect
        );
        const payload = filterSelectedData.map((item) => {
          return {
            purchaseRequestId: item?.transectionId,
            actionBy: profileData?.userId,
          };
        });
        rejectPuchase(
          `/procurement/PurchaseRequest/RejectPurchaseRequest`,
          payload,
          (data) => {
            setBillSubmitBtn(true);
            cb();
          },
          true
        );
        // setBillSubmitBtn(true);
      },
      noAlertFunc: () => {},
    };
    IConfirmModal(confirmObject);
  };

  const paginationSearchHandler = (value) => {
    getItemGridData(
      activityName?.value,
      profileData?.accountId,
      selectedBusinessUnit?.value,
      profileData?.userId,
      setRowDto,
      setLoader,
      0,
      pageSize,
      value,
      selectedPlant.value
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
        }}
        onSubmit={(values, { setSubmitting, resetForm }) => {
          resetForm(initData);
        }}
      >
        {({ values }) => (
          <>
            {(loader || rejectPuchaseLoading) && <Loading />}
            {/* Table Start */}
            <Form className="form form-label-right">
              <div className="row">
                <div className="col-lg-12">
                  <div className="global-form">
                    <div className="row d-flex justify-content-between align-items-center">
                      <div className="col-lg-9">
                        <h1>Purchase Request</h1>
                      </div>
                      <ApproveAndRejectBtn
                        billSubmitBtn={billSubmitBtn}
                        approveSubmitlHandler={approveSubmitlHandler}
                        setBillSubmitBtn={setBillSubmitBtn}
                        rejectPuchaseLoading={rejectPuchaseLoading}
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div>
                <PaginationSearch
                  placeholder="Purchase Request Code Search"
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
                      <th style={{ width: '20px' }}>
                        <input
                          type="checkbox"
                          id="parent"
                          onChange={(event) => {
                            allGridCheck(
                              event.target.checked,
                              rowDto,
                              setRowDto,
                              setBillSubmitBtn
                            );
                          }}
                        />
                      </th>
                      <th>SL</th>
                      <th>Reff Code</th>
                      <th>Warehouse Name</th>
                      <th>Transaction Date</th>
                      {/* <th>Due Date</th> */}
                      <th>Quantity</th>
                      <th>Description</th>
                      <th className="text-right pr-3">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rowDto?.data?.map((item, i) => (
                      <tr>
                        <td>
                          <input
                            id="isSelect"
                            type="checkbox"
                            value={item?.isSelect}
                            checked={item?.isSelect}
                            onChange={(e) => {
                              itemSlectedHandler(
                                e.target.checked,
                                i,
                                rowDto,
                                setRowDto,
                                setBillSubmitBtn
                              );
                            }}
                          />
                        </td>
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
                                  className={`fas fa-eye ${
                                    LastPrApprovalId === item?.transectionId
                                      ? 'text-primary'
                                      : ''
                                  }`}
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
                paginationState={{ pageNo, setPageNo, pageSize, setPageSize }}
              />
            )}

            <IViewModal show={isShowModal} onHide={() => setIsShowModal(false)}>
              <ItemReqViewTableRow prId={currentRowData?.transectionId} />
            </IViewModal>
          </>
        )}
      </Formik>
    </>
  );
};

export default PurchaseRequestApprovalGrid;
