import { Form, Formik } from "formik";
import React, { useEffect, useState } from "react";
import { ISelect } from "../../../../_helper/_inputDropDown";
import Loading from "../../../../_helper/_loading";
import { ShippointChange } from "../helper";
import {
  Card,
  CardBody,
  CardHeader,
  CardHeaderToolbar,
  ModalProgressBar,
} from "./../../../../../../_metronic/_partials/controls";
import useAxiosGet from "../../../../_helper/customHooks/useAxiosGet";
import { shallowEqual, useSelector } from "react-redux";

export function ChallanModal({
  ShippointDDL,
  tableRowData,
  selectedBusinessUnit,
  cb,
}) {
  const { profileData } = useSelector((state) => {
    return state.authData;
  }, shallowEqual);
  const [loading, setLoading] = useState(false);
  const [warehouseDDL, getWarehouseDDL, , setWarehouseDDL] = useAxiosGet();

  useEffect(() => {
    if (ShippointDDL[0]?.value) {
      getWarehouseDDL(
        `/wms/ShipPointWarehouse/GetShipPointWarehouseDDL?AccountId=${profileData?.accountId}&BusinessUnitId=${selectedBusinessUnit?.value}&ShipPointId=${ShippointDDL[0]?.value}`
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ShippointDDL]);

  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={{
          pgiShippoint: ShippointDDL[0] || "",
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
            <Card>
              {true && <ModalProgressBar />}
              <CardHeader title={"Challan Shippoint Transfer update"}>
                <CardHeaderToolbar>
                  <button
                    disabled={
                      !values?.pgiShippoint?.value || !values?.warehouse?.value
                    }
                    onClick={() => {
                      ShippointChange(
                        tableRowData?.intDeliveryId,
                        values?.pgiShippoint?.value,
                        values?.pgiShippoint?.label,
                        values?.warehouse?.value,
                        values?.warehouse?.label,
                        selectedBusinessUnit?.value,
                        setLoading,
                        cb
                      );
                    }}
                    className="btn btn-primary"
                  >
                    Save
                  </button>
                </CardHeaderToolbar>
              </CardHeader>
              <CardBody>
                <Form className="form form-label-right">
                  <div className="row">
                    <div className="col-lg-12">
                      <div className="row global-form">
                        <>
                          {values?.warehouse?.label && (
                            <div className="col-lg-12">
                              <p
                                style={{
                                  fontSize: "16px",
                                  backgroundColor: "yellow",
                                }}
                                className="text-center text-bold"
                              >
                                {values?.warehouse?.label}
                              </p>
                            </div>
                          )}
                          <div className="col-lg-3">
                            <ISelect
                              label="Select Shippoint"
                              options={ShippointDDL}
                              value={values.pgiShippoint}
                              name="pgiShippoint"
                              setFieldValue={setFieldValue}
                              dependencyFunc={(id) => {
                                setFieldValue("warehouse", "");
                                setWarehouseDDL([]);
                                if (id) {
                                  getWarehouseDDL(
                                    `/wms/ShipPointWarehouse/GetShipPointWarehouseDDL?AccountId=${profileData?.accountId}&BusinessUnitId=${selectedBusinessUnit?.value}&ShipPointId=${id}`
                                  );
                                }
                              }}
                              errors={errors}
                              touched={touched}
                            />
                          </div>
                          <div className="col-lg-3">
                            <ISelect
                              label="Select Warehouse"
                              options={warehouseDDL}
                              value={values.warehouse}
                              name="warehouse"
                              setFieldValue={setFieldValue}
                              errors={errors}
                              touched={touched}
                            />
                          </div>
                        </>
                      </div>
                    </div>
                  </div>
                </Form>

                {/* Table Start */}
                {loading && <Loading />}
              </CardBody>
            </Card>
          </>
        )}
      </Formik>
    </>
  );
}
