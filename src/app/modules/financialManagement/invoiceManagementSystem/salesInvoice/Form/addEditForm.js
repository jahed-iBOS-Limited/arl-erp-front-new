import { Formik } from "formik";
import React, { useEffect, useRef, useState } from "react";
import { shallowEqual, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { useReactToPrint } from "react-to-print";
import * as Yup from "yup";
import { _todayDate } from "../../../../_helper/_todayDate";
import InvoiceRecept from "../invoice/invoiceRecept";
import FormOne from "./formOne";

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
  createCommercialInvoice,
  createSalesInvoice,
  getCustomerDDL,
  getEmployeeList,
} from "../helper";
import InvoiceReceptBluePill from "../invoiceBluePill/invoiceRecept";

import InvoiceReceptForCement from "../invoiceCement/invoiceRecept";
import InvoiceReceptForPolyFibre from "../invoicePolyFibre/invoiceRecept";
import {
  useBluePillInvoiceHandler,
  useCementInvoicePrintHandler,
  usePolyFibreInvoicePrintHandler
} from "./formHandlerBluePill";
import FormTwo from "./formTwo";

const initData = {
  customer: "",
  order: "",
  purchaseOrderNo: "",
  purchaseDate: "",
  invoiceDate: _todayDate(),
  contactPerson: "",
  contactNo: "",
  projectName: "",
  delivery: "",
  challanNo: [],
  transportationCost: 0,
  discount: 0,
  advancedPayment: 0,
  companyName: "",
  companyAddress: "",
};

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
};

const validationSchema = Yup.object().shape({});

const AddEditForm = () => {
  const printRef = useRef();
  const history = useHistory();
  // eslint-disable-next-line no-unused-vars
  const [orderSingleValue, setSingleValue] = useState({});
  const [grandTotal, setGrandTotal] = useState({
    totalQuantity: 0,
    totalAmount: 0,
  });

  const [disabled, setDisabled] = useState(false);
  const [rowDto, setRowDto] = useState([]);
  const [challanNo, setChallanNo] = useState([]);
  const [customerDDL, setCustomerDDL] = useState([]);
  const [orderDDL, setOrderDDL] = useState([]);
  const [deliveryDDL, setDeliveryDDL] = useState([]);
  const [partnerInfo, setPartnerInfo] = useState("");
  const [distributionChannelDDL, setDistributionChannelDDL] = useState([]);
  const [invoiceData, setInvoiceData] = useState([]);
  const [employeeList, setEmployeeList] = useState([]);
  const [channelId, setChannelId] = useState(0);
  // const [customerType, setCustomerType] = useState(0);

  // get user profile data from store
  const {
    profileData: { accountId: accId, userId },
    selectedBusinessUnit: { value: buId },
  } = useSelector((state) => state?.authData, shallowEqual);

  useEffect(() => {
    if (buId && accId) {
      getDistributionChannelDDL_api(accId, buId, setDistributionChannelDDL);
      getEmployeeList(accId, buId, setEmployeeList, setDisabled);
    }
  }, [buId, accId]);

  const {
    printRefBluePill,
    handleInvoicePrintBluePill,
  } = useBluePillInvoiceHandler();

  const {
    printRefCement,
    handleInvoicePrintCement,
  } = useCementInvoicePrintHandler();

  const {
    printRefPolyFibre,
    handleInvoicePrintPolyFibre,
  } = usePolyFibreInvoicePrintHandler();

   

  const saveHandler = (values, cb) => {
    if (rowDto?.length > 0) {
      const payload = {
        header: {
          // invoiceCode: "demo code",
          accountId: accId,
          businessUnitId: buId,
          salesOrderId: values?.order?.value,
          salesOrderDate: values?.order?.date,
          invoiceDate: values?.invoiceDate,
          doNo: values?.order?.label,
          challanNoAndDate: values?.delivery?.label
            ? challanNo.toString().replace(",,", ",")
            : "",
          compnayNameAndAddress:
            partnerInfo?.companyName + "_" + partnerInfo?.companyAddress,
          purchaseOrderNo: partnerInfo?.partnerRefferenceNo
            ? partnerInfo?.partnerRefferenceNo
            : 0,
          purchaseDate: values?.purchaseDate,
          contactPersonAndDesignation: values?.contactPerson,
          contactNo: partnerInfo?.contactNo,
          projectName: partnerInfo?.projectNameAddr,
          totalAmount:
            grandTotal?.totalAmount +
            +values?.advancedPayment +
            +values?.discount +
            +values?.transportationCost,
          transportCost: values?.transportationCost,
          discount: values?.discount,
          advancePayment: values?.advancedPayment,
        },
        row: rowDto?.map((item) => ({
          // invoiceCode: item?.invoiceCode,
          productId: +item?.productId,
          productDescription: item?.productDescription,
          deliveryId: +item?.deliveryId,
          deliveryCode: item?.deliveryCode,
          deliveryRowId: item?.deliveryRowId,
          quantity: item?.quantity,
          unitPrice: item?.unitPrice,
          amount: item?.amount,
        })),
      };
      //api call
      createCommercialInvoice(payload, setDisabled, () => {
        cb();
      });
    } else {
      toast.warn("Please add atleast one item in table");
    }
  };

  useEffect(() => {
    if (rowDto?.length > 0) {
      const reduceObj = rowDto.reduce(
        (acc, cur) => {
          return {
            totalQuantity: (acc.totalQuantity += cur?.quantity),
            totalAmount: (acc.totalAmount += cur?.amount),
          };
        },
        { totalQuantity: 0, totalAmount: 0 }
      );
      setGrandTotal(reduceObj);
    } else {
      setGrandTotal({ totalQuantity: 0, totalAmount: 0 });
    }
  }, [rowDto]);

  useEffect(() => {
    getCustomerDDL(accId, buId, setCustomerDDL);
  }, [accId, buId]);

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
        if ([175, 186, 4, 94, 144, 138]?.includes(buId)) {
          payload.push({
            deliveryId: [175, 94, 144].includes(buId)
              ? undefined
              : +item?.deliveryId,
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
            intSoldBy: values?.soldBy?.value,
            strSoldByName: values?.soldBy?.label,
            intSalesOrderCreatedBy: values?.salesOrderCreatedBy?.value,
            strSalesOrderCreatedBy: values?.salesOrderCreatedBy?.label,
            strPaymentTerms: values?.paymentTerms?.label,
            remarks: values?.remarks || "",
          });
        } else if ([8].includes(buId)) {
          payload.push({
            deliveryId: item?.deliveryId,
            deliveryCode: "",
            referance: values?.refNumber,
            actionBy: userId,
            projLocation: values?.projectLocation,
            strInvoiceNo: values?.invoiceNo,
            isAitinclude: values?.ait?.value,
            intSoldBy: values?.soldBy?.value,
            strSoldByName: values?.soldBy?.label,
            intSalesOrderCreatedBy: values?.salesOrderCreatedBy?.value,
            strSalesOrderCreatedBy: values?.salesOrderCreatedBy?.label,
            strPaymentTerms: values?.paymentTerms?.label,
            remarks: values?.remarks || "",
            strGoodsDescription: values?.particulars || "",
          });
        } else {
          payload.push({
            deliveryId: item?.deliveryId,
            deliveriDate: item?.deliveryDate,
            totalDeliveredQtyCFT: item?.totalDeliveredQtyCFT || 0,
            totalDeliveredQtyCUM: item?.totalDeliveredQtyCUM || 0,
            itemRate: item?.itemRate || 0,
            totalAmount: item?.totalAmount,
            orderNumber: item?.orderNumber,
            customerId: values?.customer?.value,
            customerName: values?.customer?.label,
            referance: values?.refNumber,
            projLocation: values?.projectLocation,
            strInvoiceNo: values?.invoiceNo,
            isAitinclude: values?.ait?.value,
            intSoldBy: values?.soldBy?.value,
            strSoldByName: values?.soldBy?.label,
            intSalesOrderCreatedBy: values?.salesOrderCreatedBy?.value,
            strSalesOrderCreatedBy: values?.salesOrderCreatedBy?.label,
            strPaymentTerms: values?.paymentTerms?.label,
            remarks: values?.remarks || "",
          });
        }
      }
    }
    if (payload?.length === 0) {
      return toast.warning("Please Select Item");
    }
    createSalesInvoice(buId, payload, setDisabled, setInvoiceData, () => {
      cb();
      if ([186, 138].includes(buId)) {
        handleInvoicePrintBluePill();
      }
      if (buId === 4) {
        handleInvoicePrintCement();
      }
      if ([94, 175, 144].includes(buId)) {
        handleInvoicePrint();
      }
      if ([8].includes(buId)) {
        handleInvoicePrintPolyFibre();
      }
    });
  };

  const handleInvoicePrint = useReactToPrint({
    content: () => printRef.current,
    pageStyle:
      "@media print{body { -webkit-print-color-adjust: exact; margin: 0mm;}@page {size: portrait ! important}}",
  });

  const isSaveBtnDisabled = (values) => {
    return [175, 186, 4, 94, 8, 138]?.includes(buId)
      ? !values?.refNumber ||
          !values?.projectLocation ||
          ([4, 186, 138]?.includes(buId) &&
            (!values?.soldBy ||
              !values?.salesOrderCreatedBy ||
              !values?.paymentTerms?.label))
      : !values?.delivery?.label;
  };

  const onSubmit = (values, resetForm) => {
    if ([175, 186, 4, 94, 8, 138]?.includes(buId)) {
      invoiceHandler(values, () => {
        resetForm(invoiceInitData);
        setRowDto([]);
      });
    } else {
      saveHandler(values, () => {
        resetForm(initData);
      });
    }
  };

  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={
          [175, 186, 4, 94, 8, 138]?.includes(buId) ? invoiceInitData : initData
        }
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
                  {disabled && <Loading />}
                  {// Akij Ready Mix Concrete Ltd & Blue Pill Limited & Akij Cement Company Ltd
                  [175, 186, 4, 94, 8, 138]?.includes(buId) ? (
                    <FormOne
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
                        // setCustomerType,
                      }}
                    />
                  ) : (
                    <FormTwo
                      propsObj={{
                        values,
                        setFieldValue,
                        setRowDto,
                        errors,
                        touched,
                        accId,
                        buId,
                        setDisabled,
                        rowDto,
                        customerDDL,
                        setOrderDDL,
                        orderDDL,
                        setPartnerInfo,
                        setSingleValue,
                        setDeliveryDDL,
                        partnerInfo,
                        deliveryDDL,
                        challanNo,
                        setChallanNo,
                        grandTotal,
                      }}
                    />
                  )}
                </CardBody>
              </Card>
            </div>
          </form>
        )}
      </Formik>
      <InvoiceRecept printRef={printRef} invoiceData={invoiceData} />

      {/* Blue Print Invoice   */}
      <InvoiceReceptBluePill
        printRef={printRefBluePill}
        invoiceData={invoiceData}
      />

      {/* Sales invoice print for akij cement company ltd */}
      <InvoiceReceptForCement
        // printRef={printRefTest}
        printRef={printRefCement}
        invoiceData={invoiceData}
        channelId={channelId}
      />

      {/* Sales invoice print for Akij Poly Fibre industries Limited */}
      <InvoiceReceptForPolyFibre
        printRef={printRefPolyFibre}
        invoiceData={invoiceData}
      />
    </>
  );
};

export default AddEditForm;
