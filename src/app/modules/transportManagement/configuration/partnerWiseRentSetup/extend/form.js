/* eslint-disable react-hooks/exhaustive-deps */
import { Form, Formik } from "formik";
import React, { useEffect, useState } from "react";
import InputField from "../../../../_helper/_inputField";
import NewSelect from "../../../../_helper/_select";
import { getDDL } from "../helper";
import IDelete from "./../../../../_helper/_helperIcons/_delete";

export default function _Form({
  initData,
  btnRef,
  saveHandler,
  resetBtnRef,
  disableHandler,
  profileData,
  selectedBusinessUnit,
  isEdit,
  tableDataGetFunc,
  rowDto,
  setRowDto,
  addItemToTheGrid,
  remover,
}) {
  // All DDL State
  const [shippointDDL, setShippointDDL] = useState([]);
  const [vehicleDDL, setVehicleDDL] = useState([]);

  useEffect(() => {
    if (selectedBusinessUnit?.value && profileData?.accountId) {
      // Get Shippoint DDL
      getDDL(
        `/wms/ShipPoint/GetShipPointDDL?accountId=${profileData?.accountId}&businessUnitId=${selectedBusinessUnit?.value}`,
        setShippointDDL
      );
      // Get Vehicle DDL
      getDDL(
        `/tms/TransportMgtDDL/GetVehicleCapacityDDL`,
        setVehicleDDL
      );
    }
  }, []);

  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={{ ...initData, additionalRent: 0 }}
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
          values,
          errors,
          touched,
          setFieldValue,
          isValid,
        }) => (
          <>
            {/* {disableHandler(!isValid)} */}
            <Form className='form form-label-right'>
              <div className=''>
                <div className='form-group row global-form'>
                  <div className='col-lg-4'>
                    <NewSelect
                      name='shipPoint'
                      options={shippointDDL || []}
                      value={values?.shipPoint}
                      label='Shippoint'
                      onChange={(valueOption) => {
                        setFieldValue("shipPoint", valueOption);
                      }}
                      placeholder='Shippoint'
                      errors={errors}
                      touched={touched}
                      // isDisabled={isEdit}
                    />
                  </div>
                  <div className='col-lg-4'>
                    <NewSelect
                      name='vehicle'
                      options={vehicleDDL || []}
                      value={values?.vehicle}
                      label='Vehicle Capacity'
                      onChange={(valueOption) => {
                        setFieldValue("vehicle", valueOption);
                      }}
                      placeholder='Vehicle Capacity'
                      errors={errors}
                      touched={touched}
                      // isDisabled={isEdit}
                    />
                  </div>
                  <div className='col-lg-4'>
                    <label>Rent</label>
                    <InputField
                      name='rent'
                      value={values?.rent}
                      placeholder='Rent'
                      type='number'
                    />
                  </div>
                  <div className='col-lg-4'>
                    <label>Additional Rent</label>
                    <InputField
                      name='additionalRent'
                      value={values?.additionalRent}
                      placeholder='Additional Rent'
                      type='number'
                    />
                  </div>
                  <div className='col-lg-4'>
                    <label>Reason</label>
                    <InputField
                      name='reason'
                      value={values?.reason}
                      placeholder='Reason'
                      type='text'
                    />
                  </div>
                  <div className='col-lg-2 mt-5'>
                    <button
                      className='btn btn-primary pt-2 pb-2'
                      type='button'
                      onClick={() => {
                        addItemToTheGrid(values);
                        setFieldValue("vehicle", "");
                        setFieldValue("rent", "");
                        setFieldValue("additionalRent", "");
                        setFieldValue("reason", "");
                      }}
                      disabled={
                        !values?.shipPoint ||
                        !values?.vehicle ||
                        !values?.rent 
                      }
                    >
                      Add
                    </button>
                  </div>
                </div>
                {/* {values?.itemLists?.length >= 0 && ( */}
                <div className="table-responsive">
                <table className='table table-striped table-bordered global-table'>
                  <thead>
                    <tr>
                      <th style={{ width: "35px" }}>SL</th>
                      <th>Shippoint</th>
                      <th>Vehicle Capacity</th>
                      <th>Rent</th>
                      <th>Additional Rent</th>
                      <th>Reason</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rowDto.map((itm, index) => (
                      <tr key={index} className='text-center'>
                        <td className='text-center'>{index + 1}</td>
                        <td>{itm.shippointName}</td>
                        <td>{itm.vehicheCapacity}</td>
                        <td>{itm.numRentAmount}</td>
                        <td>
                          {itm.numAdditionalRentAmount ||
                            itm?.numAditionalRentAmount ||
                            0}
                        </td>
                        <td>{itm.strReason}</td>
                        <td className='text-center'>
                          <IDelete remover={remover} id={index} />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                </div>
                {/* // )} */}
              </div>

              <button
                type='submit'
                style={{ display: "none" }}
                ref={btnRef}
                onSubmit={() => handleSubmit()}
              ></button>

              <button
                type='reset'
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

// [
//   {
//     intRowId: 0,
//     intAccountId: 2,
//     intBusinessUnitid: 164,
//     intPartnerId: 1,
//     intshippointId: 47,
//     intVehicleId: 112,
//     numRentAmount: 3,
//     numAditionalRentAmount: 4,
//     strReason: "test",
//     dteLastActionDateTime: "2021-04-26T04:46:00.991Z",
//     dteServerDateTime: "2021-04-26T04:46:00.991Z",
//     isActive: true,
//   },
// ];
