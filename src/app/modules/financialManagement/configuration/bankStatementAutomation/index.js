import { Form, Formik } from "formik";
import React, { useState } from "react";
import { shallowEqual, useSelector } from "react-redux";
import {
  Card,
  CardBody,
  CardHeader,
  ModalProgressBar,
} from "../../../../../_metronic/_partials/controls";
import Loading from "../../../_helper/_loading";
import { _todayDate } from "../../../_helper/_todayDate";
import InputField from "../../../_helper/_inputField";
import PaginationTable from "../../../_helper/_tablePagination";
import { getBankStatmentAttachmentLanding } from "./helper";
import IEdit from "../../../_helper/_helperIcons/_edit";
import moment from "moment";
import IViewModal from "../../../_helper/_viewModal";
import EditForm from "./editForm";

const initData = {
  fromDate: _todayDate(),
  toDate: _todayDate(),
};

const BankStatementAutomation = () => {
  const [loading, setLoading] = useState(false);
  const [gridData, setGridData] = useState([]);
  const [pageNo, setPageNo] = useState(0);
  const [pageSize, setPageSize] = useState(15);
  const [isEditModal, setIsEditModal] = useState(false);
  const [rowClickItem, setRowClickItem] = useState({});

  const { profileData, selectedBusinessUnit } = useSelector((state) => {
    return state.authData;
  }, shallowEqual);

  const getGridData = (values, pageNo, pageSize) => {
    getBankStatmentAttachmentLanding(
      profileData?.accountId,
      selectedBusinessUnit?.value,
      values?.fromDate,
      values?.toDate,
      pageNo,
      pageSize,
      setGridData,
      setLoading
    );
  };

  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={initData}
        // validationSchema={{}}
        onSubmit={(values) => {}}
      >
        {({
          handleSubmit,
          resetForm,
          values,
          errors,
          touched,
          setFieldValue,
          isValid,
        }) => (
          <div>
            {loading && <Loading />}
            <Card>
              {true && <ModalProgressBar />}
              <CardHeader title='Bank Statement Automation'></CardHeader>
              <CardBody>
                <Form className='form form-label-right'>
                  <div className='form-group row global-form'>
                    <div className='col-lg-3'>
                      <label>From Date</label>
                      <InputField
                        value={values?.fromDate}
                        name='fromDate'
                        placeholder='From Date'
                        type='date'
                        onChange={(e) => {
                          setFieldValue("fromDate", e.target.value);
                        }}
                      />
                    </div>
                    <div className='col-lg-3'>
                      <label>To Date</label>
                      <InputField
                        value={values?.toDate}
                        name='toDate'
                        placeholder='To Date'
                        type='date'
                        onChange={(e) => {
                          setFieldValue("toDate", e.target.value);
                        }}
                      />
                    </div>
                    <div className='col-lg-3 d-flex justify-content-start align-items-center mt-3'>
                      <button
                        type='button'
                        onClick={() => getGridData(values, pageNo, pageSize)}
                        className='btn btn-primary mt-3'
                        disabled={!values?.fromDate || !values?.toDate}
                      >
                        View
                      </button>
                    </div>
                  </div>
                  <div className='col-lg-12'>
                    <div className='table-responsive'>
                      <table className='table table-striped table-bordered global-table'>
                        <thead>
                          <tr>
                            <th>SL</th>
                            <th>Bank Name</th>
                            <th>Account No</th>
                            <th>File Name</th>
                            <th>Email Sender</th>
                            <th>Email Header</th>
                            <th>Email DateTime</th>
                            <th>Status Message</th>
                            <th>Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {gridData?.data?.length > 0 &&
                            gridData?.data?.map((item, i) => (
                              <tr key={i + 1}>
                                <td className='text-center'>{i + 1}</td>
                                <td className='text-left'>{item?.accountNo}</td>
                                <td className='text-left'>{item?.bankName}</td>
                                <td className='text-left'>{item?.fileName}</td>
                                <td className='text-left'>
                                  {" "}
                                  {item?.senderAddress}
                                </td>
                                <td className='text-left'>
                                  {item?.emailHeader}
                                </td>
                                <td className='text-left'>
                                  {moment(item?.emailDateTime).format(
                                    "DD/MM/YYYY"
                                  )}
                                </td>
                                <td className='text-left'>
                                  {item?.statusMessage}
                                </td>
                                <td className='text-center'>
                                  <span
                                    onClick={() => {
                                      setIsEditModal(true);
                                      setRowClickItem(item);
                                    }}
                                  >
                                    <IEdit />
                                  </span>
                                </td>
                              </tr>
                            ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                  {getGridData?.data?.length > 0 && (
                    <PaginationTable
                      count={getGridData?.totalCount}
                      setPositionHandler={(pageNo, pageSize) => {
                        getGridData(values, pageNo, pageSize);
                      }}
                      paginationState={{
                        pageNo,
                        setPageNo,
                        pageSize,
                        setPageSize,
                      }}
                      values={values}
                    />
                  )}

                  {isEditModal && (
                    <IViewModal
                      show={isEditModal}
                      onHide={() => setIsEditModal(false)}
                      title=''
                    >
                      <EditForm rowClickItem={rowClickItem} />
                    </IViewModal>
                  )}
                </Form>
              </CardBody>
            </Card>
          </div>
        )}
      </Formik>
    </>
  );
};

export default BankStatementAutomation;
