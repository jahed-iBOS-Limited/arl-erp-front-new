import { Formik } from "formik";
import React, { useEffect } from "react";
import ICustomCard from "../../../../../_helper/_customCard";
import Loading from "../../../../../_helper/_loading";
import NewSelect from "../../../../../_helper/_select";
import { getBusinessUnitDDL_api } from "../../helper";
import { shallowEqual, useSelector } from "react-redux";
const initData = {};
export default function POPreview({ clickRowData }) {
  const {
    profileData: { accountId: accId, userId },
    selectedBusinessUnit: { value: buId },
  } = useSelector((state) => state?.authData, shallowEqual);
  const [rowDto, setRowDto] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const formikRef = React.useRef(null);
  const [businessUnitDDL, setBusinessUnitDDL] = React.useState([]);

  useEffect(() => {
    getBusinessUnitDDL_api(userId, accId, (resData) => {
      setBusinessUnitDDL(resData);
      const find = resData?.find((itm) => itm?.value === buId);
      if (find) {
        if (formikRef.current) {
          formikRef.current.setFieldValue("businessUnit", find);
        }
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [accId]);

  useEffect(() => {
    if (useEffect?.length > 0) {
      setRowDto(clickRowData);
    } else {
      setRowDto([]);
    }
  }, [clickRowData]);
  const saveHandler = async (values, cb) => {};
  return (
    <>
      <>
        {loading && <Loading />}
        <Formik
          innerRef={formikRef}
          validationSchema={{}}
          enableReinitialize={true}
          initialValues={initData}
          onSubmit={(values, { setSubmitting, resetForm }) => {
            saveHandler(values, () => {
              resetForm(initData);
              setRowDto([]);
            });
          }}
        >
          {({
            values,
            setFieldValue,
            touched,
            errors,
            resetForm,
            handleSubmit,
            setValues,
          }) => (
            <>
              <ICustomCard title={"PO Preview"}>
                <div className='row global-form my-3'>
                  <div className='col-lg-3'>
                    <NewSelect
                      options={businessUnitDDL || []}
                      name='businessUnit'
                      onChange={(valueOption) => {
                        setFieldValue("businessUnit", valueOption);
                      }}
                      placeholder='Business Unit'
                      value={values?.businessUnit}
                      errors={errors}
                      touched={touched}
                    />
                  </div>
                </div>

                <div className='table-responsive'>
                  <table className='table table-striped table-bordered global-table'>
                    <thead>
                      <tr>
                        <th>SL</th>
                        <th>Category</th>
                        <th>Expense Particulars</th>
                        <th
                          style={{
                            width: "150px",
                          }}
                        >
                          Estimated Amount
                        </th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {rowDto?.map((item, index) => {
                        return (
                          <tr key={index}>
                            <td className='text-center'> {index + 1}</td>
                            <td>{item?.category}</td>
                            <td>{item?.particularName}</td>
                            <td className='text-right'>
                              {item?.estimatedAmount}
                            </td>

                            <td></td>
                          </tr>
                        );
                      })}
                      <tr>
                        <td colSpan={3}>
                          <b>Total</b>
                        </td>

                        <td className='text-right'>
                          <b>
                            {rowDto?.reduce(
                              (acc, cv) => acc + (+cv?.estimatedAmount || 0),
                              0
                            )}
                          </b>
                        </td>
                        <td>
                          <button
                            type='button'
                            className='btn btn-primary px-3 py-2 ml-2'
                          >
                            Create PO
                          </button>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </ICustomCard>
            </>
          )}
        </Formik>
      </>
    </>
  );
}
