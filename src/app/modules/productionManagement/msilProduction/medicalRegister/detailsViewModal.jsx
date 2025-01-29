import { Formik } from "formik";
import React from "react";
import {
  Card,
  CardBody,
  CardHeader,
  ModalProgressBar,
} from "../../../../../_metronic/_partials/controls";

function MedicalRegisterDetailsView({ medicineList }) {
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
              <CardHeader title={"Medicine Details"}></CardHeader>
              <CardBody>
                <div className="row">
                  <div className="col-lg-12">
                    <div className="table-responsive">
                      <table className="table table-striped table-bordered mt-3 bj-table bj-table-landing">
                        <thead>
                          <tr>
                            <th style={{ width: "30px" }}>SL</th>
                            <th>Medicine Name</th>
                            <th>Medicine Quantity</th>
                            <th>Uom</th>
                            <th>Service Recipient</th>
                            <th>Remarks</th>
                          </tr>
                        </thead>
                        <tbody>
                          {medicineList?.row?.length > 0 &&
                            medicineList?.row?.map((item, index) => (
                              <tr key={index}>
                                <td>{index + 1}</td>
                                <td>{item?.strMedicineName}</td>
                                <td className="text-center">
                                  {item?.numMedicineQuantity}
                                </td>
                                <td>{item?.strUomname}</td>
                                <td>{medicineList?.strServiceRecipientName}</td>
                                <td>{item?.strRemarks}</td>
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

export default MedicalRegisterDetailsView;
