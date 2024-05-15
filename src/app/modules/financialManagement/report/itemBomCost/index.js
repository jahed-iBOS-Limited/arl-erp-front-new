import { Formik } from "formik";
import React, { useEffect } from "react";
import { shallowEqual, useSelector } from "react-redux";
import {
  Card,
  CardBody,
  CardHeader,
  CardHeaderToolbar,
  ModalProgressBar,
} from "../../../../../_metronic/_partials/controls";
import useAxiosGet from "../../../_helper/customHooks/useAxiosGet";
import { _formatMoney } from "../../../_helper/_formatMoney";
import Loading from "../../../_helper/_loading";
import { _todayDate } from "../../../_helper/_todayDate";

const initData = {
  fromDate: _todayDate(),
};
function ItemBomCost() {
  const [rowData, getRowData] = useAxiosGet();

  const selectedBusinessUnit = useSelector((state) => {
    return state.authData.selectedBusinessUnit;
  }, shallowEqual);

  useEffect(() => {
    getRowData(
      `/fino/Report/GetBOMCost?intUnitId=${selectedBusinessUnit?.value}`
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={initData}
        // validationSchema={{}}
        onSubmit={() => {}}
      >
        {({ values, errors, touched, setFieldValue }) => (
          <>
            <Card>
              {true && <ModalProgressBar />}
              <CardHeader title={"Item BOM Cost"}>
                <CardHeaderToolbar>
                  {/* <button
                    onClick={() => {
                      history.push({
                        pathname: `/financial-management/invoicemanagement-system/salesInvoice/create`,
                        state: values,
                      });
                    }}
                    className="btn btn-primary ml-2"
                    type="button"
                  >
                    Create
                  </button> */}
                </CardHeaderToolbar>
              </CardHeader>
              <CardBody>
                {false && <Loading />}
                {/* <div className="global-form">
                  <div className="row">
                    <div className="col-lg-3">
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
                    </div>
                    <div>
                      <button
                        style={{ marginTop: "18px" }}
                        type="button"
                        class="btn btn-primary"
                        disabled={!values?.fromDate}
                        onClick={() => {
                          getRowData(
                            `/fino/Report/GetBOMCost?intUnitId=${selectedBusinessUnit?.value}&date=${values?.fromDate}`
                          );
                        }}
                      >
                        Show
                      </button>
                    </div>
                  </div>
                </div> */}
                <div className="row mt-5">
                  <div className="col-lg-12">
                  <div className="table-responsive">
  <table className="table table-striped table-bordered bj-table bj-table-landing">
                      <thead>
                        <tr>
                          <th>SL</th>
                          <th>Item Code</th>
                          <th>Item Name</th>
                          <th>UoM</th>
                          <th>Lot Size</th>
                          <th>Material Cost</th>
                          <th>Overhead Cost</th>
                          <th>Total Cost</th>
                        </tr>
                      </thead>
                      <tbody>
                        {rowData?.length > 0 &&
                          rowData?.map((item, index) => (
                            <tr key={index}>
                              <td>{index + 1}</td>
                              <td className="text-center">
                                {item?.strItemCode}
                              </td>
                              <td>{item?.strItemName}</td>
                              <td>{item?.strBaseUomName}</td>
                              <td className="text-center">
                                {item?.numLotSize}
                              </td>
                              <td className="text-center">
                                {_formatMoney(item?.numMaterialCost)}
                              </td>
                              <td className="text-center">
                                {_formatMoney(item?.numOhCost)}
                              </td>
                              <td className="text-center">
                                {_formatMoney(item?.numTotalCost)}
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

export default ItemBomCost;
