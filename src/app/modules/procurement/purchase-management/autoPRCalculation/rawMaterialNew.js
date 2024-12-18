import { Form, Formik } from 'formik';
import React, { useReducer, useState } from 'react';
import { shallowEqual, useSelector } from 'react-redux';
import { _dateFormatter } from '../../../_helper/_dateFormate';
import IForm from '../../../_helper/_form';
import IView from '../../../_helper/_helperIcons/_view';
import InputField from '../../../_helper/_inputField';
import Loading from '../../../_helper/_loading';
import NewSelect from '../../../_helper/_select';
import { _todayDate } from '../../../_helper/_todayDate';
import IViewModal from '../../../_helper/_viewModal';
import useAxiosGet from '../../../_helper/customHooks/useAxiosGet';
import useAxiosPost from '../../../_helper/customHooks/useAxiosPost';
import AutoPRCreateModal from './autoPRCreateModal';
import BreakDownModal from './breakdownModal';
import CommonItemDetailsModal from './rawMaterialModals/commonItemDetailsModal';
import {
  commonItemInitialState,
  commonItemReducer,
} from './rawMaterialModals/helper';
import WarehouseStockModal from './rawMaterialModals/warehouseStockModal';
import RawMaterialAutoPRNewModalView from './rawMaterialModalView';

const initData = {
  businessUnit: '',
  fromDate: _todayDate(),
  toDate: _todayDate(),
};

export default function RawMaterialAutoPRNew() {
  const { selectedBusinessUnit, businessUnitList } = useSelector((state) => {
    return state.authData;
  }, shallowEqual);

  const [singleRowData, setSingleRowData] = useState();
  const [, , saveLoader] = useAxiosPost();
  const [showModal, setShowModal] = useState(false);
  const [showSaveModal, setShowSaveModal] = useState(false);

  const [showBreakdownModal, setShowBreakdownModal] = useState(false);
  const [warehouseStockModalShow, setWarehouseStockModalShow] = useState(false);

  // reducer
  const [commonItemDetailsState, commonItemDetailsDispatch] = useReducer(
    commonItemReducer,
    commonItemInitialState,
  );

  const [
    mrpfromProductionScheduleLanding,
    getMrpfromProductionScheduleLanding,
    loading2,
    setMrpfromProductionScheduleLanding,
  ] = useAxiosGet();

  const saveHandler = (values, cb) => {};

  const getData = (values) => {
    setMrpfromProductionScheduleLanding([]);
    getMrpfromProductionScheduleLanding(
      `/procurement/MRPFromProduction/MrpfromProductionScheduleLanding?businessUnitId=${values?.businessUnit?.value}&FromDate=${values?.fromDate}&ToDate=${values?.toDate}`,
    );
  };

  return (
    <Formik
      enableReinitialize={true}
      initialValues={{
        ...initData,
        businessUnit: {
          value: selectedBusinessUnit?.value,
          label: selectedBusinessUnit?.label,
        },
      }}
      // validationSchema={{}}
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
        setValues,
        setFieldValue,
        isValid,
        errors,
        touched,
      }) => (
        <>
          {(saveLoader || loading2) && <Loading />}
          <IForm
            title="MPR Calculation"
            isHiddenReset
            isHiddenBack
            isHiddenSave
            renderProps={() => {
              return (
                <div>
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={() => {
                      setShowSaveModal(true);
                    }}
                  >
                    Create
                  </button>
                </div>
              );
            }}
          >
            <Form>
              <>
                <div className="form-group  global-form row">
                  <div className="col-lg-3">
                    <NewSelect
                      name="businessUnit"
                      options={businessUnitList || []}
                      value={values?.businessUnit}
                      label="Business Unit"
                      onChange={(valueOption) => {
                        setFieldValue('businessUnit', valueOption || '');
                      }}
                      errors={errors}
                      touched={touched}
                    />
                  </div>

                  <div className="col-lg-3">
                    <InputField
                      value={values?.fromDate}
                      label="From Date"
                      name="fromDate"
                      type="date"
                      onChange={(e) => {
                        setFieldValue('fromDate', e.target.value);
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
                        setFieldValue('toDate', e.target.value);
                      }}
                      min={values?.fromDate}
                    />
                  </div>
                  <div>
                    <button
                      type="button"
                      onClick={() => {
                        getData(values);
                      }}
                      disabled={!values?.businessUnit}
                      className="btn btn-primary mt-5"
                    >
                      Show
                    </button>
                  </div>
                </div>
                {mrpfromProductionScheduleLanding?.length > 0 && (
                  <div>
                    <div className="table-responsive">
                      <table className="table table-striped mt-2 table-bordered bj-table bj-table-landing">
                        <thead>
                          <tr>
                            <th>SL</th>
                            <th>Schedule Code</th>
                            <th>From Date</th>
                            <th>To Date</th>
                            <th>Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {mrpfromProductionScheduleLanding?.length > 0 &&
                            mrpfromProductionScheduleLanding?.map(
                              (item, index) => {
                                return (
                                  <tr key={index}>
                                    <td>{index + 1}</td>
                                    <td className="text-center">
                                      {item?.mrpproductionScheduleCode}
                                    </td>
                                    <td className="text-center">
                                      {_dateFormatter(item?.fromDate)}
                                    </td>
                                    <td className="text-center">
                                      {_dateFormatter(item?.toDate)}
                                    </td>
                                    <td className="text-center">
                                      <span
                                        onClick={() => {
                                          setShowModal(true);
                                          setSingleRowData(item);
                                        }}
                                      >
                                        <IView />
                                      </span>
                                    </td>
                                  </tr>
                                );
                              },
                            )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </>
            </Form>

            <IViewModal
              show={showSaveModal}
              onHide={() => {
                setShowSaveModal(false);
              }}
            >
              <AutoPRCreateModal
                parentValues={values}
                callBack={(childValues) => {
                  setValues({ ...childValues });
                  getData(childValues);
                }}
                setShowSaveModal={setShowSaveModal}
              />
            </IViewModal>

            <IViewModal
              show={showBreakdownModal}
              onHide={() => {
                setShowBreakdownModal(false);
                setSingleRowData({});
              }}
            >
              <BreakDownModal
                singleRowData={singleRowData}
                setShowBreakdownModal={setShowBreakdownModal}
                setSingleRowData={setSingleRowData}
              />
            </IViewModal>

            {/* Warehouse Stock Details Modal */}
            <IViewModal
              show={warehouseStockModalShow}
              onHide={() => {
                setWarehouseStockModalShow(false);
                setSingleRowData({});
              }}
            >
              <WarehouseStockModal
                objProp={{
                  singleRowData,
                  setSingleRowData,
                  values,
                }}
              />
            </IViewModal>

            {/* Common Item Details Modal */}
            <IViewModal
              show={commonItemDetailsState?.modalShow}
              onHide={() => {
                commonItemDetailsDispatch({ type: 'Close' });
              }}
            >
              <CommonItemDetailsModal
                objProp={{
                  commonItemDetailsState,
                  commonItemDetailsDispatch,
                  values,
                }}
              />
            </IViewModal>

            <IViewModal
              show={showModal}
              title={'MRP Calculation'}
              onHide={() => {
                setShowModal(false);
                setSingleRowData(null);
              }}
            >
              <RawMaterialAutoPRNewModalView
                singleRowDataFromParent={singleRowData}
                values={values}
              />
            </IViewModal>
          </IForm>
        </>
      )}
    </Formik>
  );
}
