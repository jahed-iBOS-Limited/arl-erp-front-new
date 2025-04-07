import { Form, Formik } from 'formik';
import React, { useEffect } from 'react';
import { shallowEqual, useSelector } from 'react-redux';
import {
  Card,
  CardBody,
  CardHeader,
  ModalProgressBar,
} from '../../../../../../_metronic/_partials/controls';
import { _formatMoney } from '../../../../_helper/_formatMoney';
import InputField from '../../../../_helper/_inputField';
import Loading from '../../../../_helper/_loading';
import useAxiosGet from '../../../../_helper/customHooks/useAxiosGet';
import { getMonthName } from '../../../../_helper/monthIdToMonthName';

const SalesForceIncetiveDetailsModal = ({ gridItem }) => {
  const { selectedBusinessUnit } = useSelector(
    (state) => state.authData,
    shallowEqual
  );

  const [
    sfiDetailsData,
    getSFIDetailsData,
    getSFIDetailsDataLoading,
    setSFIDetailsData,
  ] = useAxiosGet();

  // common total
  function commonTotal(propName) {
    return sfiDetailsData?.data?.reduce(
      (acc, currItem) => (acc += +currItem[propName]),
      0
    );
  }

  function fetchSFIDetailsData({ selectedBusinessUnit, gridItem }) {
    // api
    getSFIDetailsData(
      `/oms/SalesForceKPI/GetDeatailinfoByBillRegisterId?businessUnitId=${selectedBusinessUnit?.value}&billRegisterId=${gridItem?.billRegisterId}&billtypeid=${gridItem?.billType}`
    );
  }

  useEffect(() => {
    fetchSFIDetailsData({ selectedBusinessUnit, gridItem });
  }, []);

  return (
    <Formik>
      {({ handleSubmit, resetForm, values }) => (
        <Card>
          {getSFIDetailsDataLoading && <Loading />}
          {true && <ModalProgressBar />}
          <CardHeader title={`Sales Force Incentive`}></CardHeader>
          <CardBody>
            <Form className="form form-label-right approveBillRegisterView">
              <div className="row mt-3">
                <div class="col-lg-12 flex flex-row text-right">
                  <strong>Total Bill Amount: </strong>
                  <strong>
                    {_formatMoney(
                      sfiDetailsData?.data?.reduce(
                        (acc, item) =>
                          (acc += item?.isSelected ? +item?.billAmount : 0),
                        0
                      )
                    )}
                  </strong>
                </div>
                <div className="col-lg-12 ">
                  <div className="table-responsive">
                    {sfiDetailsData?.data?.length > 0 ? (
                      <table className="table table-striped table-bordered mt-3 global-table">
                        <thead>
                          <tr>
                            <th>
                              <input
                                type="checkbox"
                                checked={sfiDetailsData?.data?.every(
                                  (item) => item?.isSelected
                                )}
                                onChange={(e) => {
                                  const checked = e.target.checked;
                                  const copySFIDetailsData =
                                    sfiDetailsData?.data?.map((item) => ({
                                      ...item,
                                      isSelected: checked,
                                    }));
                                  setSFIDetailsData((prevState) => ({
                                    ...prevState,
                                    data: copySFIDetailsData,
                                  }));
                                }}
                              ></input>
                            </th>
                            <th>SL</th>
                            <th>Employee Id</th>
                            <th>Employee Name</th>
                            <th>Territory</th>
                            <th>Area</th>
                            <th>Region</th>
                            <th>Month</th>
                            <th>Year</th>
                            <th>Target</th>
                            <th>Achievement</th>
                            <th>Bill Amount</th>
                          </tr>
                        </thead>
                        <tbody>
                          {sfiDetailsData?.data?.map((item, index) => {
                            return (
                              <tr key={index}>
                                <td>
                                  <input
                                    type="checkbox"
                                    checked={item?.isSelected}
                                    onChange={(e) => {
                                      const checked = e?.target?.checked;
                                      const copySFIDetailsData =
                                        sfiDetailsData?.data?.map(
                                          (item, ind) =>
                                            ind === index
                                              ? { ...item, isSelected: checked }
                                              : item
                                        );

                                      setSFIDetailsData((prevState) => ({
                                        ...prevState,
                                        data: copySFIDetailsData,
                                      }));
                                    }}
                                  />
                                </td>
                                <td
                                  style={{ width: '30px' }}
                                  className="text-center"
                                >
                                  {index + 1}
                                </td>
                                <td>{item?.employeeId}</td>
                                <td>{item?.employeeName}</td>
                                <td>{item?.territory}</td>
                                <td>{item?.area}</td>
                                <td>{item?.region}</td>
                                <td>{getMonthName(item?.monthid)}</td>
                                <td>{item?.yearid}</td>
                                <td className="text-right">{item?.target}</td>
                                <td className="text-right">
                                  {_formatMoney(item?.achievemtn)}
                                </td>
                                <td className="text-right">
                                  <InputField
                                    value={item?.billAmount}
                                    name="billAmount"
                                    type="number"
                                    onChange={(e) => {
                                      const value = e.target.value;

                                      const copySFIDetailsData =
                                        sfiDetailsData?.data?.map(
                                          (item, ind) =>
                                            ind === index
                                              ? { ...item, billAmount: value }
                                              : item
                                        );

                                      setSFIDetailsData((prevState) => ({
                                        ...prevState,
                                        data: copySFIDetailsData,
                                      }));
                                    }}
                                  />
                                </td>
                              </tr>
                            );
                          })}

                          <tr>
                            <td colSpan={10}>Total</td>
                            <td className="text-right">
                              {_formatMoney(commonTotal('achievemtn'))}
                            </td>
                            <td className="text-right">
                              {_formatMoney(commonTotal('billAmount'))}
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    ) : (
                      <></>
                    )}
                  </div>
                </div>
              </div>
            </Form>
          </CardBody>
        </Card>
      )}
    </Formik>
  );
};

export default SalesForceIncetiveDetailsModal;
