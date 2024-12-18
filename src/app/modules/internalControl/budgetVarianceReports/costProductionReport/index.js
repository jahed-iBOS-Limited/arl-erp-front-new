import { Formik } from 'formik';
import React, { useState } from 'react';
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
import NewSelect from '../../../_helper/_select';
import { _todayDate } from '../../../_helper/_todayDate';
import IViewModal from '../../../_helper/_viewModal';
import useAxiosGet from '../../../_helper/customHooks/useAxiosGet';
import './style.css';
import ViewModal from './viewModal';

const initData = {
  fromDate: _todayDate(),
  toDate: _todayDate(),
  currentBusinessUnit: '',
  isForecast: false,
};

function CostOfProductionReport() {
  const [rowDto, getRowDto, loading, setRowDto] = useAxiosGet();
  const businessUnitList = useSelector((state) => {
    return state.authData.businessUnitList;
  }, shallowEqual);

  const selectedBusinessUnit = useSelector((state) => {
    return state.authData.selectedBusinessUnit;
  }, shallowEqual);

  const [isShowModal, setIsShowModal] = useState(false);

  const getData = (values) => {
    getRowDto(
      `/fino/Report/GetMachineWiseCostOfProduction?intBusinessUnitId=${values
        ?.currentBusinessUnit?.value ||
        selectedBusinessUnit?.value}&fromDate=${values?.fromDate ||
        _todayDate()}&toDate=${values?.toDate || _todayDate()}&isForecast=${
        values?.isForecast
      }`,
    );
  };

  return (
    <>
      <Formik
        enableReinitialize={false}
        initialValues={{
          ...initData,
          currentBusinessUnit: {
            value: selectedBusinessUnit?.value,
            label: selectedBusinessUnit?.label,
          },
        }}
        // validationSchema={{}}
        onSubmit={() => {}}
      >
        {({ values, errors, touched, setFieldValue }) => (
          <>
            <Card>
              {true && <ModalProgressBar />}
              <CardHeader title={'Cost Of Production Variance Report'}>
                <CardHeaderToolbar></CardHeaderToolbar>
              </CardHeader>
              <CardBody>
                {loading && <Loading />}
                <div className="global-form row">
                  <div className="col-lg-3">
                    <NewSelect
                      name="currentBusinessUnit"
                      options={businessUnitList}
                      value={values?.currentBusinessUnit}
                      label="Business Unit"
                      onChange={(valueOption) => {
                        if (valueOption) {
                          setFieldValue('currentBusinessUnit', valueOption);
                          setRowDto([]);
                        } else {
                          setRowDto([]);
                        }
                      }}
                      placeholder="Business Unit"
                      errors={errors}
                      touched={touched}
                      required={true}
                    />
                  </div>
                  <div className="col-lg-3">
                    <InputField
                      value={values?.fromDate}
                      label="From Date"
                      name="fromDate"
                      type="date"
                      onChange={(e) => {
                        setFieldValue('fromDate', e?.target?.value);
                      }}
                    />
                  </div>
                  <div className="col-lg-3">
                    <InputField
                      value={values?.toDate}
                      label="To Date"
                      name="toDate"
                      type="date"
                      onChange={(e) => {
                        setFieldValue('toDate', e?.target?.value);
                      }}
                    />
                  </div>
                  <div className="col-lg-1 mt-4">
                    <div className="d-flex align-items-center">
                      <p className="pr-1 pt-3">
                        <input
                          type="checkbox"
                          checked={values?.isForecast}
                          onChange={(e) => {
                            setFieldValue('isForecast', e.target.checked);
                          }}
                        />
                      </p>
                      <p>
                        <label>Is Forecast</label>
                      </p>
                    </div>
                  </div>
                  <div>
                    <button
                      style={{ marginTop: '18px' }}
                      type="button"
                      class="btn btn-primary"
                      disabled={!values?.fromDate || !values?.toDate}
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
                            <th>Item Code</th>
                            <th>Item Name</th>
                            <th>Uom</th>
                            <th>Budget Production Qty</th>
                            <th>Actual Production Qty</th>
                            <th>Budget Material Cost</th>
                            <th>Actual Material Cost</th>
                            <th>Budget Overhead</th>
                            <th>Actual Overhead</th>
                            <th>Budget Total Cost</th>
                            <th>Actual Total Cost</th>
                            {/* <th>Action</th> */}
                          </tr>
                        </thead>
                        <tbody>
                          {rowDto?.length > 0 &&
                            rowDto?.map((item, index) => (
                              <tr key={index}>
                                <td className="text-center">
                                  {item?.strItemCode}
                                </td>
                                <td>{item?.strItemName}</td>
                                <td>{item?.strBaseUomName}</td>
                                <td className="text-center">
                                  {item?.numBudProdQty}
                                </td>
                                <td className="text-center">
                                  {item?.numActProdQty}
                                </td>
                                <td className="text-right">
                                  {_formatMoney(item?.numBudMatCost)}
                                </td>
                                <td className="text-right">
                                  {_formatMoney(item?.numActMatCost)}
                                </td>
                                <td className="text-right">
                                  {_formatMoney(item?.numBudOverhead)}
                                </td>
                                <td className="text-right">
                                  {_formatMoney(item?.numActOverhead)}
                                </td>
                                <td className="text-right">
                                  {_formatMoney(item?.numBudTotalCost)}
                                </td>
                                <td className="text-right">
                                  {_formatMoney(item?.numActTotalCost)}
                                </td>
                                {/* <td className="text-center">
                                <IView
                                  clickHandler={() => {
                                    setSingleData(item);
                                    setIsShowModal(true);
                                  }}
                                />
                              </td> */}
                              </tr>
                            ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
                <IViewModal
                  modelSize="lg"
                  show={isShowModal}
                  onHide={() => setIsShowModal(false)}
                >
                  <ViewModal singleData={{}} values={values} />
                </IViewModal>
              </CardBody>
            </Card>
          </>
        )}
      </Formik>
    </>
  );
}

export default CostOfProductionReport;
