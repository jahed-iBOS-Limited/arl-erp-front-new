import React, { useState } from 'react';
import Loading from '../../../../_helper/_loading';
import PaginationTable from '../../../../_helper/_tablePagination';

import { Form, Formik } from 'formik';
import { useHistory } from 'react-router-dom';
import {
  Card,
  CardBody,
  CardHeader,
  CardHeaderToolbar,
  ModalProgressBar,
} from '../../../../../../_metronic/_partials/controls';
import { getGridData } from '../../../../_helper/_commonApi';
import { _dateFormatter } from '../../../../_helper/_dateFormate';
import InputField from '../../../../_helper/_inputField';
import PaginationSearch from '../../../../_helper/_search';
import NewSelect from '../../../../_helper/_select';

export default function TableRow() {
  const [gridData] = useState({});
  const [loading] = useState(false);
  //paginationState
  const [pageNo, setPageNo] = useState(0);
  const [pageSize, setPageSize] = useState(15);

  const history = useHistory();

  //setPositionHandler
  const setPositionHandler = (pageNo, pageSize, values) => {
    getGridData();
  };

  const paginationSearchHandler = (searchValue, values) => {
    setPositionHandler(pageNo, pageSize, searchValue, values);
  };
  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={{
          lcNumber: '',
          privacyType: '',
          fromDate: _dateFormatter(new Date()),
          toDate: _dateFormatter(new Date()),
        }}
      >
        {({ errors, touched, setFieldValue, isValid, values }) => (
          <>
            <Card>
              <ModalProgressBar />
              <CardHeader title="Insurence Payment">
                <CardHeaderToolbar>
                  <button
                    onClick={() => {
                      history.push({
                        pathname: ``,
                        state: {},
                      });
                    }}
                    className="btn btn-primary"
                  >
                    Create
                  </button>
                </CardHeaderToolbar>
              </CardHeader>

              <CardBody>
                <Form className="form form-label-right">
                  {/* Header Start */}
                  <div className="global-form">
                    <div className="row">
                      <div className="col-lg-3">
                        <label>From</label>
                        <InputField
                          value={values?.fromDate}
                          name="fromDate"
                          placeholder="From Date"
                          type="date"
                        />
                      </div>
                      <div className="col-lg-3">
                        <label>To</label>
                        <InputField
                          value={values?.toDate}
                          name="toDate"
                          placeholder="To Date"
                          type="date"
                        />
                      </div>
                      <div className="col-lg-3">
                        <label>LC Number</label>
                        <InputField
                          value={values?.lcNumber}
                          name="lcNumber"
                          placeholder="LC Number"
                          type="text"
                        />
                      </div>

                      <div className="col-lg-3"></div>

                      <div className="col-lg-2 mt-4">
                        <label className="mr-3">
                          <InputField
                            type="radio"
                            name="privacyType"
                            checked={values?.privacyType === '1'}
                            className="mr-1 pointer"
                            style={{ position: 'relative', top: '2px' }}
                            onChange={(valueOption) => {
                              setFieldValue('privacyType', '1');
                            }}
                          />
                          Unit
                        </label>
                        <label>
                          <InputField
                            type="radio"
                            name="privacyType"
                            checked={values?.privacyType === '2'}
                            className="mr-1 pointer"
                            style={{ position: 'relative', top: '2px' }}
                            onChange={(e) => {
                              setFieldValue('privacyType', '2');
                            }}
                          />
                          Agent
                        </label>
                      </div>

                      <div className="col-lg-3  mt-4">
                        <NewSelect
                          name="privicyType"
                          options={[]}
                          value={'developer is working'}
                          onChange={(valueOption) => {
                            setFieldValue('privicyType', valueOption);
                          }}
                          errors={errors}
                          touched={touched}
                        />
                      </div>

                      <div className="col-lg-3">
                        <button
                          className="btn btn-primary"
                          // disabled={}
                          style={{ marginTop: '15px' }}
                          type="button"
                          onClick={() => {}}
                        >
                          Show
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="row cash_journal">
                    {loading && <Loading />}
                    <div className="col-lg-12">
                      <PaginationSearch
                        placeholder="Search Position/Emp. Type"
                        paginationSearchHandler={paginationSearchHandler}
                        values={values}
                      />
                      <div className="react-bootstrap-table table-responsive">
                        <table className="table table-striped table-bordered mt-3 bj-table bj-table-landing">
                          <thead>
                            <tr>
                              <th style={{ width: '20px' }}>SL</th>
                              <th>LC Number</th>
                              <th style={{ width: '50px' }}>LC Date</th>
                              <th style={{ width: '90px' }}>Shipped By</th>
                              <th>Cover Note No</th>
                              <th style={{ width: '50px' }}>CN Date</th>
                              <th>LC/PI Amount</th>
                              <th>CN Currency</th>
                              <th>Insured BDT</th>
                              <th>CN PO Amount</th>
                              <th>(%) of Total</th>
                            </tr>
                          </thead>
                          <tbody>
                            {gridData?.data?.length > 0 &&
                              gridData?.data?.map((item, index) => (
                                <tr key={index}></tr>
                              ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                    {gridData?.data?.length > 0 && (
                      <PaginationTable
                        count={gridData?.totalCount}
                        setPositionHandler={setPositionHandler}
                        paginationState={{
                          pageNo,
                          setPageNo,
                          pageSize,
                          setPageSize,
                        }}
                      />
                    )}
                  </div>
                </Form>
              </CardBody>
            </Card>
          </>
        )}
      </Formik>
    </>
  );
}
