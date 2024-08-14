import { Form, Formik } from "formik";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";

import { useReactToPrint } from "react-to-print";

import { OverlayTrigger, Tooltip } from "react-bootstrap";
import useAxiosGet from "../../../_helper/customHooks/useAxiosGet";
import useAxiosPost from "../../../_helper/customHooks/useAxiosPost";
import PaginationTable from "../../../_helper/_tablePagination";
import Loading from "../../../_helper/_loading";
import IForm from "../../../_helper/_form";
import { _dateFormatter } from "../../../_helper/_dateFormate";
import IViewModal from "../../../_helper/_viewModal";
import EditShipInfo from "./EditShipInfo";
import NewSelect from "../../../_helper/_select";
import { channel } from "redux-saga";

const initData = {
  channel: "",
  sale: "",
  customer: "",
  shop: "",
};
export default function ExclusivePartnerInfo() {
  const {
    profileData: { userId, accountId },
    selectedBusinessUnit: { value: buId, label },
  } = useSelector((state) => {
    return state.authData;
  }, shallowEqual);
  const history = useHistory();
  const dispatch = useDispatch();
  const [isShowUpdateModal, setIsShowUpdateModal] = useState(false);
  const [, onSave, loader] = useAxiosPost();
  const [gridData, getGridData, loading] = useAxiosGet();
  const [channelDDL, getChannel, loadingChannel] = useAxiosGet();
  const [salesDDL, getSales, loadingSale] = useAxiosGet();
  const [customerDDL, getCustomer, loadingCustomer] = useAxiosGet();
  const [shopDDL, getShop, loadingShop] = useAxiosGet();
  const [singleData, setSingleData] = useState(null);

  useEffect(() => {
    getChannel(
      `/oms/DistributionChannel/GetDistributionChannelDDL?AccountId=${accountId}&BUnitId=${buId}`
    );
    getSales(
      `/oms/SalesOrganization/GetSalesOrganizationDDL?AccountId=${accountId}&BusinessUnitId=${buId}`
    );
  }, [buId, accountId]);

  return (
    <Formik
      enableReinitialize={true}
      initialValues={initData}
      // validationSchema={validationSchema}
      onSubmit={(values, { setSubmitting, resetForm }) => {
        getGridData(
          `/partner/BusinessPartnerShippingAddress/GetShipToPartnerAndBankInfoById?shipToPartnerId=${values?.shop?.value}&businessPartnerId=${values?.customer?.value}`
        );
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
            title="Exclusive Partner Info"
            isHiddenReset
            isHiddenBack
            isHiddenSave
          >
            <Form>
              <div className="row global-form">
                <div className="col-lg-3">
                  <NewSelect
                    name="channel"
                    label="Channel"
                    placeholder="Channel"
                    options={channelDDL}
                    value={values?.channel}
                    onChange={(valueOption) => {
                      getCustomer(
                        `/partner/PManagementCommonDDL/GetCustomerNameBySalesOrgDDL?AccountId=${accountId}&BusinessUnitId=${buId}&SalesOrganization=${values?.sale?.value}&DistribuitionChannelId=${valueOption?.value}`
                      );
                      setFieldValue("channel", valueOption);
                    }}
                  />
                </div>
                <div className="col-lg-3">
                  <NewSelect
                    name="sale"
                    label="Sale"
                    placeholder="Sales"
                    options={salesDDL}
                    value={values?.sale}
                    onChange={(valueOption) => {
                      getCustomer(
                        `/partner/PManagementCommonDDL/GetCustomerNameBySalesOrgDDL?AccountId=${accountId}&BusinessUnitId=${buId}&SalesOrganization=${valueOption?.value}&DistribuitionChannelId=${values?.channel?.value}`
                      );
                      setFieldValue("sale", valueOption);
                    }}
                  />
                </div>
                <div className="col-lg-3">
                  <NewSelect
                    name="customer"
                    label="Customer"
                    placeholder="Customer"
                    options={customerDDL}
                    value={values?.customer}
                    onChange={(valueOption) => {
                      getShop(
                        `/partner/PManagementCommonDDL/GetBusinessPartnerSalesShippingAddress?AccountId=${accountId}&BusinessUnitId=${buId}&BusinessPartnerId=${valueOption?.value}`
                      );
                      setFieldValue("customer", valueOption);
                    }}
                  />
                </div>
                <div className="col-lg-3">
                  <NewSelect
                    name="shop"
                    label="Shop"
                    placeholder="Shop"
                    options={shopDDL}
                    value={values?.shop}
                    onChange={(valueOption) => {
                      setFieldValue("shop", valueOption);
                    }}
                  />
                </div>
                <div className="col-lg-1 mt-3">
                  <button className="btn btn-primary" type="submit">
                    Show
                  </button>
                </div>
                {Object?.keys(gridData)?.length > 0 && (
                  <div className="col-lg-1 mt-3">
                    <button
                      className="btn btn-primary"
                      type="button"
                      onClick={() => {
                        setIsShowUpdateModal(true);
                        setSingleData(gridData);
                      }}
                    >
                      Update
                    </button>
                  </div>
                )}
              </div>

              {Object.keys(gridData)?.length > 0 && (
                <div className="table-responsive">
                  <table className="table table-striped mt-2 table-bordered bj-table bj-table-landing">
                    <thead>
                      <tr>
                        <th>Name</th>
                        <th>Address</th>
                        <th>Contact</th>
                        <th>Account Name</th>
                        <th>Account No</th>
                        <th>Branch Name</th>
                        <th>Routing</th>
                        <th>Birth Date</th>
                        <th>Marriage Date</th>
                        <th>National Id</th>
                        <th>Blood Group</th>
                        <th>Shirt Size</th>
                        <th>Jacket Size </th>
                        <th>Panjabi Size</th>
                        <th>Business Partner </th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr key={1}>
                        <td className="text-center">
                          {gridData?.shiptoPartnerName}
                        </td>
                        <td className="text-center">
                          {values?.shop?.address ||
                            values?.shop?.shiptoPartnerAddress}
                        </td>
                        <td className="text-center">
                          {values?.shop?.contactNumber}
                        </td>
                        <td className="text-center">
                          {gridData?.bankAccountName}
                        </td>
                        <td className="text-center">
                          {gridData?.bankAccountNo}
                        </td>
                        <td className="text-center">
                          {gridData?.strBranchName}
                        </td>
                        <td className="text-center">{gridData?.routingNo}</td>

                        <td className="text-center">
                          {_dateFormatter(gridData?.birthDate)}
                        </td>
                        <td className="text-center">
                          {_dateFormatter(gridData?.marriageDate)}
                        </td>
                        <td className="text-center">{gridData?.nationalId}</td>
                        <td className="text-center">{gridData?.bloodGroup}</td>
                        <td className="text-center">{gridData?.shirtSize}</td>
                        <td className="text-center">{gridData?.jacketSize}</td>
                        <td className="text-center">{gridData?.panjabiSize}</td>
                        <td className="text-center">
                          {gridData?.businessPartnerName}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              )}

              {isShowUpdateModal && (
                <IViewModal
                  show={isShowUpdateModal}
                  onHide={() => {
                    setIsShowUpdateModal(false);
                    setSingleData(null);
                  }}
                  title="Exclusive Partner Info Update"
                >
                  <EditShipInfo
                    getGridData={getGridData}
                    config={values}
                    singleData={singleData}
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
