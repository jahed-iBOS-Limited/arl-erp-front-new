import { Formik } from 'formik';
import React, { useEffect, useState } from 'react';
import { Form } from 'react-bootstrap';
import { shallowEqual, useSelector } from 'react-redux';
import { approvalApi, getItemGridData } from '../../../../_helper/_commonApi';
import IConfirmModal from '../../../../_helper/_confirmModal';
import IView from '../../../../_helper/_helperIcons/_view';
import Loading from '../../../../_helper/_loading';
import PaginationTable from '../../../../_helper/_tablePagination';
import IViewModal from '../../../../_helper/_viewModal';
import useAxiosPost from '../../../../_helper/customHooks/useAxiosPost';
import PaginationSearch from './../../../../_helper/_search';
import DelearsBenefotsViewModal from './viewModal';

let initData = {};

const DealersBenefits = ({
  onChangeForActivity,
  activityName,
  activityChange,
  selectedPlant,
}) => {

  const [loader, setLoader] = useState(false);
  const [pageNo, setPageNo] = React.useState(0);
  const [pageSize, setPageSize] = React.useState(15);
  const [rowDto, setRowDto] = useState([]);
  const [billSubmitBtn, setBillSubmitBtn] = useState(true);
  const [, rejectPuchase, rejectPuchaseLoading] = useAxiosPost();

  const { profileData, selectedBusinessUnit } = useSelector((state) => {
    return state.authData;
  }, shallowEqual);

  useEffect(() => {
    cb();
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
      selectedPlant?.value,
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
      selectedPlant.value,
    );
  };

  // one item select
  const itemSlectedHandler = (value, index) => {
    if (rowDto?.data?.length > 0) {
      let newRowDto = rowDto?.data;
      newRowDto[index].isSelect = value;
      setRowDto({
        ...rowDto,
        data: newRowDto,
      });
      // btn hide conditon
      const bllSubmitBtn = newRowDto?.some((itm) => itm.isSelect === true);
      if (bllSubmitBtn) {
        setBillSubmitBtn(false);
      } else {
        setBillSubmitBtn(true);
      }
    }
  };

  // All item select
  const allGridCheck = (value) => {
    if (rowDto?.data?.length > 0) {
      const modifyGridData = rowDto?.data?.map((itm) => ({
        ...itm,
        isSelect: value,
      }));
      setRowDto({
        ...rowDto,
        data: modifyGridData,
      });
      // btn hide conditon
      const bllSubmitBtn = modifyGridData?.some((itm) => itm.isSelect === true);
      if (bllSubmitBtn) {
        setBillSubmitBtn(false);
      } else {
        setBillSubmitBtn(true);
      }
    }
  };

  // approveSubmitlHandler btn submit handler
  const approveSubmitlHandler = (values) => {
    let confirmObject = {
      title: 'Are you sure?',
      message: `Do you want to post the selected approve submit`,
      yesAlertFunc: () => {
        const filterSelectedData = rowDto?.data?.filter(
          (item) => item?.isSelect,
        );
        const payload = filterSelectedData?.map((item) => {
          return {
            approvalId: item?.approvalId,
            reffId: item?.intDealerRegistrationId,
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
      noAlertFunc: () => { },
    };
    IConfirmModal(confirmObject);
  };


  //reject handler
  const rejectSubmitlHandler = () => {
    let confirmObject = {
      title: 'Are you sure?',
      message: `Do you want to reject ?`,
      yesAlertFunc: () => {
        const filterSelectedData = rowDto?.data?.filter(
          (item) => item?.isSelect,
        );
        const payload = filterSelectedData.map((item) => {
          return {
            dealerRegistrationId: item?.intDealerRegistrationId,
            actionBy: profileData?.userId,
          };
        });
        rejectPuchase(`/partner/PartnerBenefitPolicy/RejectPartnerBenefit`, payload, (data) => {
          setBillSubmitBtn(true);
          cb();
        }, true);
        // setBillSubmitBtn(true);
      },
      noAlertFunc: () => { },
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
              <div className="row">
                <div className="col-lg-12">
                  <div className="global-form">
                    <div className="row d-flex justify-content-between align-items-center">
                      <div className="col-lg-9">
                        <h1>Dealer's Benefits</h1>
                      </div>
                      <div className="col-lg-3">
                        <div className="d-flex justify-content-end ">
                          <button
                            type="button"
                            className="approvalButton btn btn-primary"
                            onClick={() => approveSubmitlHandler()}
                            disabled={billSubmitBtn}
                          >
                            Approve
                          </button>
                          <button
                            type="button"
                            className="approvalButton btn btn-primary mr-1 ml-3"
                            onClick={() => rejectSubmitlHandler()}
                            disabled={billSubmitBtn}
                          >
                            Reject
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div>
                <PaginationSearch
                  placeholder="Search..."
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
                            allGridCheck(event.target.checked);
                          }}
                        />
                      </th>
                      <th>SL</th>
                      <th>Dealer Business Name</th>
                      <th>Dealer Address</th>
                      <th>Dealer Owner Name</th>
                      <th>Mobile No</th>
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
                              itemSlectedHandler(e.target.checked, i);
                            }}
                          />
                        </td>
                        <td className="text-center">{i + 1}</td>
                        <td>{item?.strDealerBusinessName}</td>
                        <td>{item?.strDealerAddress}</td>
                        <td>{item?.strDealerOwnerName}</td>
                        <td>{item?.strMobileNo}</td>
                        <td className="text-center">
                          <span
                            onClick={(e) => {
                              setCurrentRowData(item);
                              setIsShowModal(true);
                            }}
                          >
                            <IView />
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
              <DelearsBenefotsViewModal intDealerRegistrationId={currentRowData?.intDealerRegistrationId} />
            </IViewModal>
          </>
        )}
      </Formik>
    </>
  );
};

export default DealersBenefits;
