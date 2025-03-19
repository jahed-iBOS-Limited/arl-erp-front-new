import { Formik } from "formik";
import React, { useEffect } from "react";
import {
  Card,
  CardBody,
  CardHeader,
  CardHeaderToolbar,
  ModalProgressBar,
} from "../../../../../_metronic/_partials/controls";
import useAxiosGet from "../../../_helper/customHooks/useAxiosGet";
import Loading from "../../../_helper/_loading";

function QcViewModal({ weightmentId }) {
  const [qcInfo, getQcInfo] = useAxiosGet();

  useEffect(() => {
    getQcInfo(
      `/mes/WeightBridge/GetWeightBridgeQCView?WeightmentId=${weightmentId}`
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [weightmentId]);
  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={{}}
        // validationSchema={{}}
        onSubmit={() => {}}
      >
        {({ values }) => (
          <>
            <Card>
              {true && <ModalProgressBar />}
              <CardHeader title={"QC View"}>
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
                <div className="row">
                  <div className="col-lg-12">
                    <table className="table table-striped table-bordered mt-3 bj-table bj-table-landing">
                      <thead>
                        <tr>
                          <th>Item Code</th>
                          <th>Item Name</th>
                          <th>UoM</th>
                          <th>Quantity</th>
                        </tr>
                      </thead>
                      <tbody>
                        {qcInfo?.length > 0 &&
                          qcInfo?.map((item, index) => (
                            <tr>
                              <td className="text-center">
                                {item?.strItemCode}
                              </td>
                              <td>{item?.strItemName}</td>
                              <td>Metric Tons</td>
                              <td className="text-center">
                                {item?.numQuantity}
                              </td>
                            </tr>
                          ))}
                      </tbody>
                    </table>
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

export default QcViewModal;
