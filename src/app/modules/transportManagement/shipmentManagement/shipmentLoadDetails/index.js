import { Form, Formik } from "formik";
import React, { useMemo } from "react";
import { shallowEqual, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import IForm from "../../../_helper/_form";
import IEdit from "../../../_helper/_helperIcons/_edit";
import Loading from "../../../_helper/_loading";
import useAxiosGet from "../../../_helper/customHooks/useAxiosGet";
import {
  fetchShipmentDetailsData,
  landingInitData,
  landingValidation,
  reportTypeDDL,
} from "./helper";
import ShipPointShipMentDDL from "./shipPointMent";
import { _dateFormatter } from "../../../_helper/_dateFormate";
import NewSelect from "../../../_helper/_select";
import FromDateToDateForm from "../../../_helper/commonInputFieldsGroups/dateForm";

export default function ShipmentLoadDetailsLandingPage() {
  //redux
  const { selectedBusinessUnit } = useSelector(
    (state) => state?.authData,
    shallowEqual
  );

  // hook
  const history = useHistory();

  // api action
  const [
    shipmentLoadDetailsData,
    getShipmentLoadDetails,
    getShipmentLoadDetailsLoading,
  ] = useAxiosGet();

  const [
    shipmentLoadTopSheetData,
    getShipmentLoadTopSheet,
    getShipmentLoadTopSheetLoading,
  ] = useAxiosGet();

  // save handler
  const showHandler = (values, cb) => {
    fetchShipmentDetailsData({
      getShipmentLoadDetails,
      getShipmentLoadTopSheet,
      values,
      selectedBusinessUnit,
      cb,
    });
  };

  // is Loading
  const isLoading =
    getShipmentLoadDetailsLoading || getShipmentLoadTopSheetLoading;

  return (
    <Formik
      enableReinitialize={true}
      initialValues={landingInitData}
      validationSchema={landingValidation}
      onSubmit={(values, { setSubmitting, resetForm }) => {
        showHandler(values, () => {
          resetForm(landingInitData);
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
        setValues,
      }) => (
        <>
          {isLoading && <Loading />}
          <IForm
            title="Shipment Load Details"
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
                        pathname:
                          "/transport-management/shipmentmanagement/ShipmentLoadDetails/create",
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
              <div className="form-group  global-form row">
                <div className="col-lg-3">
                  <NewSelect
                    name="reportType"
                    options={reportTypeDDL}
                    value={values?.reportType}
                    label="Report Type"
                    onChange={(valueOption) => {
                      setValues({
                        ...values,
                        reportType: valueOption,
                        shipment: "",
                        shippoint: "",
                      });
                    }}
                    errors={errors}
                    touched={touched}
                  />
                </div>

                {/* This is common for landing & create. From updated requirement- The shipment ddl will not show at landing for top sheet report type that's there is some more modification. */}

                <ShipPointShipMentDDL
                  obj={{
                    values,
                    errors,
                    touched,
                    setFieldValue,
                  }}
                />

                {[2].includes(values?.reportType?.value) ? (
                  <FromDateToDateForm
                    obj={{
                      values,
                      setFieldValue,
                      errors,
                      touched,
                    }}
                  />
                ) : (
                  <></>
                )}

                <div className="col d-flex  align-items-end">
                  <button
                    type="submit"
                    className="btn btn-primary mt-5"
                    onSubmit={handleSubmit}
                  >
                    Show
                  </button>
                </div>
              </div>

              {values?.reportType?.label === "Details" ? (
                <ShipmentLoadDetailsTable
                  obj={{ shipmentLoadDetailsData, history }}
                />
              ) : (
                <ShipmentTopSheetTable obj={{ shipmentLoadTopSheetData }} />
              )}
            </Form>
          </IForm>
        </>
      )}
    </Formik>
  );
}

function ShipmentLoadDetailsTable({ obj }) {
  // destrcuture
  const { shipmentLoadDetailsData, history } = obj;

  const totalQuantity = useMemo(() => {
    return shipmentLoadDetailsData?.length > 0
      ? shipmentLoadDetailsData?.reduce(
          (acc, item) => (acc += item?.quantity),
          0
        )
      : 0;
  }, [shipmentLoadDetailsData]);

  // table
  return shipmentLoadDetailsData?.length > 0 ? (
    <div className="table-responsive">
      <table
        id="table-to-xlsx"
        className={
          "table table-striped table-bordered mt-3 bj-table bj-table-landing table-font-size-sm global-table"
        }
      >
        <thead>
          <tr className="cursor-pointer">
            <th>SL</th>
            <th>Shipment Code</th>
            <th>Date</th>
            <th>Shift Name</th>
            <th>Quantity</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {shipmentLoadDetailsData.map((item, index) => {
            return (
              <tr key={index}>
                <td style={{ width: "40px" }} className="text-center">
                  {index + 1}
                </td>
                <td>{item?.shipmentCode}</td>
                <td>{_dateFormatter(item?.creationDate)}</td>
                <td>{item?.shiftName}</td>
                <td className="text-right">{item?.quantity}</td>

                <td>
                  {item?.isAccept !== true && (
                    <span>
                      <IEdit
                        onClick={() => {
                          history.push({
                            pathname: `/transport-management/shipmentmanagement/ShipmentLoadDetails/edit/${item?.autoId}`,
                            state: item,
                          });
                        }}
                      />
                    </span>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
        <tr>
          <td colSpan={4} className="text-center font-weight-bold">
            Total
          </td>
          <td className="text-right font-weight-bold">{totalQuantity}</td>
          <td></td>
        </tr>
      </table>
    </div>
  ) : (
    <></>
  );
}

function ShipmentTopSheetTable({ obj }) {
  // destrcuture
  const { shipmentLoadTopSheetData } = obj;

  // table
  return shipmentLoadTopSheetData?.length > 0 ? (
    <div className="table-responsive">
      <table
        id="table-to-xlsx"
        className={
          "table table-striped table-bordered mt-3 bj-table bj-table-landing table-font-size-sm global-table"
        }
      >
        <thead>
          <tr className="cursor-pointer">
            <th>SL</th>
            <th>Shipment Code</th>
            <th>Net Weight</th>
            <th>Load Qty</th>
            <th>Pending Qty</th>
          </tr>
        </thead>
        <tbody>
          {shipmentLoadTopSheetData.map((item, index) => {
            return (
              <tr key={index}>
                <td style={{ width: "40px" }} className="text-center">
                  {index + 1}
                </td>
                <td>{item?.shipmentCode}</td>
                <td className="text-right">{item?.totalNetWeight}</td>
                <td className="text-right">{item?.totalLoadQuantity}</td>
                <td className="text-right">{item?.totalRemainingQuantity}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  ) : (
    <></>
  );
}
