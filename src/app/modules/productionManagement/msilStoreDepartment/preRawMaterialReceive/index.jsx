import { Form, Formik } from 'formik';
import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import PaginationTable from '../../../chartering/_chartinghelper/_tablePagination';
import useAxiosGet from '../../../_helper/customHooks/useAxiosGet';
import { _dateFormatter } from '../../../_helper/_dateFormate';
import IEdit from '../../../_helper/_helperIcons/_edit';
import InputField from '../../../_helper/_inputField';
import Loading from '../../../_helper/_loading';
import NewSelect from '../../../_helper/_select';
import { ITable } from '../../../_helper/_table';
import { _timeFormatter } from '../../../_helper/_timeFormatter';
import { _todayDate } from '../../../_helper/_todayDate';

const initData = {
  fromDate: _todayDate(),
  toDate: _todayDate(),
};
export default function PreRawMaterialReceive() {
  const [pageNo, setPageNo] = useState(0);
  const [pageSize, setPageSize] = useState(15);
  const [landigData, getlandingData, lodar] = useAxiosGet();
  const history = useHistory();
  const setPositionHandler = (pageNo, pageSize, values) => {
    getlandingData(
      `/mes/MSIL/GetPreRawMaterialReceiveLanding?FromDate=${values?.fromDate}&ToDate=${values?.toDate}&pageNumber=${pageNo}&pageSize=${pageSize}`
    );
  };

  return (
    <div>
      <ITable
        link="/production-management/msil-Store/PreRawMaterialReceive/create"
        title="Pre Raw Material Receive"
      >
        <Formik enableReinitialize={true} initialValues={initData}>
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
              <Form className="form form-label-right">
                {lodar && <Loading />}
                <div className="form-group row global-form">
                  <div className="col-lg-3">
                    <InputField
                      value={values?.fromDate}
                      label="From Date"
                      name="fromDate"
                      type="date"
                    />
                  </div>
                  <div className="col-lg-3">
                    <InputField
                      value={values?.toDate}
                      label="To Date"
                      name="toDate"
                      type="date"
                      min={values?.fromDate}
                    />
                  </div>

                  <div style={{ marginTop: '15px' }} className="col-lg-1">
                    <button
                      type="button"
                      onClick={() => {
                        getlandingData(
                          `/mes/MSIL/GetPreRawMaterialReceiveLanding?FromDate=${values?.fromDate}&ToDate=${values?.toDate}&pageNumber=${pageNo}&pageSize=${pageSize}`
                        );
                      }}
                      className="btn btn-primary mt-1"
                      disabled={!values?.fromDate || !values?.toDate}
                    >
                      Show
                    </button>
                  </div>
                </div>

                <div style={{ marginTop: '15px' }}>
                  <div>
                    <div className="table-responsive">
                      <table className="table table-striped table-bordered global-table">
                        <thead>
                          <tr>
                            <th style={{ width: '50px' }}>SL</th>
                            <th>Receive Date</th>
                            <th>Supplier Name</th>
                            <th>Truck Number</th>
                            <th>Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {landigData?.data?.length > 0 &&
                            landigData?.data?.map((item, index) => (
                              <tr key={index}>
                                <td>{index + 1}</td>
                                <td className="text-center">
                                  {_dateFormatter(item?.dteReceiveDate)}
                                </td>
                                <td>{item?.strSupplierName}</td>
                                <td className="text-center">
                                  {item?.strTruckNumber}
                                </td>
                                <td className="text-center">
                                  <IEdit
                                    onClick={() => {
                                      history.push({
                                        pathname: `/production-management/msil-Store/PreRawMaterialReceive/edit/${item?.intPreRawMaterialReceiveId}`,
                                        state: { ...item },
                                      });
                                    }}
                                  />
                                </td>
                              </tr>
                            ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                  {landigData?.data?.length > 0 && (
                    <PaginationTable
                      count={landigData.totalCount}
                      setPositionHandler={setPositionHandler}
                      paginationState={{
                        pageNo,
                        setPageNo,
                        pageSize,
                        setPageSize,
                      }}
                      values={values}
                    />
                  )}
                </div>
              </Form>
            </>
          )}
        </Formik>
      </ITable>
    </div>
  );
}
