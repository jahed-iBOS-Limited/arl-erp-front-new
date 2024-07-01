import { Form, Formik } from "formik";
import React, { useEffect, useRef, useState } from "react";
import { shallowEqual, useSelector } from "react-redux";
import ReactToPrint from "react-to-print";
import * as Yup from "yup";
import ICustomCard from "../../../_helper/_customCard";
import Loading from "../../../_helper/_loading";
import NewSelect from "../../../_helper/_select";
import useAxiosGet from "../../../_helper/customHooks/useAxiosGet";
import { PortAndMotherVessel } from "../../common/components";
import InputField from "../../../_helper/_inputField";
import { _todayDate } from "../../../_helper/_todayDate";
import { _dateFormatter } from "../../../_helper/_dateFormate";
import { _fixedPoint } from "../../../_helper/_fixedPoint";
const validationSchema = Yup.object().shape({});
function G2GSalesInvoice() {
  const {
    profileData: { userId, accountId },
    selectedBusinessUnit: { value: buUnId, label: buUnName },
  } = useSelector((state) => state?.authData, shallowEqual);

  const [shipPoint, getShipPoint] = useAxiosGet();
  const [, getGhatWiseDeliveryReport, gridDataLoading] = useAxiosGet();
  const [loading, setLanding] = useState(false);
  const [gridData, setGridData] = useState([]);
  const printRef = useRef();

  useEffect(() => {
    getShipPoint(
      `/wms/ShipPoint/GetShipPointDDL?accountId=${accountId}&businessUnitId=${buUnId}`
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [accountId]);

  const onChangeHandler = (fieldName, values, currentValue, setFieldValue) => {
    switch (fieldName) {
      case "shipPoint":
        setFieldValue("shipPoint", currentValue);
        setFieldValue("motherVessel", "");
        break;
      case "port":
        if (currentValue) {
          setFieldValue("port", currentValue);
          setFieldValue("motherVessel", "");
        } else {
          setFieldValue("port", "");
          setFieldValue("motherVessel", "");
        }
        break;
      case "motherVessel":
        setFieldValue("motherVessel", currentValue);
        if (currentValue) {
          setFieldValue("programNo", currentValue?.programNo);
          setFieldValue("item", {
            value: currentValue?.itemId,
            label: currentValue?.itemName,
          });
        } else {
          setFieldValue("programNo", "");
          setFieldValue("item", "");
        }
        break;
      default:
        break;
    }
  };

  const showHandelar = (values) => {
    const reportType = values?.reportType?.value;

    switch (reportType) {
      case 1:
        break;
      case 2:
        // Ghat Wise Delivery Report
        getGhatWiseDeliveryReport(
          `/tms/LigterLoadUnload/GetGhatWiseDeliveryReport?accountId=${accountId}&businessUnitId=${buUnId}&motherVesslelId=${values?.motherVessel?.value}&shipPointId=${values?.shipPoint?.value}&fromDate=${values?.fromDate}&toDate=${values?.toDate}`,
          (resData) => {
            setGridData(resData);
          }
        );
        break;
      default:
        break;
    }
  };

  return (
    <>
      <ICustomCard title="G2G Sales Invoice">
        <>
          <Formik
            enableReinitialize={true}
            validationSchema={validationSchema}
            initialValues={{
              reportType: { value: 1, label: "Godowns Entry Report" },
              shipPoint: "",
              port: "",
              motherVessel: "",
              fromDate: _todayDate(),
              toDate: _todayDate(),
            }}
            onSubmit={(values, { setSubmitting, resetForm }) => {}}
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
              <>
                {(loading || gridDataLoading) && <Loading />}
                <Form className="form">
                  <div className="row global-form">
                    <div className="col-lg-3">
                      <NewSelect
                        name="reportType"
                        label="Report Type"
                        placeholder="Report Type"
                        options={[
                          {
                            value: 1,
                            label: "Godowns Entry Report",
                          },
                          {
                            value: 2,
                            label: "Ghat Wise Delivery Report",
                          },
                        ]}
                        value={values?.reportType}
                        onChange={(valueOption) => {
                          setGridData([]);
                          setFieldValue("reportType", valueOption);
                        }}
                      />
                    </div>
                    {[2].includes(values?.reportType?.value) && (
                      <>
                        {" "}
                        <div className="col-lg-3">
                          <NewSelect
                            name="shipPoint"
                            options={shipPoint || []}
                            value={values?.shipPoint}
                            label="ShipPoint"
                            onChange={(valueOption) => {
                              setGridData([]);
                              setFieldValue("shipPoint", valueOption);
                            }}
                            placeholder="ShipPoint"
                            errors={errors}
                            touched={touched}
                          />
                        </div>
                      </>
                    )}

                    {[1, 2].includes(values?.reportType?.value) && (
                      <>
                        {" "}
                        <PortAndMotherVessel
                          obj={{
                            values,
                            setFieldValue,
                            allElement: false,
                            onChange: (fieldName, allValues) => {
                              setGridData([]);
                              onChangeHandler(
                                fieldName,
                                values,
                                allValues?.[fieldName],
                                setFieldValue
                              );
                            },
                          }}
                        />
                      </>
                    )}

                    <div className="col-lg-3">
                      <InputField
                        value={values?.fromDate}
                        label="From Date"
                        name="fromDate"
                        type="date"
                        onChange={(e) => {
                          setGridData([]);
                          setFieldValue("fromDate", e.target.value);
                        }}
                      />
                    </div>
                    <div className="col-lg-3">
                      <InputField
                        value={values?.toDate}
                        label="To Date"
                        name="toDate"
                        type="date"
                        onChange={(e) => {
                          setGridData([]);
                          setFieldValue("toDate", e.target.value);
                        }}
                      />
                    </div>
                    <div className="col-lg-2 d-flex align-items-center">
                      <button
                        type="button"
                        className="btn btn-primary mt-3"
                        onClick={() => {
                          showHandelar(values);
                        }}
                        disabled={
                          !values?.fromDate ||
                          !values?.toDate ||
                          (values?.reportType?.value === 2
                            ? !values?.shipPoint || !values?.motherVessel
                            : !values?.motherVessel)
                        }
                      >
                        Show
                      </button>
                    </div>
                    <div className="col d-flex align-items-center justify-content-end">
                      <ReactToPrint
                        pageStyle={
                          "@media print{body { -webkit-print-color-adjust: exact;}@page {size: portrait ! important}}"
                        }
                        trigger={() => (
                          <button
                            type="button"
                            className="btn btn-primary ml-3"
                            disabled={gridData?.length > 0 ? false : true}
                          >
                            <i
                              class="fa fa-print pointer"
                              aria-hidden="true"
                            ></i>
                            Print
                          </button>
                        )}
                        content={() => printRef.current}
                      />
                    </div>
                  </div>

                  {/*  Ghat wise delivery report (type : 2) */}
                  {values?.reportType?.value === 2 && gridData?.length > 0 && (
                    <>
                      <GhatWiseDeliveryReport
                        printRef={printRef}
                        gridData={gridData}
                        buUnName={buUnName}
                        values={values}
                      />
                    </>
                  )}
                </Form>
              </>
            )}
          </Formik>
        </>
      </ICustomCard>
    </>
  );
}

export default G2GSalesInvoice;

const GhatWiseDeliveryReport = ({ printRef, gridData, buUnName, values }) => {
  return (
    <div ref={printRef}>
      <div>
        <div className="row">
          <div className="col-lg-12 text-center">
            <h4 className="m-0">{buUnName}</h4>
            <p>
              <span>Ghat Wise Delivery Report</span>
              <br />
              <span>{values?.motherVessel?.label}</span>
              <br />
              <span>{values?.item?.label}</span>
            </p>
          </div>
        </div>
      </div>
      <div className="row">
        <div className="col-lg-12">
          <div className="scroll-table-auto asset_list">
            <table className="table table-striped table-bordered global-table table-font-size-sm">
              <thead>
                <tr>
                  <th>SL</th>
                  <th>Date</th>
                  <th>Truck No</th>
                  <th>Challan No</th>
                  <th>Quantity(MT)</th>
                  <th>Quantity(BAG)</th>
                  <th>Epmty Bag</th>
                  <th>Destination</th>
                  <th>Receiving Date</th>
                </tr>
              </thead>

              <tbody>
                {gridData?.map((item, index) => (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{_dateFormatter(item?.deliveryDate)}</td>
                    <td>{item?.vehicleRegNo}</td>
                    <td>{item?.deliveryCode}</td>
                    <td className="text-right">
                      {item?.totalDeliveryQuantity}
                    </td>
                    <td className="text-right">{item?.totalDeliveryValue}</td>
                    <td className="text-right">{item?.emptyBag}</td>
                    <td>{item?.shipPointName}</td>
                    <td>
                      {item?.receiveDate
                        ? _dateFormatter(item?.receiveDate)
                        : ""}
                    </td>
                  </tr>
                ))}
                <tr>
                  <td colSpan={4}>Total</td>
                  <td className="text-right">
                    <b>
                      {_fixedPoint(
                        gridData?.reduce((acc, cur) => {
                          return (acc += +cur?.totalDeliveryQuantity || 0);
                        }, 0)
                      )}
                    </b>
                  </td>
                  <td className="text-right">
                    <b>
                      {_fixedPoint(
                        gridData?.reduce((acc, cur) => {
                          return (acc += +cur?.totalDeliveryValue || 0);
                        }, 0)
                      )}
                    </b>
                  </td>
                  <td className="text-right">
                    <b>
                      {_fixedPoint(
                        gridData?.reduce((acc, cur) => {
                          return (acc += +cur?.emptyBag || 0);
                        }, 0)
                      )}
                    </b>
                  </td>
                  <td colSpan={2}></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
