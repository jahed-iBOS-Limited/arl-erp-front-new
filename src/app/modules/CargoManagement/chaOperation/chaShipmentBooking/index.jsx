import { Form, Formik } from "formik";
import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import * as Yup from "yup";
import { imarineBaseUrl } from "../../../../../App";
import ICustomCard from "../../../_helper/_customCard";
import { _dateFormatter } from "../../../_helper/_dateFormate";
import IEdit from "../../../_helper/_helperIcons/_edit";
import InfoCircle from "../../../_helper/_helperIcons/_infoCircle";
import IView from "../../../_helper/_helperIcons/_view";
import Loading from "../../../_helper/_loading";
import PaginationSearch from "../../../_helper/_search";
import NewSelect from "../../../_helper/_select";
import PaginationTable from "../../../_helper/_tablePagination";
import IViewModal from "../../../_helper/_viewModal";
import useAxiosGet from "../../../_helper/customHooks/useAxiosGet";
import IOU from "./IOU";
import ServiceAndCharge from "./ServiceAndCharge";
import ViewInfo from "./viewInfo";
import ViewInvoice from "./ViewInvoice";

const validationSchema = Yup.object().shape({});
const initialValues = {
  chaType: {
    value: 0,
    label: "All",
  },
};

export default function ChaShipmentBooking() {
  const [
    chaShipmentBooking,
    getyChaShipmentBooking,
    chaShipmentBookingLoading,
  ] = useAxiosGet();
  const [pageNo, setPageNo] = useState(0);
  const [pageSize, setPageSize] = useState(15);
  const [openModalObject, setOpenModalObject] = useState({});
  const [clickRowDto, setClickRowDto] = useState({});
  let history = useHistory();
  const formikRef = React.useRef(null);
  const saveHandler = (values, cb) => {};

  const commonGetData = (search, pageNo, pageSize, values) => {
    getyChaShipmentBooking(
      `${imarineBaseUrl}/domain/CHAShipment/GetChaShipmentBookingLanding?search=${search}&pageNo=${pageNo}&pageSize=${pageSize}&tradeTypeId=${values?.chaType?.value}`
    );
  };

  useEffect(() => {
    commonGetData("", pageNo, pageSize, initialValues);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <ICustomCard
      title="CHA Shipment Booking List"
      createHandler={() => {
        history.push(
          "/cargoManagement/cha-operation/cha-shipment-booking/create"
        );
      }}
    >
      <Formik
        enableReinitialize={true}
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={(values, { setSubmitting, resetForm }) => {
          saveHandler(values, () => {
            resetForm();
          });
        }}
        innerRef={formikRef}
      >
        {({ errors, touched, setFieldValue, isValid, values, resetForm }) => (
          <>
            {chaShipmentBookingLoading && <Loading />}
            <div className="row global-form">
              <div className="col-lg-3">
                <NewSelect
                  name="chaType"
                  options={[
                    {
                      value: 0,
                      label: "All",
                    },
                    {
                      value: 1,
                      label: "Export",
                    },
                    {
                      value: 2,
                      label: "Import",
                    },
                  ]}
                  value={values?.chaType || ""}
                  label="CHA Type"
                  onChange={(valueOption) => {
                    setFieldValue("chaType", valueOption);
                    commonGetData("", pageNo, pageSize, {
                      ...values,
                      chaType: valueOption,
                    });
                  }}
                  placeholder="CHA Type"
                  errors={errors}
                  touched={touched}
                />
              </div>
            </div>
            <PaginationSearch
              placeholder="HBL/HAWB, MBL/MAWB, Customer wise search"
              paginationSearchHandler={(serchValue) => {
                commonGetData(serchValue, pageNo, pageSize, values);
              }}
            />
            <Form className="form form-label-right">
              <div>
                <div className="table-responsive">
                  <table className="table table-striped table-bordered global-table">
                    <thead>
                      <tr>
                        <th>SL</th>
                        <th>ImpOrExp</th>
                        <th>HBL/HAWB</th>
                        <th>MBL/MAWB</th>
                        <th>Mode of Transport</th>
                        <th>Carrier</th>
                        <th>Customer</th>
                        <th>Com. Invoice No</th>
                        <th>Invoice Date</th>
                        <th>Net Weight</th>
                        <th>Gross Weight</th>
                        <th>Volumetric Weight</th>
                        <th
                          style={{
                            width: "140px",
                          }}
                        >
                          Service & Charge
                        </th>
                        <th
                          style={{
                            width: "30px",
                          }}
                        >
                          IOU
                        </th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {chaShipmentBooking?.data?.map((item, index) => {
                        return (
                          <>
                            <tr key={index}>
                              <td rowSpan={item?.rowData?.length}>
                                {" "}
                                {index + 1}
                              </td>
                              <td>{item?.impExp}</td>
                              <td>{item?.hblNo}</td>
                              <td>{item?.mblNo}</td>
                              <td>{item?.modeOfTransportName}</td>
                              <td>{item?.carrierName}</td>
                              <td>{item?.customerName}</td>
                              <td>{item?.commercialInvoiceNo}</td>
                              <td>
                                {item?.invoiceDate
                                  ? _dateFormatter(item?.invoiceDate)
                                  : ""}
                              </td>
                              <td>{item?.netWeight}</td>
                              <td>{item?.grossWeight}</td>
                              <td>{item?.volumetricWeight}</td>
                              <td>
                                <button
                                  className="btn btn-sm btn-primary"
                                  onClick={() => {
                                    setOpenModalObject({
                                      ...openModalObject,
                                      isOpenServiceCharge: true,
                                    });
                                    setClickRowDto(item);
                                  }}
                                >
                                  Service & Charge
                                </button>
                              </td>
                              <td>
                                <button
                                  className="btn btn-sm btn-primary"
                                  onClick={() => {
                                    setOpenModalObject({
                                      ...openModalObject,
                                      isOpenIOU: true,
                                    });
                                    setClickRowDto(item);
                                  }}
                                >
                                  IOU
                                </button>
                              </td>
                              <td>
                                <div
                                  style={{
                                    display: "flex",
                                    justifyContent: "space-around",
                                    gap: 2,
                                  }}
                                >
                                  <span
                                    onClick={() => {
                                      setOpenModalObject({
                                        ...openModalObject,
                                        isView: true,
                                      });
                                      setClickRowDto(item);
                                    }}
                                  >
                                    <IView />
                                  </span>
                                  <span
                                    onClick={() => {
                                      setOpenModalObject({
                                        ...openModalObject,
                                        isOpenInvoice: true,
                                      });
                                      setClickRowDto(item);
                                    }}
                                  >
                                    <InfoCircle title={"View Invoice"} />
                                  </span>
                                  <span
                                    onClick={() => {
                                      history.push(
                                        `/cargoManagement/cha-operation/cha-shipment-booking/edit/${item?.chabookingId}`
                                      );
                                    }}
                                  >
                                    <IEdit />
                                  </span>
                                </div>
                              </td>
                            </tr>
                          </>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                {chaShipmentBooking?.data?.length > 0 && (
                  <PaginationTable
                    count={chaShipmentBooking?.totalCount}
                    setPositionHandler={(pageNo, pageSize) => {
                      commonGetData("", pageNo, pageSize, values);
                    }}
                    values={values}
                    paginationState={{
                      pageNo,
                      setPageNo,
                      pageSize,
                      setPageSize,
                    }}
                  />
                )}
                {/* view details modal */}
                {openModalObject?.isView && (
                  <IViewModal
                    show={openModalObject?.isView}
                    onHide={() => {
                      setOpenModalObject({
                        ...openModalObject,
                        isView: false,
                      });
                      setClickRowDto({});
                    }}
                    title={"View Information"}
                  >
                    <ViewInfo clickRowDto={clickRowDto} />
                  </IViewModal>
                )}
                {/* invoice */}
                {openModalObject?.isOpenInvoice && (
                  <IViewModal
                    show={openModalObject?.isOpenInvoice}
                    onHide={() => {
                      setOpenModalObject({
                        ...openModalObject,
                        isOpenInvoice: false,
                      });
                      setClickRowDto({});
                    }}
                    title={"View Invoice"}
                  >
                    <ViewInvoice clickRowDto={clickRowDto} />
                  </IViewModal>
                )}
                {/* service & charge */}
                {openModalObject?.isOpenServiceCharge && (
                  <IViewModal
                    show={openModalObject?.isOpenServiceCharge}
                    onHide={() => {
                      setOpenModalObject({
                        ...openModalObject,
                        isOpenServiceCharge: false,
                      });
                      setClickRowDto({});
                    }}
                    title={"Service & Charge"}
                  >
                    <ServiceAndCharge
                      clickRowDto={clickRowDto}
                      CB={() => {
                        commonGetData("", pageNo, pageSize, values);
                        setOpenModalObject({
                          ...openModalObject,
                          isOpenServiceCharge: false,
                        });
                        setClickRowDto({});
                      }}
                    />
                  </IViewModal>
                )}
                {/* IOU */}
                {openModalObject?.isOpenIOU && (
                  <IViewModal
                    show={openModalObject?.isOpenIOU}
                    onHide={() => {
                      setOpenModalObject({
                        ...openModalObject,
                        isOpenIOU: false,
                      });
                      setClickRowDto({});
                    }}
                    title={"IOU"}
                  >
                    <IOU clickRowDto={clickRowDto} />
                  </IViewModal>
                )}
              </div>
            </Form>
          </>
        )}
      </Formik>
    </ICustomCard>
  );
}
