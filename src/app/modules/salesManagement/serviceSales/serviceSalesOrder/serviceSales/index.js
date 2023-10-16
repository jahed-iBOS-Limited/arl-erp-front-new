import { Form, Formik } from "formik";
import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { shallowEqual, useSelector } from "react-redux";
import useAxiosGet from "../../../../_helper/customHooks/useAxiosGet";
import Loading from "../../../../_helper/_loading";
import IForm from "../../../../_helper/_form";
import NewSelect from "../../../../_helper/_select";
import { _dateFormatter } from "../../../../_helper/_dateFormate";
import { _todayDate } from "../../../../_helper/_todayDate";
import PaginationTable from "../../../../_helper/_tablePagination";

const initData = {
  customer: "",
  item: "",
};
export default function ServiceSalesLanding() {
  const { profileData, selectedBusinessUnit } = useSelector((state) => {
    return state.authData;
  }, shallowEqual);

  const [customerList, getCustomerList] = useAxiosGet();
  const [itemDDL, getItemDDL] = useAxiosGet();
  const [scheduleList, getScheduleList, loader] = useAxiosGet();
  const [pageNo, setPageNo] = useState(0);
  const [pageSize, setPageSize] = useState(15);

  useEffect(() => {
    getCustomerList(
      `/partner/BusinessPartnerBasicInfo/GetSoldToPartnerShipToPartnerDDL?accountId=${profileData?.accountId}&businessUnitId=${selectedBusinessUnit?.value}`
    );
    getItemDDL(
      `/oms/SalesOrder/GetgetServiceItemList?accountId=${profileData?.accountId}&businessUnitId=${selectedBusinessUnit?.value}`
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profileData, selectedBusinessUnit]);

  const saveHandler = (values, cb) => {};
  const history = useHistory();

  const setPositionHandler = (pageNo, pageSize, values) => {
    getScheduleList(
      `/oms/ServiceSales/GetServiceSalesLanding?accountId=${
        profileData?.accountId
      }&businessUnitId=${selectedBusinessUnit?.value}&customerId=${values
        ?.customer?.value || 0}&itemId=${values?.item?.value ||
        0}&pageNo=${pageNo}&pageSize=${pageSize}`
    );
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
          {loader && <Loading />}
          <IForm
            title="Service Sales Order"
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
                        "/sales-management/servicesales/servsalesorder/create"
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
              <div>
                <div className="form-group  global-form row">
                  <div className="col-lg-3">
                    <NewSelect
                      name="customer"
                      options={customerList || []}
                      value={values?.customer}
                      label="Customer"
                      onChange={(valueOption) => {
                        setFieldValue("customer", valueOption);
                      }}
                      errors={errors}
                      touched={touched}
                    />
                  </div>
                  <div className="col-lg-3">
                    <NewSelect
                      name="item"
                      options={itemDDL || []}
                      value={values?.item}
                      label="Item Name"
                      onChange={(valueOption) => {
                        setFieldValue("item", valueOption);
                      }}
                      errors={errors}
                      touched={touched}
                    />
                  </div>
                  <div>
                    <button
                      className="btn btn-primary"
                      type="button"
                      style={{ marginTop: "17px" }}
                      onClick={() => {
                        getScheduleList(
                          `/oms/ServiceSales/GetServiceSalesLanding?accountId=${
                            profileData?.accountId
                          }&businessUnitId=${
                            selectedBusinessUnit?.value
                          }&customerId=${values?.customer?.value ||
                            0}&itemId=${values?.item?.value ||
                            0}&pageNo=${pageNo}&pageSize=${pageSize}`
                        );
                      }}
                    >
                      Show
                    </button>
                  </div>
                </div>
                <div className="mt-5">
                  <table className="table table-striped table-bordered bj-table bj-table-landing">
                    <thead>
                      <tr>
                        <th>Order Code</th>
                        <th>Customer</th>
                        <th>Salaes Type Name</th>
                        <th>Payment Type</th>
                        <th>Schedule Type</th>
                        <th>Due Invoice</th>
                      </tr>
                    </thead>
                    <tbody>
                      {scheduleList?.data?.map((item, index) => (
                        <tr key={index}>
                          <td>{item?.strServiceSalesOrderCode}</td>
                          <td>{item?.strCustomerName}</td>
                          <td>{item?.strSalesTypeName}</td>
                          <td>{item?.strPaymentType}</td>
                          <td>{item?.strScheduleTypeName}</td>
                          <td className="text-center">
                            {`${item?.invoiceCollectionCount} / ${item?.intInvoiceCount}`}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {scheduleList?.data?.length > 0 && (
                    <PaginationTable
                      count={scheduleList?.totalCount}
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
                </div>
              </div>
            </Form>
          </IForm>
        </>
      )}
    </Formik>
  );
}
