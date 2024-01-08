import { Form, Formik } from "formik";
import React, { useEffect, useState } from "react";
import { shallowEqual, useSelector } from "react-redux";
import { _fixedPoint } from "../../../../_helper/_fixedPoint";
import { _todayDate } from "../../../../_helper/_todayDate";
import FormikInput from "../../../../chartering/_chartinghelper/common/formikInput";
import { GetSalesContractInfoApi } from "../_redux/Actions";
import Loading from "./../../../../_helper/_loading";
const initData = {
  fromDate: _todayDate(),
  toDate: _todayDate(),
};
function SalesContractInfo() {
  const [loading, setLoading] = useState(false);
  let { profileData, selectedBusinessUnit } = useSelector(
    (state) => {
      return {
        profileData: state.authData.profileData,
        selectedBusinessUnit: state.authData.selectedBusinessUnit,
      };
    },
    { shallowEqual }
  );
  const [rowDto, setRowDto] = useState([]);

  useEffect(() => {
    if (profileData?.accountId && selectedBusinessUnit?.value) {
      viewHandle(initData);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profileData, selectedBusinessUnit]);

  const viewHandle = (values) => {
    GetSalesContractInfoApi(
      profileData?.accountId,
      selectedBusinessUnit?.value,
      values?.fromDate,
      values?.toDate,
      setRowDto,
      setLoading,
      () => {}
    );
  };
  return (
    <div>
      <Formik enableReinitialize={true} initialValues={initData}>
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
            <Form className='form form-label-right'>
              <div className='row mt-2 global-form'>
                <div className='col-lg-3'>
                  <label>From Date</label>
                  <FormikInput
                    value={values?.fromDate}
                    name='fromDate'
                    placeholder='From Date'
                    type='date'
                    errors={errors}
                    touched={touched}
                    onChange={(e) => {
                      setRowDto([]);
                      setFieldValue("fromDate", e.target.value);
                    }}
                    // disabled={true}
                  />
                </div>
                <div className='col-lg-3'>
                  <label>To Date</label>
                  <FormikInput
                    value={values?.toDate}
                    name='toDate'
                    placeholder='To Date'
                    type='date'
                    onChange={(e) => {
                      setRowDto([]);
                      setFieldValue("toDate", e.target.value);
                    }}
                    errors={errors}
                    touched={touched}
                  />
                </div>

                <div className='ml-3'>
                  <button
                    className='btn btn-primary'
                    onClick={(e) => {
                      setRowDto([]);
                      viewHandle(values);
                    }}
                    type='button'
                    style={{ marginTop: "15px" }}
                  >
                    View
                  </button>
                </div>
              </div>
            </Form>
            {loading && <Loading />}
            <div className='table-responsive'>
              <table className='table global-table'>
                <thead>
                  <tr>
                    <th className='p-0'>SL</th>
                    <th className='p-0'>Item Name</th>
                    <th className='p-0'>Challan Qty</th>
                    <th className='p-0'>Contact Qty</th>
                    <th className='p-0'>Order Qty</th>
                    <th className='p-0'>UnDelivery Qty</th>
                  </tr>
                </thead>
                <tbody>
                  {rowDto?.map((item, index) => (
                    <tr key={index}>
                      <td> {index + 1} </td>
                      <td className=''>{item?.strItemName}</td>
                      <td className='text-right'>
                        {_fixedPoint(item?.numChallanQnt)}
                      </td>
                      <td className='text-right'>
                        {_fixedPoint(item?.numContactQuantity)}
                      </td>
                      <td className='text-right'>
                        {_fixedPoint(item?.numOrderQuantity)}
                      </td>
                      <td className='text-right'>
                        {_fixedPoint(item?.numUndeliveryQnt)}
                      </td>
                    </tr>
                  ))}
                  <tr>
                    <td colSpan='2' className='text-right'>
                      {" "}
                      <b>Total</b>{" "}
                    </td>
                    <td className='text-right'>
                      <b>
                        {_fixedPoint(
                          rowDto?.reduce(
                            (acc, cur) => acc + cur?.numChallanQnt,
                            0
                          )
                        )}
                      </b>
                    </td>
                    <td className='text-right'>
                      <b>
                        {_fixedPoint(
                          rowDto?.reduce(
                            (acc, cur) => acc + cur?.numContactQuantity,
                            0
                          )
                        )}
                      </b>
                    </td>
                    <td className='text-right'>
                      <b>
                        {_fixedPoint(
                          rowDto?.reduce(
                            (acc, cur) => acc + cur?.numOrderQuantity,
                            0
                          )
                        )}
                      </b>
                    </td>
                    <td className='text-right'>
                      <b>
                        {_fixedPoint(
                          rowDto?.reduce(
                            (acc, cur) => acc + cur?.numUndeliveryQnt,
                            0
                          )
                        )}
                      </b>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </>
        )}
      </Formik>
    </div>
  );
}

export default SalesContractInfo;
