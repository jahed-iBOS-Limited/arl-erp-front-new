import React, { useState, useEffect } from "react";
import { Formik, Form } from "formik";
import { Modal } from "react-bootstrap";
import * as Yup from "yup";
import { useSelector } from "react-redux";
import { shallowEqual } from "react-redux";
import InputField from "./../../../_helper/_inputField";
import NewSelect from "./../../../_helper/_select";
import {
  GetShipPointDDLnotPermition_api,
  Shippointtransfer_api,
} from "./helper";
const initData = {
  existingShippoint: "",
  transferShippoint: "",
};

// Validation schema
const validationSchema = Yup.object().shape({
  transferShippoint: Yup.object().shape({
    label: Yup.string().required("Transfer to shippoint is required"),
    value: Yup.string().required("Transfer to shippoint is required"),
  }),
});

export default function OrderTransferViewForm({
  id,
  show,
  onHide,
  isShow,
  item,

  ordertableRow,
}) {
  const [isDisabled, setDisabled] = useState(true);
  const [shipPointDDL, setShipPointDDL] = useState([]);

  const saveHandler = async (values, cb) => {
    setDisabled(true);
    if (profileData?.accountId && selectedBusinessUnit?.value) {
      const payload = {
        salesOrderId: ordertableRow?.salesOrderId,
        shippointId: values?.transferShippoint?.value,
        shippointName: values?.transferShippoint?.label,
      };
      Shippointtransfer_api(payload, cb);
    } else {
      setDisabled(false);
    }
  };

  const disableHandler = (cond) => {
    setDisabled(cond);
  };

  let clearSalesInvoice = useSelector(
    (state) => {
      return {
        profileData: state.authData.profileData,
        selectedBusinessUnit: state.authData.selectedBusinessUnit,
      };
    },
    { shallowEqual }
  );

  let { profileData, selectedBusinessUnit } = clearSalesInvoice;

  useEffect(() => {
    if (selectedBusinessUnit?.value && profileData?.accountId) {
      GetShipPointDDLnotPermition_api(
        profileData?.accountId,
        selectedBusinessUnit?.value,
        setShipPointDDL
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profileData.accountId, selectedBusinessUnit.value]);

  return (
    <div className="clear_sales_invoice_View_Form">
      <div className="viewModal">
        <Formik
          enableReinitialize={true}
          initialValues={{
            ...initData,
            existingShippoint: ordertableRow?.shippointName,
          }}
          validationSchema={validationSchema}
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
            errors,
            touched,
            setFieldValue,
            isValid,
          }) => (
            <>
              {disableHandler(!isValid)}

              <Modal
                show={show}
                onHide={onHide}
                size="xl"
                aria-labelledby="example-modal-sizes-title-xl"
                className="clear_sales_invoice_View_Form"
              >
                <>
                  <Form className="form form-label-right">
                    <Modal.Header className="bg-custom">
                      <Modal.Title className="w-100">
                        <div className="d-flex justify-content-between px-4 py-2">
                          <div className="title">{"Order Transfer Create"}</div>
                          <div className="">
                            <button
                              type="reset"
                              className={"btn btn-light ml-2"}
                              onClick={() => {
                                resetForm(initData);
                              }}
                            >
                              <i className="fa fa-redo"></i>
                              Reset
                            </button>
                            <button
                              type="submit"
                              className={"btn btn-primary ml-2"}
                              disabled={isDisabled}
                            >
                              Save
                            </button>
                          </div>
                        </div>
                      </Modal.Title>
                    </Modal.Header>
                    <Modal.Body id="example-modal-sizes-title-xl">
                      <>
                        <div className="form-group row global-form">
                          <div className="col-lg-3">
                            <label>Existing Shippoint</label>
                            <InputField
                              value={values?.existingShippoint}
                              name="existingShippoint"
                              placeholder="Existing Shippoint</label>"
                              type="text"
                              disabled={true}
                            />
                          </div>
                          <div className="col-lg-3">
                            <NewSelect
                              name="transferShippoint"
                              options={shipPointDDL || []}
                              value={values?.transferShippoint}
                              label="Transfer to shippoint"
                              onChange={(valueOption) => {
                                setFieldValue("transferShippoint", valueOption);
                              }}
                              placeholder="Transfer to shippoint"
                              errors={errors}
                              touched={touched}
                            />
                          </div>
                        </div>
                      </>
                    </Modal.Body>
                    <Modal.Footer>
                      <div>
                        <button
                          type="button"
                          onClick={() => onHide()}
                          className="btn btn-light btn-elevate"
                        >
                          Cancel
                        </button>
                        <> </>
                      </div>
                    </Modal.Footer>
                  </Form>
                </>
              </Modal>
            </>
          )}
        </Formik>
      </div>
    </div>
  );
}
