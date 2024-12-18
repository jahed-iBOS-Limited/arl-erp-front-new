import { Form, Formik } from 'formik';
import React, { useEffect, useState } from 'react';
import IForm from '../../../_helper/_form';
import Loading from '../../../_helper/_loading';
import NewSelect from '../../../_helper/_select';
import useAxiosGet from '../../../_helper/customHooks/useAxiosGet';
import { shallowEqual, useSelector } from 'react-redux';
import { _dateFormatter } from '../../../_helper/_dateFormate';
import PaginationTable from '../../../_helper/_tablePagination';
import { _todayDate } from '../../../_helper/_todayDate';

const initData = {
  type: '',
  item: '',
  date: _todayDate(),
};
export default function PurchasePlanningAndScheduling() {
  const { selectedBusinessUnit, profileData } = useSelector((state) => {
    return state?.authData;
  }, shallowEqual);

  const [pageNo, setPageNo] = useState(0);
  const [pageSize, setPageSize] = useState(15);
  const [itemList, getItemList, , setItemList] = useAxiosGet();

  useEffect(() => {
    getItemList(
      `/imp/ImportCommonDDL/GetItemDDL?AccountId=${profileData?.accountId}&BusinessUnitId=${selectedBusinessUnit?.value}`,
      (data) => {
        const updateList = data?.map((item) => ({
          ...item,
          label: `${item?.label} (${item?.code})`,
        }));

        setItemList(updateList);
      },
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const saveHandler = (values, cb) => {};
  const [
    tableData,
    getTableData,
    tableDataLoader,
    setTableData,
  ] = useAxiosGet();

  const getData = (pageNo, pageSize, values) => {
    const url =
      values?.type?.value === 1
        ? `/imp/ImportReport/PurchasePlanningAndSchedulingReport?partName=ItemWiseSchedulingReport&businessUnitId=${
            selectedBusinessUnit?.value
          }&asOnDate=${values?.date}&itemId=${values?.item?.value ||
            0}&pageNo=${pageNo}&pageSize=${pageSize}`
        : `/imp/ImportReport/PurchasePlanningAndSchedulingReport?partName=PurchasePlanningNSchedulingReport&businessUnitId=${
            selectedBusinessUnit?.value
          }&asOnDate=${values?.date}&itemId=${values?.item?.value ||
            0}&pageNo=${pageNo}&pageSize=${pageSize}`;

    getTableData(url);
  };

  const setPositionHandler = (pageNo, pageSize, values) => {
    getData(pageNo, pageSize, values);
  };

  return (
    <Formik
      enableReinitialize={true}
      initialValues={initData}
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
        setFieldValue,
        isValid,
        errors,
        touched,
      }) => (
        <>
          {tableDataLoader && <Loading />}
          <IForm
            title="Purchase Planning & Scheduling"
            isHiddenReset
            isHiddenBack
            isHiddenSave
            renderProps={() => {
              return <div></div>;
            }}
          >
            <Form>
              <div>
                <div className="form-group  global-form row">
                  <div className="col-lg-3">
                    <NewSelect
                      name="type"
                      options={[
                        { value: 1, label: 'Item Wise Scheduling' },
                        { value: 2, label: 'Purchase Planning' },
                      ]}
                      value={values?.type}
                      label="Type"
                      onChange={(valueOption) => {
                        if (valueOption) {
                          setFieldValue('type', valueOption);
                          setFieldValue('item', '');
                          setTableData([]);
                          setPageNo(0);
                          setPageSize(15);
                        } else {
                          setFieldValue('type', '');
                          setFieldValue('item', '');
                          setTableData([]);
                          setPageNo(0);
                          setPageSize(15);
                        }
                      }}
                      errors={errors}
                      touched={touched}
                    />
                  </div>
                  {values?.type?.value === 1 ? (
                    <>
                      <div className="col-lg-3">
                        <NewSelect
                          name="item"
                          options={itemList}
                          value={values?.item}
                          label="Item"
                          onChange={(valueOption) => {
                            if (valueOption) {
                              setFieldValue('item', valueOption);
                              setTableData([]);
                              setPageNo(0);
                              setPageSize(15);
                            } else {
                              setFieldValue('item', '');
                              setTableData([]);
                              setPageNo(0);
                              setPageSize(15);
                            }
                          }}
                          errors={errors}
                          touched={touched}
                        />
                      </div>
                    </>
                  ) : null}
                  <button
                    style={{ marginTop: '18px' }}
                    className="btn btn-primary"
                    type="button"
                    onClick={() => {
                      getData(pageNo, pageSize, values);
                    }}
                  >
                    View
                  </button>
                </div>

                {values?.type?.value === 1 ? (
                  <div className="table-responsive">
                    <table className="table table-striped table-bordered global-table">
                      <thead>
                        <tr>
                          <th>Date</th>
                          <th>
                            Item <br />
                            Code
                          </th>
                          <th>
                            Item <br />
                            Name
                          </th>
                          <th>Uom</th>
                          <th>PR NO.</th>
                          <th>PR DATE</th>
                          <th>REQUIRED DATE</th>
                          <th>PR Qty</th>
                          <th>
                            Booking Qty
                            <br />
                            (Contract Qty)
                          </th>
                          <th>PI Number</th>
                          <th>PI Qty</th>
                          <th>
                            Inco-term <br /> FOB/CFR
                          </th>
                          <th>Price FC</th>
                          <th>Value FC</th>
                          <th>
                            Estimated <br />
                            Laycan Date
                          </th>
                          <th>
                            ETA <br />
                            BD Port
                          </th>
                          <th>
                            Estimated <br />
                            Survive Days
                          </th>
                          <th>
                            Estimated <br /> Survive DT
                          </th>
                          <th>
                            Supplier
                            <br /> Name
                          </th>
                          <th>
                            Country <br />
                            of Origin
                          </th>
                          <th>
                            Load
                            <br /> Port
                          </th>
                          <th>
                            LC Issued <br />
                            Qty
                          </th>
                          <th>
                            LC Pending
                            <br /> Qty
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {tableData?.length > 0 &&
                          tableData?.map((item, index) => (
                            <tr key={index}>
                              <td className="text-center">
                                {_dateFormatter(
                                  item?.dtePurchaseContractDate,
                                ) || 'N/A'}
                              </td>
                              <td>{item?.strItemCode || 'N/A'}</td>
                              <td>{item?.strItemName || 'N/A'}</td>
                              <td>{item?.strUoMName || 'N/A'}</td>
                              <td>{item?.strPurchaseRequestNo || 'N/A'}</td>
                              <td>
                                {_dateFormatter(
                                  item?.dtePurchaseRequestDate || '',
                                ) || 'N/A'}
                              </td>
                              <td>
                                {_dateFormatter(
                                  item?.dtePurchaseRequestRequiredDate,
                                ) || 'N/A'}
                              </td>
                              <td>{item?.numPurchaseRequestQty || 'N/A'}</td>
                              <td>{item?.numContractQty || 0}</td>
                              <td>{item?.strPINumber || 0}</td>
                              <td>{item?.numPiQty || 0}</td>
                              <td>{item?.strIncotermName || 'N/A'}</td>
                              <td>{item?.numPriceFc || 0}</td>
                              <td>{item?.numValueFc || 0}</td>
                              <td className="text-center">
                                {_dateFormatter(item?.dteEstimatedLaycanDate) ||
                                  'N/A'}
                              </td>
                              <td>{item?.dteEta || 'N/A'}</td>
                              <td>{item?.intEstimatedSurviveDays || 'N/A'}</td>
                              <td className="text-center">
                                {_dateFormatter(
                                  item?.dteEstimatedSurviveDate,
                                ) || 'N/A'}
                              </td>
                              <td>{item?.strSupplierName || 'N/A'}</td>
                              <td>{item?.strCountryOfOrigin || 'N/A'}</td>
                              <td>{item?.strLoadingPort || 'N/A'}</td>
                              <td>{item?.numLcIssueQty || 0}</td>
                              <td>{item?.numLcPendingQty || 0}</td>
                            </tr>
                          ))}
                      </tbody>
                    </table>
                  </div>
                ) : values?.type?.value === 2 ? (
                  <div className="row">
                    <div className="col-lg-12">
                      <div className="react-bootstrap-table table-responsive">
                        <table className="table table-striped table-bordered global-table able-font-size-sm mt-5">
                          <thead>
                            <tr>
                              <th>
                                Item <br /> Code
                              </th>
                              <th>Comodity/Item</th>
                              <th>UOM </th>
                              <th>
                                Daily Avg <br />
                                Consumption
                              </th>
                              <th>
                                Monthly <br /> Required
                              </th>
                              <th>Store Stock</th>
                              <th>Ghat Stock</th>
                              <th>Port Stock</th>
                              <th>
                                Total <br /> BD Stock
                              </th>
                              <th>
                                Coverage <br /> Days
                              </th>
                              <th>
                                BD Stock <br /> Coverage
                              </th>
                              <th>Open LC</th>
                              <th>Last ETA</th>
                              <th>
                                LC & Stock
                                <br /> Coverage
                              </th>
                              <th>
                                LC Pending
                                <br /> Qty
                              </th>
                              <th>
                                PI <br />
                                Coverage
                              </th>
                              <th>PI Pending</th>
                              <th>
                                Booking
                                <br /> Coverage
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            {tableData?.length > 0 &&
                              tableData?.map((item, index) => (
                                <tr key={index}>
                                  <td>{item?.strItemCode || 'N/A'}</td>
                                  <td>{item?.strItemName || 'N/A'}</td>
                                  <td>{item?.strUom || 'N/A'}</td>
                                  <td>{item?.averageConsumption || 0}</td>
                                  <td>{item?.monthlyReqQty || 0}</td>
                                  <td>{item?.currentStock || 0}</td>
                                  <td>{item?.balanceOnGhat || 0}</td>
                                  <td>{item?.stockInTransit || 0}</td>
                                  <td>{item?.totalQty || 0}</td>
                                  <td>{item?.totalSurviveDays || 0}</td>
                                  <td>
                                    {_dateFormatter(item?.bdStockCoverageDate)}
                                  </td>
                                  <td>{item?.lcOpenedQty || 0}</td>
                                  <td>
                                    {item?.lastEtaDate
                                      ? _dateFormatter(item?.lastEtaDate)
                                      : 'N/A'}
                                  </td>

                                  <td className="text-center">
                                    {_dateFormatter(
                                      item?.lcAndStockCoverageDate,
                                    ) || 'N/A'}
                                  </td>
                                  <td>{item?.lcPendingQty || 0}</td>
                                  <td className="text-center">
                                    {_dateFormatter(item?.piCoverageDate) ||
                                      'N/A'}
                                  </td>
                                  <td>{item?.piPendingQty}</td>
                                  <td className="text-center">
                                    {_dateFormatter(
                                      item?.bookingCoverageDate,
                                    ) || 'N/A'}
                                  </td>
                                </tr>
                              ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                ) : null}

                {tableData?.length > 0 ? (
                  <PaginationTable
                    count={tableData[0]?.totalCount}
                    setPositionHandler={setPositionHandler}
                    paginationState={{
                      pageNo,
                      setPageNo,
                      pageSize,
                      setPageSize,
                    }}
                    values={values}
                  />
                ) : null}
              </div>
            </Form>
          </IForm>
        </>
      )}
    </Formik>
  );
}
