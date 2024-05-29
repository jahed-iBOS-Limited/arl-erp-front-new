import { Form, Formik } from "formik";
import React, { useEffect, useState } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import useAxiosGet from "../../../_helper/customHooks/useAxiosGet";
import useAxiosPost from "../../../_helper/customHooks/useAxiosPost";
import IConfirmModal from "../../../_helper/_confirmModal";
import { _dateFormatter } from "../../../_helper/_dateFormate";
import IDelete from "../../../_helper/_helperIcons/_delete";
import IEdit from "../../../_helper/_helperIcons/_edit";
import IView from "../../../_helper/_helperIcons/_view";
import InputField from "../../../_helper/_inputField";
import PaginationSearch from "../../../_helper/_search";
import NewSelect from "../../../_helper/_select";
import PaginationTable from "../../../_helper/_tablePagination";
import { _todayDate } from "../../../_helper/_todayDate";
import IViewModal from "../../../_helper/_viewModal";
import IForm from "./../../../_helper/_form";
import Loading from "./../../../_helper/_loading";
import CommercialInvoiceModalView from "./commercialInvoiceViewModal";
import PackingAndWeightListViewModal from "./packingAndWeightListViewModal";
import SalesContractView from "./salesContractViewModal";
import ICon from "../../../chartering/_chartinghelper/icons/_icon";
import { toast } from "react-toastify";
import { getDownlloadFileView_Action } from "../../../_helper/_redux/Actions";
const initData = {
  status: { value: false, label: "Quotation Open" },
  formDate: _todayDate(),
  toDate: _todayDate(),
};
export default function SalesContractLanding() {
  const history = useHistory();
  const dispatch = useDispatch();
  const [rowData, getRowData, rowDataLoader, setRowData] = useAxiosGet();
  const [, deleteData] = useAxiosPost();
  const [, approveQuotation] = useAxiosPost();
  const [quotationId, setQuotationId] = useState(null);
  const [pageNo, setPageNo] = useState(0);
  const [pageSize, setPageSize] = useState(15);
  const [quotationViewModal, setQuotationViewModal] = useState(false);
  const [commercialViewModal, setCommercialViewModal] = useState(false);
  const [commercialId, setCommercialId] = useState(null);

  const [packingAndWeightList, setPackingAndWeightList] = useState(false);
  const [packingId, setPackingId] = useState(null);

  const selectedBusinessUnit = useSelector((state) => {
    return state.authData.selectedBusinessUnit;
  }, shallowEqual);
  const profileData = useSelector((state) => {
    return state.authData.profileData;
  }, shallowEqual);
  const saveHandler = (values, cb) => {};

  const setPositionHandler = (pageNo, pageSize, values, searchValue = "") => {
    getRowData(
      `/oms/SalesQuotation/GetSalesQuotationSearchLandingPagination?searchTerm=${searchValue}&AccountId=${profileData?.accountId}&BUnitId=${selectedBusinessUnit?.value}&PageNo=${pageNo}&PageSize=${pageSize}&viewOrder=desc&QuotationStatus=${values?.status?.value}&fromDate=${values?.formDate}&toDate=${values?.toDate}`,
      (data) => {
        setRowData(data?.data);
      }
    );
  };

  const paginationSearchHandler = (searchValue, values) => {
    setPositionHandler(pageNo, pageSize, values, searchValue);
  };

  useEffect(() => {
    getRowData(
      `/oms/SalesQuotation/GetSalesQuotationSearchLandingPagination?AccountId=${profileData?.accountId}&BUnitId=${selectedBusinessUnit?.value}&PageNo=${pageNo}&PageSize=${pageSize}&viewOrder=desc&QuotationStatus=${initData?.status?.value}&fromDate=${initData?.formDate}&toDate=${initData?.toDate}`,
      (data) => {
        setRowData(data?.data);
      }
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const actionClickHandler = (values, type, id) => {
    let confirmObject = {
      title: "Are you sure?",
      message: `If you ${type} this, it can not be undone`,
      yesAlertFunc: async () => {
        if (type === "delete") {
          console.log("delete called");
          deleteData(`deleted`, () => {
            setPositionHandler(pageNo, pageSize, values);
          });
        }
        if (type === "approve") {
          console.log("approve called");
          approveQuotation(`approved`, () => {
            setPositionHandler(pageNo, pageSize, values);
          });
        }
      },
      noAlertFunc: () => {},
    };
    IConfirmModal(confirmObject);
  };

  return (
    <Formik
      enableReinitialize={true}
      initialValues={initData}
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
          {rowDataLoader && <Loading />}
          <IForm
            title="Sales Contract"
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
                      history.push({
                        pathname: `/managementExport/exptransaction/salescontract/create`,
                      });
                    }}
                  >
                    Create
                  </button>
                </div>
              );
            }}
          >
            <Form>
              <div className="row global-form">
                <div className="col-lg-3">
                  <NewSelect
                    name="status"
                    options={[
                      { value: false, label: "Quotation Open" },
                      { value: true, label: "Quotation Closed" },
                    ]}
                    value={values?.status}
                    label="Quotation Status"
                    onChange={(valueOption) => {
                      if (valueOption) {
                        setFieldValue("status", valueOption);
                        setRowData([]);
                      } else {
                        setFieldValue("status", "");
                        setRowData([]);
                      }
                    }}
                    placeholder="Quotation Status"
                    errors={errors}
                    touched={touched}
                  />
                </div>

                <div className="col-lg-3">
                  <label>From Date</label>
                  <InputField
                    value={values?.formDate}
                    name="formDate"
                    placeholder="From Date"
                    type="date"
                    onChange={(e) => {
                      setFieldValue("formDate", e.target.value);
                      setRowData([]);
                    }}
                  />
                </div>
                <div className="col-lg-3">
                  <label>To Date</label>
                  <InputField
                    value={values?.toDate}
                    name="toDate"
                    placeholder="To Date"
                    type="date"
                    onChange={(e) => {
                      setFieldValue("toDate", e.target.value);
                      setRowData([]);
                    }}
                  />
                </div>

                <div className="col-lg-3">
                  <button
                    style={{
                      marginTop: "17px",
                    }}
                    className="btn btn-primary"
                    type="button"
                    onClick={() => {
                      getRowData(
                        `/oms/SalesQuotation/GetSalesQuotationSearchLandingPagination?AccountId=${profileData?.accountId}&BUnitId=${selectedBusinessUnit?.value}&PageNo=${pageNo}&PageSize=${pageSize}&viewOrder=desc&QuotationStatus=${values?.status?.value}&fromDate=${values?.formDate}&toDate=${values?.toDate}`,
                        (data) => {
                          setRowData(data?.data);
                        }
                      );
                    }}
                    disabled={
                      !values?.status || !values?.formDate || !values?.toDate
                    }
                  >
                    View
                  </button>
                </div>
              </div>
              <div className="row">
                <div className="col-lg-12">
                  <div className="mt-2">
                    <PaginationSearch
                      placeholder="Quotation No. & Party Name & Code"
                      paginationSearchHandler={paginationSearchHandler}
                      values={values}
                    />
                  </div>
                </div>
                <div className="col-lg-12">
                 <div className="table-responsive">
                 <table className="table table-striped table-bordered global-table sales_order_landing_table">
                    <thead>
                      <tr>
                        <th style={{ width: "35px" }}>SL</th>
                        <th style={{ width: "90px" }}>Quotation No</th>
                        <th style={{ width: "90px" }}>Quotation Date</th>
                        <th style={{ width: "90px" }}>Quotation closed Date</th>
                        <th>Sales Organization</th>
                        <th>Channel</th>
                        <th>Party Name</th>
                        <th style={{ width: "75px" }}>Total Qty</th>
                        <th style={{ width: "150px" }}>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {rowData?.length > 0 &&
                        rowData?.map((singleData, index) => (
                          <tr key={index}>
                            <td className="text-center"> {singleData.sl} </td>
                            <td>
                              <span className="pl-2">
                                {singleData.quotationCode}{" "}
                              </span>
                            </td>
                            <td className="text-center">
                              {_dateFormatter(singleData.quotationDate)}
                            </td>
                            <td className="text-center">
                              {_dateFormatter(singleData.quotationEndDate)}
                            </td>
                            <td> {singleData.salesOrganizationName} </td>
                            <td> {singleData.distributionChannelName} </td>
                            <td> {singleData.soldToPartnerName} </td>
                            <td className="text-right">
                              {" "}
                              {singleData.totalQuotationQty}{" "}
                            </td>
                            <td style={{ width: "100px" }}>
                              <div className="d-flex justify-content-around">
                                <span className="view">
                                  <IView
                                    title="View Sales Quotation"
                                    clickHandler={() => {
                                      setQuotationId(singleData?.quotationId);
                                      setQuotationViewModal(true);
                                    }}
                                  />
                                </span>
                                <span className="view">
                                  <IView
                                    title="View Commercial Invoice"
                                    clickHandler={() => {
                                      setCommercialId(singleData?.quotationId);
                                      setCommercialViewModal(true);
                                    }}
                                  />
                                </span>
                                {/* <span className="extend pointer">
                                                                <OverlayTrigger
                                                                    overlay={
                                                                        <Tooltip id="cs-icon">
                                                                            {"View Commercial Invoice"}
                                                                        </Tooltip>
                                                                    }
                                                                >
                                                                    <span>
                                                                        <i className={`fa fa-info-circle`}
                                                                            onClick={() => {
                                                                                setCommercialId(singleData?.quotationId);
                                                                                setCommercialViewModal(true);
                                                                            }}
                                                                        ></i>
                                                                    </span>
                                                                </OverlayTrigger>
                                                            </span> */}
                                <span className="view">
                                  <IView
                                    title="View Packing And Weight List"
                                    clickHandler={() => {
                                      setPackingId(singleData?.quotationId);
                                      setPackingAndWeightList(true);
                                    }}
                                  />
                                </span>
                                <span className="view">
                                  <ICon
                                    title={"View Attachment"}
                                    onClick={() => {
                                      if (singleData?.attachmentno) {
                                        dispatch(
                                          getDownlloadFileView_Action(
                                            singleData?.attachmentno
                                          )
                                        );
                                      } else {
                                        toast.warn("Attachment not uploaded!");
                                      }
                                    }}
                                  >
                                    <i class="fas fa-file-image"></i>{" "}
                                  </ICon>
                                </span>

                                {/* <span className="extend pointer">
                                                                <OverlayTrigger
                                                                    overlay={
                                                                        <Tooltip id="cs-icon">
                                                                            {"View Packing And Weight List"}
                                                                        </Tooltip>
                                                                    }
                                                                >
                                                                    <span>
                                                                        <i className={`fa fa-info-circle`}
                                                                            onClick={() => {
                                                                                setPackingId(singleData?.quotationId);
                                                                                setPackingAndWeightList(true);
                                                                            }}
                                                                        ></i>
                                                                    </span>
                                                                </OverlayTrigger>
                                                            </span> */}

                                {!values?.status?.value && (
                                  <span
                                    className="edit"
                                    onClick={() => {
                                      history.push(
                                        `/managementExport/exptransaction/salescontract/edit/${singleData?.quotationId}`
                                      );
                                    }}
                                  >
                                    <IEdit />
                                  </span>
                                )}
                                {!values?.status?.value && (
                                  <span>
                                    <IDelete
                                      remover={() => {
                                        actionClickHandler(
                                          values,
                                          "delete",
                                          singleData?.quotationId
                                        );
                                      }}
                                    />
                                  </span>
                                )}
                              </div>
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                 </div>
                  {/* sales contract modal */}
                  <IViewModal
                    title="View Foreign Sales Quotation"
                    show={quotationViewModal}
                    onHide={() => {
                      setQuotationViewModal(false);
                      setQuotationId(null);
                    }}
                  >
                    <SalesContractView quotationId={quotationId} />
                  </IViewModal>

                  {/* commercial invoice modal */}
                  <IViewModal
                    title="View Foreign Sales Commercial Invoice"
                    show={commercialViewModal}
                    onHide={() => {
                      setCommercialViewModal(false);
                      setCommercialId(null);
                    }}
                  >
                    <CommercialInvoiceModalView commercialId={commercialId} />
                  </IViewModal>

                  {/* packing and weight list */}
                  <IViewModal
                    title="View Packing And Weight List"
                    show={packingAndWeightList}
                    onHide={() => {
                      setPackingAndWeightList(false);
                      setPackingId(null);
                    }}
                  >
                    <PackingAndWeightListViewModal
                      packingAndWeightListId={packingId}
                    />
                  </IViewModal>
                </div>
                {rowData?.length > 0 && (
                  <PaginationTable
                    count={rowData?.length}
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
            </Form>
          </IForm>
        </>
      )}
    </Formik>
  );
}
