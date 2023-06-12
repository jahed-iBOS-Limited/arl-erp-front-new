import { Form, Formik } from "formik";
import React from "react";
import { useHistory } from "react-router-dom";
import Loading from "../../../_helper/_loading";
import IForm from "../../../_helper/_form";
import NewSelect from "../../../_helper/_select";
import { useEffect } from "react";
import { shallowEqual, useSelector } from "react-redux";
import InputField from "../../../_helper/_inputField";
import IView from "../../../_helper/_helperIcons/_view";
import IEdit from "../../../_helper/_helperIcons/_edit";
import { _todayDate } from "../../../_helper/_todayDate";
import useAxiosGet from "../../../_helper/customHooks/useAxiosGet";

const initData = {
    purchaseOrganization: "",
    rfqType: "",
    status: "",
    fromDate: _todayDate(),
    toDate: _todayDate(),
};
export default function RequestForQuotationLanding() {

    const { profileData, selectedBusinessUnit } = useSelector((state) => {
        return state.authData;
    }, shallowEqual);

    const saveHandler = (values, cb) => { };
    const history = useHistory();

    const [purchangeOrgListDDL, getPurchaseOrgListDDL, purchaseOrgListDDLloader] = useAxiosGet();
    const [landingData, getLandingData, landingDataLoader, setLandingData] = useAxiosGet();

    useEffect(() => {
        setLandingData([
            {
                sl: 1,
                rfqNo: "RFQ-001",
                rfqDate: "2021-08-01",
                currency: "BDT",
                rfqStartDateTime: "2021-08-01 10:00 AM",
                rfqEndDateTime: "2021-08-01 10:00 AM",
                status: "Open",
                createdBy: "Tamkin"

            }
        ]);
        getPurchaseOrgListDDL(`/procurement/BUPurchaseOrganization/GetBUPurchaseOrganizationDDL?AccountId=${profileData?.accountId
            }&BusinessUnitId=${selectedBusinessUnit?.value
            }`)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

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
                    {(purchaseOrgListDDLloader || landingDataLoader) && <Loading />}
                    <IForm
                        title="Request for Quotation"
                        isHiddenReset
                        isHiddenBack
                        isHiddenSave
                        renderProps={() => {
                            return (
                                <div>
                                    <button
                                        type="button" col-lg-2
                                        className="btn btn-primary"
                                        onClick={() => {
                                            history.push("/mngProcurement/purchase-management/rfq/create");
                                        }}
                                    >
                                        Create
                                    </button>
                                </div>
                            );
                        }}
                    >
                        <Form>
                            <div className="row global-form" >
                                <div className="col-lg-2">
                                    <NewSelect
                                        name="purchaseOrganization"
                                        options={purchangeOrgListDDL || []}
                                        value={values?.purchaseOrganization}
                                        label="Purchase Organization"
                                        onChange={(v) => {
                                            setFieldValue("purchaseOrganization", v);
                                        }}
                                        placeholder="Purchase Organization"
                                        errors={errors}
                                        touched={touched}
                                    />
                                </div>
                                <div className="col-lg-2">
                                    <NewSelect
                                        name="rfqType"
                                        options={
                                            [
                                                { value: 1, label: 'Request for quotation' },
                                                { value: 2, label: 'Request for Information' },
                                                { value: 3, label: 'Request for Proposal' }
                                            ]
                                        }
                                        value={values?.rfqType}
                                        label="RFQ Type"
                                        onChange={(v) => {
                                            setFieldValue("rfqType", v);
                                        }}
                                        placeholder="RFQ Type"
                                        errors={errors}
                                        touched={touched}
                                    />
                                </div>
                                <div className="col-lg-2">
                                    <NewSelect
                                        name="status"
                                        options={
                                            [
                                                { value: 0, label: 'ALL' },
                                                { value: 1, label: 'Live' },
                                                { value: 2, label: 'Closed' },
                                                { value: 3, label: 'Pending' },
                                                { value: 4, label: 'Waiting' }
                                            ]
                                        }
                                        value={values?.status}
                                        label="Status"
                                        onChange={(v) => {
                                            setFieldValue("status", v);
                                        }}
                                        placeholder="RFQ Type"
                                        errors={errors}
                                        touched={touched}
                                    />
                                </div>
                                <div className="col-lg-2">
                                    <InputField
                                        label="From Date"
                                        value={values?.fromDate}
                                        name="fromDate"
                                        placeholder="From Date"
                                        type="date"
                                        onChange={(e) => {
                                            setFieldValue("fromDate", e.target.value);
                                        }}
                                    />
                                </div>
                                <div className="col-lg-2">
                                    <InputField
                                        label="To Date"
                                        value={values?.toDate}
                                        name="toDate"
                                        placeholder="To Date"
                                        type="date"
                                        onChange={(e) => {
                                            setFieldValue("toDate", e.target.value);
                                        }}
                                        disabled={false}
                                    />
                                </div>
                                <div className="col-lg-2">
                                    <button
                                        type="button"
                                        className="btn btn-primary"
                                        style={{
                                            marginTop: "18px",
                                        }}
                                        onClick={() => {
                                            console.log("values", values);
                                            getLandingData(``)
                                        }}
                                        disabled={
                                            !values?.purchaseOrganization ||
                                            !values?.rfqType ||
                                            !values?.status ||
                                            !values?.fromDate ||
                                            !values?.toDate
                                        }
                                    >
                                        View
                                    </button>
                                </div>
                            </div>
                            <div>
                                {landingData?.length > 0 ? (<table className="table table-striped table-bordered bj-table bj-table-landing">
                                    <thead>
                                        <tr>
                                            <th>SL</th>
                                            <th>RFQ No</th>
                                            <th>RFQ Date</th>
                                            <th>Currency</th>
                                            <th>RFQ Start Date-Time</th>
                                            <th>RFQ End Date-Time</th>
                                            <th>Status</th>
                                            <th>Created By</th>
                                            <th>Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {landingData?.map((item, index) => (
                                            <tr key={index}>
                                                <td>{index + 1}</td>
                                                <td>{item?.rfqNo}</td>
                                                <td>{item?.rfqDate}</td>
                                                <td>{item?.currency}</td>
                                                <td>{item?.rfqStartDateTime}</td>
                                                <td>{item?.rfqEndDateTime}</td>
                                                <td>{item?.status}</td>
                                                <td>{item?.createdBy}</td>
                                                <td className="text-center">
                                                    <span
                                                        onClick={() => {
                                                            console.log("view Clicked");
                                                        }}
                                                        className="ml-2 mr-3"
                                                    >
                                                        <IView />
                                                    </span>
                                                    <span className="ml-1">
                                                        <IEdit
                                                            onClick={(e) => {
                                                                console.log("edit clicked");
                                                            }}
                                                        />
                                                    </span>
                                                    {/* <OverlayTrigger overlay={<Tooltip id="cs-icon">{"Send To Supplier"}</Tooltip>}>
                                                        <span>
                                                            <i className={`fa fa-sign-out cursor-pointer ml-1`} />
                                                        </span>
                                                    </OverlayTrigger> */}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>) : null}
                            </div>
                        </Form>
                    </IForm>
                </>
            )}
        </Formik>
    );
}