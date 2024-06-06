import { Form, Formik } from 'formik';
import React, { useEffect, useState } from 'react';
import { shallowEqual, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import InputField from '../../../_helper/_inputField';
import Loading from '../../../_helper/_loading';
import NewSelect from '../../../_helper/_select';
import { _todayDate } from '../../../_helper/_todayDate';
import useAxiosGet from '../../../_helper/customHooks/useAxiosGet';
import useAxiosPost from '../../../_helper/customHooks/useAxiosPost';
import TdsVdsJvDataTable from './components/dataTable';
import IViewModal from '../../../_helper/_viewModal';
import PrintView from './print';

const initData = {
  accountNo: '',
  status: '',
  billType: '',
  fromDate: _todayDate(),
  toDate: _todayDate(),
  costCenter: '',
  costElement: '',
  profitCenter: '',
};

export default function _Form({ bankDDL, setDisabled, btnRef }) {
  const [accountNoDDL, getAccountNoDDL, isAcconutNoDDLLoading] = useAxiosGet();
  const [
    billTypeDDL,
    getBillTypeDDL,
    isBillTypeDDLLoading,
    setBillTypeDDL,
  ] = useAxiosGet();

  const [rowData, getRowData, isRowDataLoading, setRowData] = useAxiosGet();
  const [editableData, setEditableData] = useState([]);
  const [
    costCenterDDL,
    getCostCenterDDL,
    isCostCenterDDLLoading,
  ] = useAxiosGet();

  const [
    costElementDDL,
    getCostElementDDL,
    isCostElementDDLLoading,
  ] = useAxiosGet();

  const [
    profitCenterDDL,
    getProfitCenterDDL,
    isProfitCenterDDLLoading,
    setProfitCenterDDL,
  ] = useAxiosGet();

  const [, getSbuId, , setSbuId] = useAxiosGet();

  const [, saveData, isSavignData] = useAxiosPost();
  const [isShowPrintModal, setIsShowPrintModal] = useState(false);

  // get user profile data from store
  const {
    profileData: { accountId: accId },
    selectedBusinessUnit: { value: buId },
  } = useSelector((state) => state.authData, shallowEqual);

  //get data for table
  const handleGetTableData = ({
    billType,
    fromDate,
    toDate,
    status,
    pageNo = 1,
    pageSize = 50,
  }) => {
    const tableDataApi = `/fino/PaymentRequest/GetTdsVdsJv?BusinessUnitId=${buId}&RefType=${billType}&FromDate=${fromDate}&ToDate=${toDate}&Status=${status}&PageNo=${pageNo}&PageSize=${pageSize}`;
    getRowData(tableDataApi, (res) => {
      setEditableData(res?.data);
      if (res?.data?.length === 0) {
        toast.warn('Data Not Found!');
      }
    });
  };

  // Fetch cost center dropdown list
  const fetchCostCenterDDL = (sbuId) => {
    const costCenterApi = `/costmgmt/CostCenter/GetCostCenterDDL?AccountId=${accId}&BusinessUnitId=${buId}&SBUId=${sbuId}`;

    getCostCenterDDL(costCenterApi);
  };

  // Fetch profit center dropdown list for cost center Id
  const fetchProfitCenterDDL = () => {
    // costCenterId --> costCenter-selected-dropdown-list-item-value
    const profitCenterApi = `/fino/CostSheet/ProfitCenterDetails?UnitId=${buId}`;

    getProfitCenterDDL(profitCenterApi, (data) => {
      const ddl = data?.map((item) => {
        return {
          label: item?.profitCenterName,
          value: item?.profitCenterId,
        };
      });
      setProfitCenterDDL(ddl);
    });
  };

  // Fetch cost element dropdown list
  const fetchCostElementDDL = () => {
    // costCenterId --> costCenter selected dropdown list item value
    const costElementApi = `/procurement/PurchaseOrder/GetCostElement?AccountId=${accId}&UnitId=${buId}`;
    getCostElementDDL(costElementApi);
  };

  useEffect(() => {
    const sbuApi = `/costmgmt/SBU/GetSBUListDDL?AccountId=${accId}&BusinessUnitId=${buId}&Status=true`;
    fetchCostElementDDL();
    fetchProfitCenterDDL();

    getSbuId(sbuApi, (data) => {
      const sbuId = data[0]?.value;
      if (sbuId) {
        setSbuId(sbuId);
        fetchCostCenterDDL(sbuId);
      }
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [accId, buId]);

  //Load ddsl
  useEffect(() => {
    getAccountNoDDL(
      `/costmgmt/BankAccount/GetBankAccountDDL?AccountId=${accId}&BusinssUnitId=${buId}`);

    getBillTypeDDL(`/fino/FinanceCommonDDL/GetBillTypeDDL`, (data) => {
      // const firstTwo = data.slice(0, 2); //Show only first two
      const filterData = data.filter((item)=> [1,2,6].includes(item?.value))
      setBillTypeDDL(filterData);
    });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [accId, buId]);

  //const prepare payload for save
  const prepareSavePayload = (listData, values) => {
    const selectedList = listData.filter((data) => data.isSelect);
    if (!selectedList.length) return [];
    const defaults = {
      businessUnitId: buId,
      profitCenterId: values?.profitCenter?.value,
      costCenterId: values?.costCenter?.value,
      costElementId: values?.costElement?.value,
      bankAccountNo: values?.accountNo?.bankAccNo,
      bankAccountId: values?.accountNo?.value,
      costCenterName: values?.costCenter?.label,
      costElementName: values?.costElement?.label,
    };
    const payload = selectedList?.map((item) => {
      return {
        paymentRequestId: item?.paymentRequestId,
        partnerId: item?.partnerId,
        tdsAmount: item?.tdsamount,
        vdsAmount: item?.vdsamount,
        ...defaults,
      };
    });
    return payload;
  };

  //handle save data
  const saveHandler = (values, cb) => {

    setDisabled(true);
    const saveReqApi = `/fino/PaymentRequest/CreateTdsVdsJournalVoucher`;
    const savePayload = prepareSavePayload(editableData, values);
    const isNotPemittedForSave = savePayload?.some(
      (item) => item.taxVatJournalId > 0 || item.taxVatJournalId == null
    );

    if(isNotPemittedForSave){
      return toast.warn(`Not Permitted`)
    }

    saveData(
      saveReqApi,
      savePayload,
      (res) => {
        if (res?.statuscode === 200) {
          // setDisabled(false)
          cb();
        }
      },
      true,
    );

  };

  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={initData}
        // validationSchema={validationSchema}
        onSubmit={(values, { setSubmitting, resetForm }) => {
          saveHandler(values, () => {
            setSubmitting(true);
            resetForm(initData);
            setRowData([]);
            setEditableData([]);
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
        }) => (
          <>
            {(isAcconutNoDDLLoading ||
              isBillTypeDDLLoading ||
              isRowDataLoading ||
              isCostCenterDDLLoading ||
              isCostElementDDLLoading ||
              isProfitCenterDDLLoading ||
              isSavignData ||
              isCostCenterDDLLoading) && <Loading />}
            <Form className="form form-label-right">
              <div className="global-form p-2">
                <div className="form-group row">
                  <div className="col-lg-2">
                    <NewSelect
                      name="accountNo"
                      options={accountNoDDL ?? []}
                      value={values?.accountNo}
                      placeholder="Account No"
                      label="Account No(Online)"
                      onChange={(valueOption) => {
                        setFieldValue('accountNo', valueOption);
                      }}
                      errors={errors}
                      touched={touched}
                      isDisabled={(() => {
                        const selectedList = editableData?.filter(
                          (item) => item?.isSelect,
                        );

                        if (selectedList && selectedList?.length > 0) {
                          return false;
                        } else {
                          return true;
                        }
                      })()}
                    />
                  </div>

                  <div className="col-lg-2">
                    <NewSelect
                      name="status"
                      options={[
                        { value: 1, label: 'Pending' },
                        { value: 2, label: 'Complete' },
                      ]}
                      value={values?.status}
                      label="Status"
                      onChange={(valueOption) => {
                        setFieldValue('status', valueOption);
                        setEditableData([]);
                      }}
                      errors={errors}
                      touched={touched}
                    />
                  </div>
                  <div className="col-lg-2">
                    <NewSelect
                      name="billType"
                      options={billTypeDDL || []}
                      value={values?.billType}
                      label="Bill Type"
                      onChange={(valueOption) => {
                        setFieldValue('billType', valueOption);
                      }}
                      errors={errors}
                      touched={touched}
                    />
                  </div>
                  <div className="col-lg-2">
                    <label>From Date</label>
                    <InputField
                      value={values?.fromDate}
                      name="fromDate"
                      placeholder="From Date"
                      type="date"
                      onChange={(e) => {
                        setFieldValue('fromDate', e.target.value);
                      }}
                    />
                  </div>
                  <div className="col-lg-2">
                    <label>To Date</label>
                    <InputField
                      value={values?.toDate}
                      name="toDate"
                      placeholder="To Date"
                      type="date"
                      min={values?.fromDate}
                      onChange={(e) => {
                        setFieldValue('toDate', e.target.value);
                      }}
                    />
                  </div>
                  <div className="col-lg-3">
                    <NewSelect
                      value={values?.profitCenter || ''}
                      isSearchable={true}
                      options={profitCenterDDL || []}
                      // styles={customStyles}
                      placeholder="Profit Center"
                      name="Profit Center"
                      onChange={(valueOption) => {
                        setFieldValue('profitCenter', valueOption);
                      }}
                    />
                  </div>
                  <div className="col-lg-3">
                    <NewSelect
                      onChange={(valueOption) => {
                        setFieldValue('costCenter', valueOption);
                      }}
                      value={values?.costCenter || ''}
                      isSearchable={true}
                      options={costCenterDDL || []}
                      placeholder="Cost Center"
                      name="costCenter"
                    />
                  </div>
                  <div className="col-lg-3">
                    <NewSelect
                      onChange={(valueOption) => {
                        setFieldValue('costElement', valueOption);
                      }}
                      value={values?.costElement || ''}
                      isSearchable={true}
                      options={costElementDDL || []}
                      // styles={customStyles}
                      placeholder="Cost Element"
                      name="costElement"
                    />
                  </div>

                  <div className="col-lg-1">
                    <button
                      className="btn btn-primary mt-5"
                      disabled={
                        !(values?.billType?.value && values?.status?.value)
                      }
                      type="button"
                      onClick={() => {
                        handleGetTableData({
                          billType: values?.billType.value,
                          fromDate: values?.fromDate,
                          toDate: values?.toDate,
                          status:
                            values?.status?.label === 'Pending' ? false : true,
                        });
                      }}
                    >
                      Show
                    </button>
                  </div>
                  {/* <div
                    style={{ marginTop: '22px', marginLeft: '6px' }}
                    className="col-lg-2"
                  >
                    <button
                      // style={{ display: 'none' }}
                      className="btn btn-primary"
                      disabled={
                        !values?.sbuUnit
                        //||
                        // !values?.adviceBank ||
                        // !values?.accountNo
                      }
                      type="submit"
                      onSubmit={() => {
                        saveHandler(values, () => {
                          resetForm(initData);
                        });
                      }}
                    >
                      Prepare Voucher
                    </button>
                  </div> */}
                  {values?.status?.label === 'Complete' && (<div className='col-lg-1'>
                      <button onClick={()=>{
                    const  isExisSelectedRow = editableData?.some((item)=>item?.isSelect)
                        if(!isExisSelectedRow){
                          return toast.warn("Please Select At least one Row")
                        }
                        setIsShowPrintModal(true)
                      }} type='button' className="btn btn-primary mt-5">Print</button>
                  </div>)}
                </div>
              </div>

              {/* Data table */}
              {editableData.length > 0 ? (
                <TdsVdsJvDataTable
                  setFieldValue={setFieldValue}
                  values={values}
                  setDisabled={setDisabled}
                  errors={errors}
                  touched={touched}
                  rowData={rowData}
                  editableData={editableData}
                  setEditableData={setEditableData}
                  handleGetTableData={handleGetTableData}
                  totalCount={rowData?.totalCount}
                />
              ) : null}

              <button
                type="submit"
                style={{ display: 'none' }}
                ref={btnRef}
                onSubmit={() => handleSubmit()}
              ></button>

              <button
                type="reset"
                style={{ display: 'none' }}
                // ref={resetBtnRef}
                onSubmit={() => resetForm(initData)}
                // onClick={() => setRowDto([])}
              ></button>
            </Form>
            {isShowPrintModal && (
                  <IViewModal
                    show={isShowPrintModal}
                    onHide={() => {
                      setIsShowPrintModal(false);
                    }}
                    title=""
                  >
                   <PrintView selectedRow={editableData.filter(item => item?.isSelect)}/>
                  </IViewModal>
                )}
          </>
        )}
      </Formik>
    </>
  );
}
