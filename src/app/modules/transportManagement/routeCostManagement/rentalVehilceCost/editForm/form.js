import { Form, Formik } from "formik";
import React from "react";
import InputField from "../../../../_helper/_inputField";

export default function _Form({
  saveHandler,
  tripInfoData,
  setTripInfoData,
}) {
  return (
    <>
      <Formik
        enableReinitialize={true}
        onSubmit={(values) => {
          saveHandler(values);
        }}
        initialValues={{}}
      >
        {({ handleSubmit }) => (
          <>
            <Form className="form form-label-right">
              <div className="col-md-12 table-responsive">
                <table className="table table-striped table-bordered global-table">
                  <thead>
                    <tr>
                      <th>Route Name</th>
                      <th>Transport Zone Name</th>
                      <th>Sales Order Code</th>
                      <th>Delivery Code</th>
                      <th>Shipment Code</th>
                      <th>Quantity</th>
                      <th>Total Cost</th>
                      <th>Additional Cost</th>
                      <th>Deduction Cost</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>
                        <div className="pl-2">{tripInfoData?.routeName}</div>
                      </td>
                      <td>
                        <div className="pl-2">
                          {tripInfoData?.transportZoneName}
                        </div>
                      </td>
                      <td>
                        <div className="pl-2">
                          {tripInfoData?.salesOrderCode}
                        </div>
                      </td>
                      <td>
                        <div className="pl-2">{tripInfoData?.deliveryCode}</div>
                      </td>
                      <td>
                        <div className="pl-2">{tripInfoData?.shipmentCode}</div>
                      </td>
                      <td>
                        <div className="pl-2">{tripInfoData?.quantity}</div>
                      </td>

                      <td>
                        <InputField
                          value={tripInfoData?.totalCost}
                          name="totalCost"
                          type="number"
                          min={1}
                          onChange={(e) => {
                            setTripInfoData({
                              ...tripInfoData,
                              totalCost: Number(e.target.value),
                            });
                          }}
                        />
                      </td>
                      <td>
                        <InputField
                          value={tripInfoData?.additionalCost}
                          name="additionalCost"
                          type="number"
                          min={1}
                          onChange={(e) => {
                            setTripInfoData({
                              ...tripInfoData,
                              additionalCost: Number(e.target.value),
                            });
                          }}
                        />
                      </td>
                      <td>
                        <InputField
                          value={tripInfoData?.deductionCost}
                          name="deductionCost"
                          type="number"
                          min={1}
                          onChange={(e) => {
                            setTripInfoData({
                              ...tripInfoData,
                              deductionCost: Number(e.target.value),
                            });
                          }}
                        />
                      </td>

                      <td>
                        <div className="pl-2">
                          <button
                            type="button"
                            onClick={() => handleSubmit()}
                            className="btn btn-primary"
                          >
                            update
                          </button>
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </Form>
          </>
        )}
      </Formik>
    </>
  );
}
