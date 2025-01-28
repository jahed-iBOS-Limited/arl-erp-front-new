import { Form, Formik } from "formik";
import React from "react";
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
} from "./helper";
import ShipPointShipMentDDL from "./shipPointMent";

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

  // save handler
  const showHandler = (values, cb) => {
    fetchShipmentDetailsData({
      getShipmentLoadDetails,
      values,
      selectedBusinessUnit,
      cb,
    });
  };

  // is Loading
  const isLoading = getShipmentLoadDetailsLoading;

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
                <ShipPointShipMentDDL
                  obj={{
                    values,
                    errors,
                    touched,
                    setFieldValue,
                  }}
                />

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

              <ShipmentLoadDetailsTable
                obj={{ shipmentLoadDetailsData, history }}
              />
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
                <td>{item?.shiftName}</td>
                <td>{item?.quantity}</td>

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
      </table>
    </div>
  ) : (
    <></>
  );
}
