import React, { useEffect, useState } from "react";
import IViewModal from "../../../../_helper/_viewModal";
import { getExpenseById } from "../helper";
import { Formik, Form } from "formik";
import Select from "react-select";
import customStyles from "../../../../selectCustomStyle";
import { IInput } from "../../../../_helper/_input";
import { _dateFormatter } from "../../../../_helper/_dateFormate";
import { _todayDate } from "../../../../_helper/_todayDate";
import IView from "../../../../_helper/_helperIcons/_view";
import { _formatMoney } from "../../../../_helper/_formatMoney";
import { useDispatch } from "react-redux";
import { getDownlloadFileView_Action } from "../../../../_helper/_redux/Actions";
import NewSelect from '../../../../_helper/_select';
const initData = {
  expenseCategory: "",
  projectName: "",
  expenseFrom: _todayDate(),
  expenseTo: _todayDate(),
  costCenter: "",
  quantity: "",
  reference: "",
  comments1: "",
  expenseDate: _todayDate(),
  transaction: "",
  totalAmount: "",
  location: "",
  comments2: "",
  disbursmentCenter: "",
  paymentType: "",
};

export default function ClearExpenseViewModel({
  show,
  onHide,
  gridRowDataClearExpViewBtn,
}) {
  const id = gridRowDataClearExpViewBtn?.expenseId;
  const [rowDto, setRowDto] = useState([]);
  const [singleData, setSingleData] = useState("");
  const [total, setTotal] = useState({ totalAmount: 0, totalQty: 0 });
  useEffect(() => {
    if (id) {
      getExpenseById(id, setSingleData, setRowDto);
    }
  }, [id]); // location
  //total amount calculation
  useEffect(() => {
    let totalAmount = 0;
    let totalQty = 0;
    if (rowDto.length) {
      for (let i = 0; i < rowDto.length; i++) {
        totalAmount += +rowDto[i].totalAmount;
        totalQty += +rowDto[i].quantity;
      }
    }
    setTotal({ totalAmount, totalQty });
  }, [rowDto]);

  const dispatch = useDispatch();

  return (
    <div className="adjustment-journal-modal">
      <IViewModal
        show={show}
        onHide={onHide}
        isShow={rowDto && false}
        title={"Internal Expense View"}
        style={{ fontSize: "1.2rem !important" }}
        btnText="Close"

      >
        <div>
          <Formik
            enableReinitialize={true}
            initialValues={id ? singleData?.objHeader : initData}
          >
            {({
              handleSubmit,
              resetForm,
              values,
              errors,
              touched,
              setFieldValue,
              isValid,
            }) => (
              <>
                <Form className="form form-label-right">
                  <div className="row">
                    <div className="col-lg-4 mt-6">
                      <div className="row bank-journal bank-journal-custom bj-left">
                        <div className="col-lg-6 pr-1 pl mb-1">
                          <label>Disbursement Center</label>
                          <Select
                            value={values?.disbursmentCenter}
                            isSearchable={true}
                            styles={customStyles}
                            name="disbursmentCenter"
                            placeholder="Disbursement Center"
                            isDisabled={true}
                          />
                        </div>
                        {/* date */}
                        <div className="col-lg-6 pl pr-1 mb-1">
                            
                          <IInput
                            value={_dateFormatter(values?.expenseFrom)}
                            label="From"
                            name="expenseFrom"
                            type="date"
                            disabled={true}
                          />
                                     
                        </div>
                        <div className="col-lg-6 pl pr-1 mb-1">
                          <IInput
                            value={_dateFormatter(values?.expenseTo)}
                            label="To"
                            name="expenseTo"
                            type="date"
                            disabled={true}
                          />
                                           
                        </div>
                        <div className="col-lg-6 pr pl-1 mb-1">
                          <label>Project Name</label>
                          <Select
                            onChange={(valueOption) => {
                              setFieldValue("projectName", valueOption);
                            }}
                            value={values?.projectName}
                            isSearchable={true}
                            styles={customStyles}
                            placeholder="Project Name"
                            name="projectName"
                            isDisabled={true}
                          />
                        </div>
                        <div className="col-lg-6 pr-1 pl">
                          <NewSelect
                            name="expenseGroup"
                            value={values?.expenseGroup}
                            label="Expense Group"
                            onChange={(valueOption) => {
                              setFieldValue("expenseGroup", valueOption);
                            }}
                            placeholder="Expense Group"
                            errors={errors}
                            touched={touched}
                            isDisabled={true}
                          />
                        </div>
                        <div className="col-lg-6 pr-1 pl mb-1">
                          <label>Cost Center</label>
                          <Select
                            value={values?.costCenter}
                            isSearchable={true}
                            styles={customStyles}
                            placeholder="Cost Center"
                            name="costCenter"
                            isDisabled={true}
                          />
                        </div>
                        <div className="col-lg-6 pr-1 pl mb-1">
                          <label>Payment Type</label>
                          <Select
                            onChange={(valueOption) => {
                              setFieldValue("paymentType", valueOption);
                            }}
                            value={values?.paymentType}
                            isSearchable={true}
                            styles={customStyles}
                            name="paymentType"
                            isDisabled={true}
                          />
                        </div>
                        <div className="col-lg-6 pl pr-1 mb-1 h-narration border-gray">
                          <IInput
                            value={values?.reference}
                            label="Vehicle"
                            name="reference"
                            disabled={true}
                          />
                        </div>
                        <div className="col-lg-6 pl pr-1 mb-1 h-narration border-gray">
                          <IInput
                            value={values?.comments1}
                            label="Comments"
                            name="comments1"
                            disabled={true}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="col-lg-8">
                      <div className="row">
                        <div className="col-lg-12 pr-0">
                          <div className="col-lg-3 pl-3 pr mb-0 mt-0 h-narration border-gray offset-9">
                            <b>Total Expense : {total?.totalAmount}</b>
                          </div>
                          <div className="table-responsive">
                            <table className={"table mt-1 bj-table"}>
                              <thead className={rowDto.length < 1 && "d-none"}>
                                <tr>
                                  <th style={{ width: "20px" }}>SL</th>
                                  <th style={{ width: "260px" }}>
                                    Expense Date
                                  </th>
                                  <th style={{ width: "100px" }}>
                                    Expense Type
                                  </th>

                                  <th style={{ width: "100px" }}>Quantity</th>
                                  <th style={{ width: "100px" }}>
                                    Total Amount
                                  </th>
                                  <th style={{ width: "100px" }}>
                                    {" "}
                                    Expense Place
                                  </th>
                                  <th style={{ width: "100px" }}>
                                    Expense Description
                                  </th>
                                  <th style={{ width: "200px" }}>
                                    Driver Name
                                  </th>
                                  <th style={{ width: "50px" }}>Attachment</th>
                                </tr>
                              </thead>
                              <tbody>
                                {rowDto?.map((item, index) => (
                                  <tr key={index}>
                                    <td>{index + 1}</td>
                                    <td>
                                      <div className="text-center">
                                        {_dateFormatter(item?.expenseDate)}
                                      </div>
                                    </td>
                                    <td>
                                      <div className="text-left pl-2">
                                        {item?.transaction?.label}
                                      </div>
                                    </td>

                                    <td>
                                      <div className="text-center">
                                        {item?.quantity}
                                      </div>
                                    </td>
                                    <td>
                                      <div className="text-center">
                                        {_formatMoney(item?.totalAmount)}
                                      </div>
                                    </td>
                                    <td>
                                      <div className="text-left pl-2">
                                        {item?.location}
                                      </div>
                                    </td>
                                    <td>
                                      <div className="text-left pl-2">
                                        {item?.comments2}
                                      </div>
                                    </td>
                                    <td>
                                      <div className="text-left pl-2">
                                        {item?.driverName}
                                      </div>
                                    </td>
                                    <td className="text-center">
                                      {item?.attachmentLink && (
                                        <IView
                                          clickHandler={() => {
                                            dispatch(
                                              getDownlloadFileView_Action(
                                                item?.attachmentLink
                                              )
                                            );
                                          }}
                                        />
                                      )}
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </Form>
              </>
            )}
          </Formik>
        </div>
      </IViewModal>
    </div>
  );
}
