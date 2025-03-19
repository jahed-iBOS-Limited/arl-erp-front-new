import { Formik } from 'formik';
import React, { useEffect } from 'react';
import { shallowEqual, useSelector } from 'react-redux';
import {
  Card,
  CardBody,
  CardHeader,
  CardHeaderToolbar,
  ModalProgressBar,
} from '../../../../../_metronic/_partials/controls';
import { _formatMoney } from '../../../_helper/_formatMoney';
import InputField from '../../../_helper/_inputField';
import Loading from '../../../_helper/_loading';
import { _getCurrentMonthYearForInput } from '../../../_helper/_todayDate';
import useAxiosGet from '../../../_helper/customHooks/useAxiosGet';
import './style.css';

const initData = {
  // fromDate: _todayDate(),
  // toDate: _todayDate(),
  monthYear: _getCurrentMonthYearForInput(),
};

function CostOfProduction() {
  const [rowDto, getRowDto, loading, setRowDto] = useAxiosGet();
  const selectedBusinessUnit = useSelector((state) => {
    return state.authData.selectedBusinessUnit;
  }, shallowEqual);

  const getData = (values) => {
    const [year, month] = values?.monthYear.split('-').map(Number);
    const startDate = new Date(Date.UTC(year, month - 1, 1));
    const endDate = new Date(Date.UTC(year, month, 0));
    const formattedStartDate = startDate.toISOString().split('T')[0];
    const formattedEndDate = endDate.toISOString().split('T')[0];

    getRowDto(
      `/fino/Report/GetMachineWiseCostOfProduction?intBusinessUnitId=${selectedBusinessUnit?.value}&fromDate=${formattedStartDate}&toDate=${formattedEndDate}`,
      (data) => {
        let sl = 0;
        let arr = [];
        data.forEach((item) => {
          let obj = {
            ...item,
            isShow: sl === item?.intSectionSl ? false : true,
          };
          if (sl !== item?.intSectionSl) {
            sl = item?.intSectionSl;
          }
          arr.push(obj);
        });
        setRowDto(arr);
      },
    );
  };

  useEffect(() => {
    getData(initData);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <Formik
        enableReinitialize={false}
        initialValues={initData}
        // validationSchema={{}}
        onSubmit={() => {}}
      >
        {({ values, errors, touched, setFieldValue }) => (
          <>
            <Card>
              {true && <ModalProgressBar />}
              <CardHeader title={'Cost Of Production'}>
                <CardHeaderToolbar></CardHeaderToolbar>
              </CardHeader>
              <CardBody>
                {loading && <Loading />}
                <div className="global-form row">
                  {/* <div className="col-lg-3">
                    <label>From Date</label>
                    <InputField
                      value={values?.fromDate}
                      name="fromDate"
                      placeholder="From Date"
                      type="date"
                      onChange={(e) => {
                        setFieldValue("fromDate", e?.target?.value);
                      }}
                    />
                  </div> */}
                  {/* <div className="col-lg-3">
                    <label>To Date</label>
                    <InputField
                      value={values?.toDate}
                      name="toDate"
                      placeholder="To Date"
                      type="date"
                      onChange={(e) => {
                        setFieldValue("toDate", e?.target?.value);
                      }}
                    />
                  </div> */}
                  <div className="col-lg-3">
                    <label>Month-Year</label>
                    <InputField
                      value={values?.monthYear}
                      name="monthYear"
                      placeholder="From Date"
                      type="month"
                      onChange={(e) => {
                        setFieldValue('monthYear', e?.target?.value);
                      }}
                    />
                  </div>
                  <div>
                    <button
                      style={{ marginTop: '18px' }}
                      type="button"
                      class="btn btn-primary"
                      // disabled={!values?.fromDate || !values?.toDate}
                      disabled={!values?.monthYear}
                      onClick={() => {
                        getData(values);
                      }}
                    >
                      Show
                    </button>
                  </div>
                  {/* <div style={{ marginTop: "18px" }} className="ml-5">
                    <ReactHtmlTableToExcel
                      id="cost-of-production-machine-wise"
                      className="btn btn-primary mr-2"
                      table="table-to-xlsx"
                      filename="Cost of Production (Machine Wise)"
                      sheet="Cost of Production (Machine Wise)"
                      buttonText="Export Excel"
                    />
                  </div> */}
                </div>
                <div className="row mt-5">
                  <div className="col-lg-12 cost-of-production">
                    <div className="table-responsive">
                      <table
                        id="table-to-xlsx"
                        className="table table-striped table-bordered bj-table bj-table-landing"
                      >
                        <thead>
                          <tr>
                            {/* <th>Machine</th> */}
                            <th>Item Code</th>
                            <th>Item Name</th>
                            <th>UoM</th>
                            <th>Particulars</th>
                            <th>Uom</th>
                            <th>Budget</th>
                            <th>Actual</th>
                            <th>Variance</th>
                          </tr>
                        </thead>
                        <tbody>
                          {rowDto?.length > 0 &&
                            rowDto?.map((item, index) => (
                              <tr key={index}>
                                {item?.isShow ? (
                                  <>
                                    {/* <td
                                    className="text-center"
                                    rowSpan={item?.intSectionCount}
                                  >
                                    {item?.machineName}
                                  </td> */}
                                    <td
                                      className="text-center"
                                      rowSpan={item?.intSectionCount}
                                    >
                                      {item?.fgItemCode}
                                    </td>
                                    <td
                                      className="text-center"
                                      rowSpan={item?.intSectionCount}
                                    >
                                      {item?.fgItemName}
                                    </td>
                                    <td
                                      className="text-center"
                                      rowSpan={item?.intSectionCount}
                                    >
                                      {item?.fgItemUom}
                                    </td>
                                  </>
                                ) : null}
                                <td
                                  className={
                                    item?.isTotal
                                      ? 'text-left bold'
                                      : 'text-left'
                                  }
                                >
                                  {item?.particularsName}
                                </td>
                                <td>{item?.particularsUom}</td>
                                <td
                                  className={
                                    item?.isTotal
                                      ? 'text-right bold'
                                      : 'text-right'
                                  }
                                >
                                  {_formatMoney(item?.budgetConsumption)}
                                </td>
                                <td
                                  className={
                                    item?.isTotal
                                      ? 'text-right bold'
                                      : 'text-right'
                                  }
                                >
                                  {_formatMoney(item?.actualConsumption)}
                                </td>
                                <td
                                  className={
                                    item?.isTotal
                                      ? 'text-right bold'
                                      : 'text-right'
                                  }
                                >
                                  {_formatMoney(item?.variance)}
                                </td>
                              </tr>
                            ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </CardBody>
            </Card>
          </>
        )}
      </Formik>
    </>
  );
}

export default CostOfProduction;
