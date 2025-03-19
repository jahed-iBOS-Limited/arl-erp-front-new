import React, { useEffect, useState, useRef } from "react";
import { useSelector, shallowEqual } from "react-redux";
import ICard from "../../../../_helper/_card";
import { Formik, Form } from "formik";
import NewSelect from "../../../../_helper/_select";
import * as Yup from "yup";
// import { IInput } from "../../../../_helper/_input";
import Loading from "../../../../_helper/_loading";
import {
  getShipPointDDL,
  getPartnerCommissionReportData,
  partnerCommissionReportUpdate,
} from "../helper";
// import { _todayDate } from "../../../../_helper/_todayDate";
import { _dateFormatter } from "../../../../_helper/_dateFormate";
import { toast } from "react-toastify";
import IConfirmModal from "../../../../_helper/_confirmModal";

// Validation schema
const validationSchema = Yup.object().shape({
  // fromDate: Yup.date().required("Date is required"),
  // toDate: Yup.date().required("Date is required"),
  shipPoint: Yup.object().shape({
    label: Yup.string().required("Ship Point is required"),
    value: Yup.string().required("Ship Point is required"),
  }),
  type: Yup.object().shape({
    label: Yup.string().required("Report Type is required"),
    value: Yup.string().required("Report Type is required"),
  }),
});

const initData = {
  // fromDate: _todayDate(),
  // toDate: _todayDate(),
  shipPoint: { value: 0, label: "All" },
  type: {
    value: 0,
    label: "Pending",
  },
};

export default function PartnerCommissionLanding() {
  const printRef = useRef();
  const [loading, setLoading] = useState(false);
  const [rowDto, setRowDto] = useState();
  const [shipPointDDL, setShipPointDDL] = useState([]);

  // Get user profile data from store
  const { profileData, selectedBusinessUnit } = useSelector((state) => {
    return {
      profileData: state?.authData?.profileData,
      selectedBusinessUnit: state?.authData?.selectedBusinessUnit,
    };
  }, shallowEqual);

  useEffect(() => {
    if (profileData?.accountId && selectedBusinessUnit?.value) {
      getShipPointDDL(
        profileData?.accountId,
        selectedBusinessUnit?.value,
        setShipPointDDL
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profileData?.accountId, selectedBusinessUnit?.value]);

  /* All Check Handler */
  const setAllSelectHandler = (isAllSelect) => {
    const data = rowDto?.map((item) => ({
      ...item,
      isSelect: isAllSelect,
    }));
    setRowDto(data);
  };

  /* Single Check Handler */
  const singleCheckBoxHandler = (value, index) => {
    let newRowDto = [...rowDto];
    newRowDto[index].isSelect = value;
    setRowDto(newRowDto);
  };

  /* Complete Button Handler */
  const completeHandler = (values) => {
    let confirmObject = {
      title: "Are you sure?",
      yesAlertFunc: async () => {
        const filterData = rowDto?.filter((item) => item?.isSelect);
        if (filterData?.length === 0) {
          toast.warning("Please Select One");
        } else {
          const payload = filterData?.map((item) => {
            return item?.secondaryDeliveryId;
          });
          partnerCommissionReportUpdate(
            payload,
            profileData?.userId,
            setLoading,
            () => {
              viewHandler(values);
            }
          );
        }
      },
      noAlertFunc: () => {},
    };
    IConfirmModal(confirmObject);
  };

  const viewHandler = async (values) => {
    getPartnerCommissionReportData(
      profileData?.accountId,
      selectedBusinessUnit?.value,
      values?.shipPoint?.value,
      values?.type?.value,
      setRowDto,
      setLoading
    );
  };

  return (
    <Formik>
      <>
        <ICard
          printTitle="Print"
          title="Partner Commission Report"
          isPrint={true}
          isShowPrintBtn={true}
          componentRef={printRef}
          pageStyle="@page { size: 10in 15in !important; margin: 0mm; } @media print { body { -webkit-print-color-adjust: exact;} }"
        >
          <div>
            {loading && <Loading />}
            <div className="mx-auto">
              <Formik
                enableReinitialize={true}
                initialValues={initData}
                validationSchema={validationSchema}
                onSubmit={(values, { setSubmitting, resetForm }) => {
                  viewHandler(values);
                }}
              >
                {({ values, errors, touched, setFieldValue }) => (
                  <>
                    <Form className="form form-label-right">
                      <div className="form-group row global-form printSectionNone">
                        {/* <div className="col-lg-2">
                          <IInput
                            value={values?.fromDate}
                            label="From Date"
                            name="fromDate"
                            type="date"
                            onChange={(e) => {
                              setFieldValue("fromDate", e?.target?.value);
                              setRowDto([]);
                            }}
                          />
                        </div>
                        <div className="col-lg-2">
                          <IInput
                            value={values?.toDate}
                            label="To Date"
                            name="toDate"
                            type="date"
                            onChange={(e) => {
                              setFieldValue("toDate", e?.target?.value);
                              setRowDto([]);
                            }}
                          />
                        </div> */}

                        <div className="col-lg-3">
                          <NewSelect
                            name="shipPoint"
                            options={[
                              { value: 0, label: "All" },
                              ...shipPointDDL,
                            ]}
                            value={values?.shipPoint}
                            label="Ship Point"
                            onChange={(valueOption) => {
                              setFieldValue("shipPoint", valueOption);
                              setRowDto([]);
                            }}
                            placeholder="Ship Point"
                            errors={errors}
                            touched={touched}
                          />
                        </div>

                        <div className="col-lg-3">
                          <NewSelect
                            name="type"
                            options={[
                              { value: 0, label: "Pending" },
                              { value: 1, label: "Complete" },
                            ]}
                            value={values?.type}
                            label="Report Type"
                            onChange={(valueOption) => {
                              setFieldValue("type", valueOption);
                              setRowDto([]);
                            }}
                            placeholder="Report Type"
                            errors={errors}
                            touched={touched}
                          />
                        </div>

                        <div className="col-lg-3">
                          <button
                            type="submit"
                            className="btn btn-primary mt-5"
                          >
                            View
                          </button>

                          {rowDto?.length > 0 && values?.type?.value === 0 ? (
                            <button
                              onClick={() => {
                                completeHandler(values);
                              }}
                              type="button"
                              className="btn btn-primary mt-5 ml-2"
                            >
                              Complete
                            </button>
                          ) : null}
                        </div>
                      </div>
                    </Form>

                    <div className="table-responsive">
                      <table
                        ref={printRef}
                        className="table table-striped table-bordered bj-table bj-table-landing table-font-size-sm"
                      >
                        <thead>
                          <tr>
                            {values?.type?.value === 0 && (
                              <th
                                className="text-center"
                                style={{ width: "20px" }}
                              >
                                <input
                                  type="checkbox"
                                  id="parent"
                                  onChange={(event) => {
                                    setAllSelectHandler(event.target.checked);
                                  }}
                                />
                              </th>
                            )}
                            <th>SL</th>
                            <th>Ship Point</th>
                            <th>Challan Code</th>
                            <th>Delivery Date</th>
                            <th>Supplier Name</th>
                            <th>Partner Name</th>
                            <th>Commission Amount</th>
                          </tr>
                        </thead>

                        <tbody>
                          {rowDto?.map((item, index) => (
                            <tr key={index}>
                              {values?.type?.value === 0 && (
                                <td className="text-center">
                                  <input
                                    id="isSelect"
                                    type="checkbox"
                                    value={item?.isSelect}
                                    checked={item?.isSelect}
                                    onChange={(e) => {
                                      singleCheckBoxHandler(
                                        e.target.checked,
                                        index
                                      );
                                    }}
                                  />
                                </td>
                              )}
                              <td className="text-center">{index + 1}</td>
                              <td>{item?.shipPointName}</td>
                              <td>{item?.challanCode}</td>
                              <td className="text-center">
                                {_dateFormatter(item?.deliveryDate)}
                              </td>
                              <td>{item?.supplierName}</td>
                              <td>{item?.customerName}</td>
                              <td className="text-right">{item?.amount}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </>
                )}
              </Formik>
            </div>
          </div>
        </ICard>
      </>
    </Formik>
  );
}
