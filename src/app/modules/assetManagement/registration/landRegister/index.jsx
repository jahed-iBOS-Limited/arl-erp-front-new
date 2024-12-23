import { Form, Formik } from 'formik';
import React, { useEffect, useState } from 'react';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';

import { OverlayTrigger, Tooltip } from 'react-bootstrap';
import { _dateFormatter } from '../../../_helper/_dateFormate';
import IForm from '../../../_helper/_form';
import IEdit from '../../../_helper/_helperIcons/_edit';
import Loading from '../../../_helper/_loading';
import { getDownlloadFileView_Action } from '../../../_helper/_redux/Actions';
import PaginationTable from '../../../_helper/_tablePagination';
import IViewModal from '../../../_helper/_viewModal';
import useAxiosGet from '../../../_helper/customHooks/useAxiosGet';
import useAxiosPost from '../../../_helper/customHooks/useAxiosPost';
import './styles.css';
import UpdateMutation from './UpdateMutation';

const initData = {
  businessUnit: '',
  territory: '',
  thana: '',
  deedNo: '',
  deedAmount: '',
  deedType: '',
  registrationDate: '',
  landQuantity: '',
  seller: '',
  csKhatian: '',
  csPlot: '',
  saKhatian: '',
  cityJaripKhatian: '',
  saPlot: '',
  rsPlot: '',
  rsKhatian: '',
  rsLandQuantity: '',
  mouza: '',
  cityJaripPlot: '',
  cityJaripPlotLand: '',
  subRegister: '',
  registrationCost: '',
  brokerAmount: '',
};
export default function LandRegister() {
  const {
    selectedBusinessUnit: { value: buId },
  } = useSelector((state) => {
    return state.authData;
  }, shallowEqual);
  const history = useHistory();
  const dispatch = useDispatch();
  const [isShowUpdateModal, setIsShowUpdateModal] = useState(false);
  const [, , loader] = useAxiosPost();
  const [pageNo, setPageNo] = useState(0);
  const [pageSize, setPageSize] = useState(15);
  const [gridData, getGridData, ,] = useAxiosGet();
  const [singleData, setSingleData] = useState(null);

  const getLandingData = (values, pageNo, pageSize, searchValue = '') => {
    getGridData(
      `/asset/AGLandMange/GetTrxGeneralLandingPagination?BusinessUnit=${buId}&PageNo=${pageNo ||
        1}&PageSize=${pageSize || 20}&viewOrder=desc`,
    );
  };

  const setPositionHandler = (pageNo, pageSize, values, searchValue = '') => {
    getLandingData(values, pageNo, pageSize, searchValue);
  };
  useEffect(() => {
    getLandingData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [buId]);

  return (
    <Formik
      enableReinitialize={true}
      initialValues={initData}
      // validationSchema={validationSchema}
      onSubmit={(values, { setSubmitting, resetForm }) => {}}
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
            title="Land Register"
            isHiddenReset
            isHiddenBack
            isHiddenSave
            renderProps={() => {
              return (
                <div>
                  <button
                    type="button"
                    className="btn btn-primary mx-2"
                    onClick={() => {
                      history.push(
                        `/mngAsset/registration/LandRegister/create`,
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
              {gridData?.data?.length > 0 && (
                <div className="table-responsive">
                  <table className="table table-striped mt-2 table-bordered bj-table bj-table-landing">
                    <thead>
                      <tr>
                        <th>SL</th>
                        <th>Territory</th>
                        <th>Thana</th>
                        <th>DeedNo</th>
                        <th>Deed Date</th>
                        <th>Mouza Name</th>
                        <th>Land </th>
                        <th>Deed Value</th>
                        <th>Seller</th>
                        <th>Buyer</th>
                        <th>CS Khatian</th>
                        <th>CS Plot</th>
                        <th>SA Khatian</th>
                        <th>SA Plot</th>
                        <th>RS Khatian</th>
                        <th>RS Plot</th>
                        <th>RS Plot Based Land </th>
                        <th>City Jarip Khatian</th>
                        <th>City Jarip Plot</th>
                        <th>City Jarip Plot Based Land</th>
                        <th>Registration Cost</th>
                        <th>Other Cost</th>
                        <th>Broker Cost</th>
                        <th>Vat</th>
                        <th>Mutation Fees</th>
                        <th>Dcr</th>
                        <th>Mutitaion Khotian</th>
                        <th>Holding No</th>
                        <th>Bia Khatian</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {gridData?.data?.map((item, index) => (
                        <tr key={index}>
                          <td className="text-center">{index + 1}</td>
                          <td className="text-center">
                            {item?.strTerritoryName}
                          </td>
                          <td className="text-center">{item?.strThanakName}</td>
                          <td className="text-center">{item?.strDeedNo}</td>
                          {/* <td className="text-center">
                            {_dateFormatter(item?.dteDeedDate)}
                          </td> */}
                          <td className="text-center">
                            {_dateFormatter(item?.dteDeedDate)}
                          </td>
                          <td className="text-center">{item?.strMouzaName}</td>
                          <td className="text-center">
                            {item?.numTotalLandPurchaseQty}
                          </td>
                          <td className="text-center">{item?.monDeedValue}</td>
                          <td className="text-center">{item?.strSellerName}</td>
                          <td className="text-center">{item?.strBuyer}</td>
                          <td className="text-center">{item?.strCskhatian}</td>
                          <td className="text-center">{item?.strCsplotNo}</td>
                          <td className="text-center">
                            {item?.strSakhatianNo}
                          </td>
                          <td className="text-center">{item?.strSaplotNo}</td>
                          <td className="text-center">
                            {item?.strRskhatianNo}
                          </td>
                          <td className="text-center">{item?.strRsplotNo}</td>
                          <td className="text-center">
                            {item?.numRsplotLandBaseQty}
                          </td>

                          <td className="text-center">
                            {item?.strCityJoripKhatianNo}
                          </td>
                          <td className="text-center">
                            {item?.strCityJoripPlot}
                          </td>
                          <td className="text-center">
                            {item?.numCityJoripLandQty}
                          </td>
                          <td className="text-center">
                            {item?.monRegistrationCost}
                          </td>
                          <td className="text-center">{item?.monOtherCost}</td>
                          <td className="text-center">{item?.monBroker}</td>
                          <td className="text-center">{item?.monVat}</td>
                          <td className="text-center">
                            {item?.monMutationFees}
                          </td>
                          <td className="text-center">{item?.strDcrno}</td>
                          <td className="text-center">
                            {item?.strMutitaionKhotianNo}
                          </td>
                          <td className="text-center">{item?.strHoldingNo}</td>
                          <td className="text-center">
                            {item?.strBiaMutationKhotian}
                          </td>

                          <td className="text-center">
                            <div className="btn-container">
                              <button
                                type="button"
                                className="btn btn-primary mr-2"
                                onClick={() => {
                                  setIsShowUpdateModal(true);
                                  setSingleData(item);
                                }}
                              >
                                Mutation
                              </button>
                              <span
                                className="mt-2"
                                onClick={() => {
                                  history.push({
                                    pathname: `/mngAsset/registration/LandRegister/edit/${item?.intLandGeneralPk}`,
                                    state: item,
                                  });
                                }}
                              >
                                <IEdit />
                              </span>
                              {item?.strRegistrationAttachment ? (
                                <OverlayTrigger
                                  overlay={
                                    <Tooltip id="cs-icon">
                                      View Attachment
                                    </Tooltip>
                                  }
                                >
                                  <span
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      dispatch(
                                        getDownlloadFileView_Action(
                                          item?.strRegistrationAttachment,
                                        ),
                                      );
                                    }}
                                    className="mt-2 ml-2"
                                  >
                                    <i
                                      style={{ fontSize: '16px' }}
                                      className={`fa pointer fa-eye`}
                                      aria-hidden="true"
                                    ></i>
                                  </span>
                                </OverlayTrigger>
                              ) : null}
                            </div>
                          </td>
                          {/* <td className="text-center">
                            {item?.strMutitaionKhotianNo || ""}
                          </td>
                          <td className="text-center">{item?.monBroker}</td>
                          <td className="text-center">
                            {item?.monRegistrationCost}
                          </td>
                          <td className="text-center">
                            {item?.monMutationFees || ""}
                          </td>
                          <td className="text-center">
                            {item?.strRemark || ""}
                          </td> */}
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
              <div>
                <div className="bank-letter-print-wrapper">
                  <div style={{ margin: '-13px 50px 51px 50px' }}>
                    <table>
                      <thead>
                        <tr>
                          <td
                            style={{
                              border: 'none',
                            }}
                          >
                            {/* place holder for the fixed-position header */}
                            <div
                              style={{
                                height: '110px',
                              }}
                            ></div>
                          </td>
                        </tr>
                      </thead>
                      {/* CONTENT GOES HERE */}
                      <tbody></tbody>
                      <tfoot>
                        <tr>
                          <td
                            style={{
                              border: 'none',
                            }}
                          >
                            {/* place holder for the fixed-position footer */}
                            <div
                              style={{
                                height: '150px',
                              }}
                            ></div>
                          </td>
                        </tr>
                      </tfoot>
                    </table>
                  </div>
                </div>
              </div>
              {isShowUpdateModal && (
                <IViewModal
                  show={isShowUpdateModal}
                  onHide={() => {
                    setIsShowUpdateModal(false);
                    setSingleData(null);
                  }}
                  title="Land Mutation"
                >
                  <UpdateMutation
                    singleData={singleData}
                    getLandingData={getLandingData}
                    setIsShowUpdateModal={setIsShowUpdateModal}
                    setSingleData={setSingleData}
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
