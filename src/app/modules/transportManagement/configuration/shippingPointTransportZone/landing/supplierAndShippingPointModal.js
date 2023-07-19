import Axios from "axios";
import { Form, Formik } from "formik";
import React, { useState } from "react";
import { shallowEqual, useSelector } from "react-redux";
import { toast } from "react-toastify";
import * as Yup from "yup";
import { ModalProgressBar } from "../../../../../../_metronic/_partials/controls";
import {
  Card,
  CardBody,
  CardHeader,
  CardHeaderToolbar,
} from "../../../../../../_metronic/_partials/controls/Card";
import SearchAsyncSelect from "../../../../_helper/SearchAsyncSelect";
import FormikError from "../../../../_helper/_formikError";
import IDelete from "../../../../_helper/_helperIcons/_delete";
import Loading from "../../../../_helper/_loading";
import NewSelect from "../../../../_helper/_select";
import { createAndUpdateSupplierByShippoint } from "../helper";
const validationSchema = Yup.object().shape({});
const initData = {
  updateType: "",
  vehicle: "",
  supplier: "",
  reasons: "",
};

function SupplierAndShippingPointModal({
  landingCB,
  shipPointDDL,
}) {
  const [loading, setLoading] = useState(false);
  const [rowData, setRowData] = useState([]);
  // Get user profile data from store
  const { profileData, selectedBusinessUnit } = useSelector((state) => {
    return {
      profileData: state?.authData?.profileData,
      selectedBusinessUnit: state?.authData?.selectedBusinessUnit,
    };
  }, shallowEqual);

  const saveHandler = (values, cb) => {
    if (rowData.length === 0) {
      return toast.warn("Please add at least one row");
    }
    const payload = rowData?.map((itm) => {
      return {
        ...itm,
        insertBy: profileData?.userId,
        unitId: selectedBusinessUnit?.value,
        id: 0,
      };
    });

    createAndUpdateSupplierByShippoint(payload, setLoading, () => {
      landingCB();
      cb();
    });
  };

  return (
    <>
      {loading && <Loading />}
      <div>
        <Formik
          enableReinitialize={true}
          initialValues={initData}
          validationSchema={validationSchema}
          onSubmit={(values, { setSubmitting, resetForm }) => {
            saveHandler(values, () => {
              resetForm(initData);
              setRowData([]);
            });
          }}
        >
          {({ values, setFieldValue, touched, errors, handleSubmit }) => (
            <Card>
              {true && <ModalProgressBar />}
              <CardHeader title={"Supplier & Shipping Point"}>
                <CardHeaderToolbar>
                  <button
                    onClick={handleSubmit}
                    className='btn btn-primary ml-2'
                    type='submit'
                  >
                    Save
                  </button>
                </CardHeaderToolbar>
              </CardHeader>
              <CardBody>
                <>
                  <Form>
                    <div className='row global-form mt-0'>
                      <div className='col-lg-3'>
                        <label>Select Supplier</label>
                        <SearchAsyncSelect
                          selectedValue={values?.supplier}
                          handleChange={(valueOption) => {
                            setFieldValue("supplier", valueOption);
                            setFieldValue("shipPoint", "");
                          }}
                          loadOptions={(v) => {
                            if (v?.length < 2) return [];
                            return Axios.get(
                              `/wms/Delivery/GetSupplierByShipPointDDl?businessUnitId=${
                                selectedBusinessUnit?.value
                              }&shippointId=${0}&searchTerm=${v}`
                            ).then((res) => {
                              return res?.data || [];
                            });
                          }}
                          placeholder='Select Supplier'
                        />
                        <FormikError
                          errors={errors}
                          name='supplier'
                          touched={touched}
                        />
                      </div>
                      <div className='col-lg-3'>
                        <NewSelect
                          name='shipPoint'
                          options={shipPointDDL || []}
                          value={values?.shipPoint}
                          label='Ship Point'
                          onChange={(valueOption) => {
                            setFieldValue("shipPoint", valueOption);
                          }}
                          errors={errors}
                          touched={touched}
                        />
                      </div>
                      <div className='col-lg-3'>
                        <button
                          type='button'
                          style={{ marginTop: "17px" }}
                          disabled={!values?.supplier || !values?.shipPoint}
                          onClick={() => {

                            // duplicate check same supplier and ship point
                            const duplicateCheck = rowData?.filter(
                              (itm) =>
                                itm?.supplierId === values?.supplier?.value &&
                                itm?.shipPointId === values?.shipPoint?.value
                            );
                            if (duplicateCheck?.length > 0) {
                              return toast.warn(
                                "Supplier and Ship Point already added"
                              );
                            }


                            setRowData([
                              ...rowData,
                              {
                                supplierName: values?.supplier?.label || "",
                                shipPointName: values?.shipPoint?.label || "",
                                shipPointId: values?.shipPoint?.value   || 0,
                                supplierId: values?.supplier?.value || 0,
                              },
                            ]);
                            setFieldValue("shipPoint", "");
                          }}
                          className='btn btn-primary'
                        >
                          Add
                        </button>
                      </div>
                    </div>

                    <div className='table-responsive'>
                      <table className='table table-striped table-bordered global-table'>
                        <thead>
                          <tr>
                            <th>SL</th>
                            <th>Supplier Name</th>
                            <th>Ship Point Name</th>
                            <th>Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {rowData?.map((item, index) => {
                            return (
                              <tr key={index}>
                                <td className='text-center'> {index + 1}</td>
                                <td>{item?.supplierName}</td>
                                <td>{item?.shipPointName}</td>
                                <td className='text-center'>
                                  <span
                                    onClick={() => {
                                      setRowData(
                                        rowData.filter(
                                          (itm, idx) => idx !== index
                                        )
                                      );
                                    }}
                                  >
                                    <IDelete id={index} />
                                  </span>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </Form>
                </>
              </CardBody>
            </Card>
          )}
        </Formik>
      </div>
    </>
  );
}

export default SupplierAndShippingPointModal;
