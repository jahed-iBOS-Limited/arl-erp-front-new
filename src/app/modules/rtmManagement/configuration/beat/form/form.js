/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import * as Yup from "yup";
import { Formik, Form } from "formik";
import InputField from "../../../../_helper/_inputField";
import NewSelect from "./../../../../_helper/_select";
import { getLandingDataForCreate } from "../helper";
import PaginationTable from "./../../../../_helper/_tablePagination";
import { _todayDate } from "./../../../../_helper/_todayDate";
import { useLocation } from "react-router-dom";

const validationSchema = Yup.object().shape({
  beatName: Yup.string().required("Market Name is required"),
  territory: Yup.object().shape({
    value: Yup.string().required("Territory Name  is required"),
    label: Yup.string().required("Territory Name  is required"),
  }),
  route: Yup.object().shape({
    value: Yup.string().required("Route Name  is required"),
    label: Yup.string().required("Route Name  is required"),
  }),
});

function _Form({
  initData,
  btnRef,
  saveHandler,
  profileData,
  selectedBusinessUnit,
  setDisabled,
  isEdit,
  resetBtnRef,
  territoryNameDDL,
  routeNameDDL,
}) {
  const { state: headerData } = useLocation();
  const [gridData, setGridData] = useState();

  //paginationState
  const [pageNo, setPageNo] = React.useState(0);
  const [pageSize, setPageSize] = React.useState(15);

  useEffect(() => {
    getLandingDataForCreate(
      profileData.userId,
      _todayDate(),
      setGridData,
      pageNo,
      pageSize
    );
  }, [profileData?.accountId, selectedBusinessUnit?.value]);

  //setPositionHandler
  const setPositionHandler = (pageNo, pageSize) => {
    getLandingDataForCreate(
      profileData.userId,
      _todayDate(),
      setGridData,
      pageNo,
      pageSize
    );
  };

  return (
    <Formik
      enableReinitialize={true}
      initialValues={
        isEdit
          ? initData
          : {
              ...initData,
              territory:
                headerData?.territory?.value === 0 ? "" : headerData?.territory,
              route: headerData?.route?.value === 0 ? "" : headerData?.route,
            }
      }
      validationSchema={validationSchema}
      onSubmit={(values, { setSubmitting, resetForm }) => {
        saveHandler(values, () => {
          if (!isEdit) {
            resetForm(initData);
          }
          getLandingDataForCreate(
            profileData.userId,
            _todayDate(),
            setGridData,
            pageNo,
            pageSize
          );
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
          <Form className='global-form form form-label-right'>
            <div className='form-group row'>
              <div className='col-lg-3'>
                <NewSelect
                  name='territory'
                  options={territoryNameDDL || []}
                  value={values?.territory}
                  label='Territory Name'
                  onChange={(valueOption) => {
                    setFieldValue("territory", valueOption);
                  }}
                  placeholder='Territory Name'
                  errors={errors}
                  touched={touched}
                />
              </div>
              <div className='col-lg-3'>
                <NewSelect
                  name='route'
                  options={routeNameDDL || []}
                  value={values?.route}
                  label='Route Name'
                  onChange={(valueOption) => {
                    setFieldValue("route", valueOption);
                  }}
                  placeholder='Route Name'
                  errors={errors}
                  touched={touched}
                />
              </div>
              <div className='col-lg-3'>
                <label>Market Name</label>
                <InputField
                  value={values?.beatName}
                  name='beatName'
                  placeholder='Market Name'
                  type='text'
                />
              </div>
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

          {gridData?.data?.length > 0 && (
            <div>
              <h5 className='mt-4'>
                {profileData?.userName} your created data for today
              </h5>
              <table className='table table-striped table-bordered mt-3 bj-table bj-table-landing'>
                <thead>
                  <tr>
                    <th>SL</th>
                    <th>Market Name</th>
                    <th>Route Name</th>
                    <th>Territory Name</th>
                  </tr>
                </thead>
                <tbody>
                  {gridData?.data?.map((item, index) => {
                    return (
                      <tr key={index}>
                        <td style={{ width: "30px" }} className='text-center'>
                          {index + 1}
                        </td>
                        <td>
                          <span className='pl-2'>{item?.beatName}</span>
                        </td>
                        <td>
                          <span className='pl-2'>{item?.routeName}</span>
                        </td>
                        <td>
                          <span className='pl-2'>{item?.territoryName}</span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>

              {/* Pagination Code */}
              {gridData?.data?.length > 0 && (
                <PaginationTable
                  count={gridData?.totalCount}
                  setPositionHandler={setPositionHandler}
                  paginationState={{ pageNo, setPageNo, pageSize, setPageSize }}
                />
              )}
            </div>
          )}
        </>
      )}
    </Formik>
  );
}

export default _Form;
