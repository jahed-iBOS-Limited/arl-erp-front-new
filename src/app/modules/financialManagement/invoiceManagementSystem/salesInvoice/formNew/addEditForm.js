import { Formik } from "formik";
import React, { useEffect, useState } from "react";
import { shallowEqual, useSelector } from "react-redux";
import { useHistory, useLocation } from "react-router-dom";
import * as Yup from "yup";
import { _todayDate } from "../../../../_helper/_todayDate";
import { toast } from "react-toastify";
import {
  Card,
  CardBody,
  CardHeader,
  CardHeaderToolbar,
  ModalProgressBar,
} from "../../../../../../_metronic/_partials/controls";
import Loading from "../../../../_helper/_loading";
import { getDistributionChannelDDL_api } from "../../../../transportManagement/report/challanInformationUpdate/helper";
import {
  createSalesInvoiceNew,
  getEmployeeList,
  getInvoiceDataByDate,
} from "../helper";
import useAxiosGet from "../../../../_helper/customHooks/useAxiosGet";
import InvoiceReceptForCement from "../invoiceCement/invoiceRecept";
import Form from "./form";
import { useCementInvoicePrintHandler } from "../Form/formHandlerBluePill";

const invoiceInitData = {
  distributionChannel: "",
  customer: "",
  fromDate: _todayDate(),
  toDate: _todayDate(),
  refNumber: "",
  projectLocation: "",
  invoiceNo: "",
  ait: { value: true, label: "Include" },
  paymentTerms: "",
  salesOrderCreatedBy: "",
  soldBy: "",
  remarks: "",
  particulars: "",
  customerType: "",
  invoiceType: { value: 1, label: "Date Range Base" },
};

const validationSchema = Yup.object().shape({});

const SalesInvoiceForm = () => {
  const history = useHistory();
  const { state } = useLocation();

  const [disabled, setDisabled] = useState(false);
  const [rowDto, setRowDto] = useState([]);
  const [distributionChannelDDL, setDistributionChannelDDL] = useState([]);
  const [invoiceData, setInvoiceData] = useState([]);
  const [employeeList, setEmployeeList] = useState([]);
  const [channelId, setChannelId] = useState(0);
  const [
    customerList,
    getCustomerList,
    customerLoading,
    setCustomerList,
  ] = useAxiosGet();
  const [SOList, getSOList, soLoading, setSOList] = useAxiosGet();
  const [, getRowsBySO, loading] = useAxiosGet();
  const [, getSOInfo] = useAxiosGet();

  // get user profile data from store
  const {
    profileData: { accountId: accId },
    selectedBusinessUnit: { value: buId },
  } = useSelector((state) => state?.authData, shallowEqual);

  useEffect(() => {
    if (buId && accId) {
      getDistributionChannelDDL_api(accId, buId, setDistributionChannelDDL);
      getEmployeeList(accId, buId, setEmployeeList, setDisabled);
    }
  }, [buId, accId]);

  const {
    printRefCement,
    handleInvoicePrintCement,
  } = useCementInvoicePrintHandler();

  useEffect(() => {
    if (state?.intChannelId) {
      getInvoiceDataByDate(
        accId,
        buId,
        state?.fromDate,
        state?.toDate,
        state?.intPartnerId,
        "",
        "",
        setDisabled,
        setRowDto
      );
    }
  }, [accId, buId, state]);

  const allSelect = (value) => {
    let _data = [...rowDto];
    const modify = _data.map((item) => {
      return {
        ...item,
        presentStatus: value,
      };
    });
    setRowDto(modify);
  };

  const selectedAll = () => {
    return rowDto?.length > 0 &&
      rowDto?.filter((item) => item?.presentStatus)?.length === rowDto?.length
      ? true
      : false;
  };

  const rowDtoHandler = (name, value, sl) => {
    let data = [...rowDto];
    let _sl = data[sl];
    _sl[name] = value;
    setRowDto(data);
  };

  const invoiceHandler = (values, cb) => {
    let payload = [];
    for (let item of rowDto) {
      if (item?.presentStatus) {
        payload.push({
          deliveryId: +item?.deliveryId,
          deliveriDate: item?.deliveriDate,
          itemId: item?.itemId,
          itemName: item?.itemName,
          totalDeliveredQtyCFT: item?.totalDeliveredQtyCFT,
          totalDeliveredQtyCUM: item?.totalDeliveredQtyCUM,
          itemRate: item?.itemRate,
          totalAmount: item?.totalAmount,
          orderNumber: item?.orderNumber,
          customerId: values?.customer?.value,
          customerName: values?.customer?.label,
          referance: values?.refNumber,
          projLocation: values?.projectLocation,
          strInvoiceNo: values?.invoiceNo,
          isAitinclude: values?.ait?.value,
          isVatinclude: values?.vat?.value,
          intSoldBy: values?.soldBy?.value,
          strSoldByName: values?.soldBy?.label,
          intSalesOrderCreatedBy: values?.salesOrderCreatedBy?.value,
          strSalesOrderCreatedBy: values?.salesOrderCreatedBy?.label,
          strPaymentTerms: values?.paymentTerms?.label,
          remarks: values?.remarks || "",
        });
      }
    }
    if (payload?.length === 0) {
      return toast.warning("Please Select Item");
    }
    createSalesInvoiceNew(payload, setDisabled, setInvoiceData, () => {
      cb();
      handleInvoicePrintCement();
    });
  };

  const isSaveBtnDisabled = (values) => {
    return (
      !values?.refNumber ||
      !values?.projectLocation ||
      !values?.soldBy ||
      !values?.salesOrderCreatedBy ||
      !values?.paymentTerms?.label
    );
  };

  const onSubmit = (values, resetForm) => {
    invoiceHandler(values, () => {
      resetForm(invoiceInitData);
      setRowDto([]);
    });
  };

  const isLoading = customerLoading || soLoading || disabled || loading;

  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={{
          ...invoiceInitData,
          distributionChannel: state?.intChannelId
            ? {
                value: state?.intChannelId,
                label: state?.strChannelName,
              }
            : "",
          customer: state?.intPartnerId
            ? {
                value: state?.intPartnerId,
                label: state?.strPartnerName,
              }
            : "",
          fromDate: state?.fromDate,
          toDate: state?.toDate,
        }}
        validationSchema={validationSchema}
        onSubmit={() => {}}
      >
        {({ values, errors, touched, setFieldValue, resetForm }) => (
          <form className="form form-label-right">
            <div className="">
              <Card>
                <ModalProgressBar />
                <CardHeader title="Sales Invoice">
                  <CardHeaderToolbar>
                    <button
                      onClick={() => history.goBack()}
                      className="btn btn-light ml-2"
                      type="button"
                    >
                      Back
                    </button>
                    <button
                      onClick={() => {
                        onSubmit(values, resetForm);
                      }}
                      className="btn btn-primary ml-2"
                      type="button"
                      disabled={isSaveBtnDisabled(values)}
                    >
                      Save
                    </button>
                  </CardHeaderToolbar>
                </CardHeader>
                <CardBody>
                  {isLoading && <Loading />}

                  <Form
                    propsObj={{
                      distributionChannelDDL,
                      values,
                      setFieldValue,
                      setRowDto,
                      errors,
                      touched,
                      accId,
                      buId,
                      employeeList,
                      setDisabled,
                      rowDto,
                      rowDtoHandler,
                      setChannelId,
                      selectedAll,
                      allSelect,
                      customerList,
                      getCustomerList,
                      SOList,
                      getSOList,
                      getRowsBySO,
                      getSOInfo,
                      setCustomerList,
                      setSOList,
                    }}
                  />
                </CardBody>
              </Card>
            </div>
          </form>
        )}
      </Formik>

      <InvoiceReceptForCement
        printRef={printRefCement}
        invoiceData={invoiceData}
        channelId={channelId}
      />
    </>
  );
};

export default SalesInvoiceForm;
