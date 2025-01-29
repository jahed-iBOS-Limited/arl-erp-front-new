import { Form, Formik } from "formik";
import React from "react";
import { IInput } from "../../../../_helper/_input";
import { editTripInfo } from "../helper";

export default function _Form({
  initData,
  btnRef,
  saveHandler,
  resetBtnRef,
  updateRowDto,
  tripInfoData
}) {
  
  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={{
          ...initData,
          netPayable:
            +initData?.rentAmount +
            +initData?.additionalCost -
            +initData?.deductionCost,
        }}
        // validationSchema={validationSchema}
        onSubmit={(values, { setSubmitting, resetForm }) => {
          saveHandler(values, () => {
            resetForm(initData);
          });
        }}
      >
        {({
          handleSubmit,
          resetForm,
        }) => (
          <>
            <Form className="form form-label-right">
              <div className="col-md-12 table-responsive">
                <table className="table table-striped table-bordered global-table">
                  <thead>
                    <tr>
                      <th>SL</th>
                      <th>Route Name</th>
                      <th>Transport Zone Name</th>
                      <th style={{ width: "150px" }}>Sales Order Code</th>
                      <th style={{ width: "150px" }}>Delivery Code</th>
                      <th style={{ width: "150px" }}>Shipment Code</th>
                      <th style={{ width: "150px" }}>Quantity</th>
                      <th style={{ width: "150px" }}>Total Cost</th>
                      <th style={{ width: "100px" }}>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {tripInfoData?.map((item, index) => (
                      <tr key={index}>
                        <td> {index + 1}</td>
                        <td>
                          <div className="pl-2">
                            {item?.routeName}
                          </div>
                        </td>
                        <td>
                          <div className="pl-2">
                            {item?.transportZoneName}
                          </div>
                        </td>
                        <td>
                          <div className="pl-2">
                            {item?.salesOrderCode}
                          </div>
                        </td>
                        <td>
                          <div className="pl-2">
                            {item?.deliveryCode}
                          </div>
                        </td>
                        <td>
                          <div className="pl-2">
                            {item?.shipmentCode}
                          </div>
                        </td>
                        <td>
                          <div className="pl-2">
                            {item?.quantity}
                          </div>
                        </td>

                        <td>
                          <IInput
                            value={item?.totalCost}
                            name="totalCost"
                            type="number"
                            min={1}
                            onChange={(e) => {
                              updateRowDto(index, e.target.value);
                            }}
                          />
                        </td>

                        <td>
                          <div className="pl-2">
                            <button
                              type="button"
                              onClick={() => {
                                editTripInfo(
                                  {
                                    "tripId": item?.tripId,
                                    "totalCost": item?.totalCost
                                  }
                                );
                              }}
                              className="btn btn-primary"
                            >
                              update
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <button
                type="submit"
                style={{ display: "none" }}
                ref={btnRef}
                onSubmit={() => handleSubmit()}
              ></button>

              <button
                type="reset"
                style={{ display: "none" }}
                ref={resetBtnRef}
                onSubmit={() => resetForm(initData)}
              ></button>
            </Form>
          </>
        )}
      </Formik>
    </>
  );
}
