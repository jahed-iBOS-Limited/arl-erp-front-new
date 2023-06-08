import { Formik } from "formik";
import React, { useEffect } from "react";
import { Card, CardBody, CardHeader, ModalProgressBar } from "../../../../../_metronic/_partials/controls";
import useAxiosGet from "../../../_helper/customHooks/useAxiosGet";
import Loading from "../../../_helper/_loading";

export default function GateInListViewModal({ data }) {
  const [landingData, getData, loading] = useAxiosGet([]);
  useEffect(() => {
    if (data) {
      getData(`/mes/MSIL/GetAllGateInByPOByDriver?gateInByPOHeaderId=${data?.intGateInByPoid}&PONumber=${data?.intPonumber}`);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);
  return (
    <>
      <Formik
        enableReinitialize={true}
        // validationSchema={{}}
        onSubmit={() => {}}
      >
        {({ values }) => (
          <>
            <Card>
              {true && <ModalProgressBar />}
              <CardHeader title={"Item list by driver"}></CardHeader>
              <CardBody>
                {loading && <Loading />}
                <div className="row">
                  <div className="col-lg-12">
                    <table className="table table-striped table-bordered mt-3 bj-table bj-table-landing">
                      <thead>
                        <tr>
                          <th style={{ width: "30px" }}>SL</th>
                          <th>Item Name</th>
                          <th>UoM</th>
                          <th>Quantity</th>
                        </tr>
                      </thead>
                      <tbody>
                        {landingData?.length > 0 &&
                          landingData?.map((item, index) => (
                            <tr key={index}>
                              <td className="text-center">{index + 1}</td>
                              <td>{item?.strItemName}</td>
                              <td className="text-center">{item?.strUomname}</td>
                              <td className="text-right">{item?.numQuantity}</td>
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
