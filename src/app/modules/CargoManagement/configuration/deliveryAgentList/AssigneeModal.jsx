import { Button, IconButton } from '@material-ui/core';
import { Form, Formik } from "formik";
import React from 'react';
import * as Yup from 'yup';
import IDelete from '../../../_helper/_helperIcons/_delete';
import NewSelect from '../../../_helper/_select';
import IViewModal from '../../../_helper/_viewModal';
import ICustomCard from '../../../_helper/_customCard';

const validationSchema = Yup.object().shape({
    shipper: Yup.object().shape({ value: Yup.string().required("Shipper is required") }),
    consignee: Yup.object().shape({ value: Yup.string().required("Consignee is required") }),
    deliveryAgent: Yup.object().shape({ value: Yup.string().required("Delivery Agent is required") }),
    notifyParty: Yup.object().shape({ value: Yup.string().required("Notify Party is required") }),
})

const initialValues = {
    shipper: { value: "", label: "" },
    consignee: { value: "", label: "" },
    deliveryAgent: { value: "", label: "" },
    notifyParty: { value: "", label: "" }
}

export default function AssigneeModal() {
    const [isModalOpen, setIsModalOpen] = React.useState(false);
    const formikRef = React.useRef(null);
    const [addedItem, setAddedItem] = React.useState([]);

    const saveHandler = (values, cb) => {
        console.log(values, "values");
        setAddedItem((prev) => [...prev, values]);
        cb();
    }
    return (
        <div>
            <Button
                onClick={() => {
                    setIsModalOpen(true);
                }}
                title='Assignee'
            // startIcon={<i class="fa fa-user-plus" aria-hidden="true"></i>}
            >
                <i class="fa fa-user-plus" aria-hidden="true"></i>

            </Button>
            <IViewModal
                title="Assignee Modal"
                show={isModalOpen}
                onHide={() => {
                    setIsModalOpen(false);
                }}
            >
                <ICustomCard
                    title={"Assign Business Partner"}
                    backHandler={() => {
                        setIsModalOpen(false);
                    }}
                    saveHandler={(values) => {
                        // formikRef.current.submitForm();
                    }}
                    resetHandler={() => { formikRef.current.resetForm() }
                    }
                >

                    <Formik
                        enableReinitialize={true}
                        initialValues={initialValues}
                        validationSchema={validationSchema}
                        onSubmit={(values, { setSubmitting, resetForm }) => {
                            saveHandler(values, () => {
                                resetForm();
                            });
                        }}
                        innerRef={formikRef}
                    >
                        {({ errors, touched, setFieldValue, isValid, values, resetForm }) => (
                            <>
                                <Form className="form form-label-right">

                                    <div className="form-group row global-form">
                                        {/* Shipper */}
                                        <div className="col-lg-3">
                                            <NewSelect
                                                label="Select Shipper"
                                                options={[
                                                    { value: "Shipper 1", label: "Shipper 1" },
                                                    { value: "Shipper 2", label: " Shipper 2" },

                                                ]}
                                                value={values?.shipper}
                                                name="shipper"
                                                onChange={(valueOption) => {
                                                    if (valueOption) {
                                                        setFieldValue('shipper', valueOption);
                                                    } else {
                                                        setFieldValue('shipper', '');
                                                    }
                                                }}
                                                errors={errors}
                                                touched={touched}


                                            />
                                        </div>
                                        {/* Consignee */}
                                        <div className="col-lg-3">
                                            <NewSelect
                                                label="Select Consignee"
                                                options={[
                                                    { value: "Consignee 1", label: "Consignee 1" },
                                                    { value: "Consignee 2", label: "Consignee 2" },
                                                ]}
                                                value={values?.consignee}
                                                name="consignee"
                                                onChange={(valueOption) => {
                                                    if (valueOption) {
                                                        setFieldValue('consignee', valueOption);
                                                    } else {
                                                        setFieldValue('consignee', '');
                                                    }
                                                }}
                                                errors={errors}
                                                touched={touched}

                                            />
                                        </div>
                                        {/* Delivery Agent */}
                                        <div className="col-lg-3">
                                            <NewSelect
                                                label="Select Delivery Agent"
                                                options={[
                                                    { value: "Delivery Agent 1", label: "Delivery Agent 1" },
                                                    { value: "Delivery Agent 2", label: "Delivery Agent 2" },
                                                ]}
                                                value={values?.deliveryAgent}
                                                name="deliveryAgent"
                                                onChange={(valueOption) => {
                                                    if (valueOption) {
                                                        setFieldValue('deliveryAgent', valueOption);
                                                    } else {
                                                        setFieldValue('deliveryAgent', '');
                                                    }
                                                }}
                                                errors={errors}
                                                touched={touched}
                                            />
                                        </div>
                                        {/* Notify Party */}
                                        <div className="col-lg-3">
                                            <NewSelect
                                                label="Select Notify Party"
                                                options={[
                                                    { value: "Notify Party 1", label: "Notify Party 1" },
                                                    { value: "Notify Party 2", label: "Notify Party 2" },
                                                ]}

                                                value={values?.notifyParty}
                                                name="notifyParty"
                                                onChange={(valueOption) => {
                                                    if (valueOption) {
                                                        setFieldValue('notifyParty', valueOption);
                                                    } else {
                                                        setFieldValue('notifyParty', '');
                                                    }
                                                }}
                                                errors={errors}
                                                touched={touched}

                                            />
                                        </div>

                                    </div>
                                    <div className="d-flex justify-content-end my-1">
                                        <button type="submit" className="btn btn-primary">
                                            Add
                                        </button>
                                    </div>


                                </Form>
                            </>
                        )}
                    </Formik>
                    {
                        addedItem?.length > 0 && (
                            <div className="table-responsive">
                                <table className="table table-bordered global-table">
                                    <thead>
                                        <tr>
                                            <th>SL</th>
                                            <th>Business Partner Name</th>
                                            <th>Business Partner Type</th>
                                            <th>Country</th>
                                            <th>Contact Number</th>
                                            <th>Email</th>
                                            <th>Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {addedItem?.map((item, index) => (
                                            <tr key={index}>
                                                <td>{index + 1}</td>
                                                <td>N/A</td>
                                                <td>N/A</td>
                                                <td>N/A</td>
                                                <td>N/A</td>
                                                <td>{item?.email}</td>
                                                <td>
                                                    <div className="d-flex justify-content-center">

                                                        <Button
                                                            onClick={() => {
                                                                setAddedItem((prev) => prev.filter((itm, i) => i !== index));
                                                            }}
                                                            color="error"
                                                            size="small"
                                                            title='Remove'

                                                        >
                                                            <IDelete />
                                                        </Button>

                                                    </div>
                                                </td>

                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )
                    }
                </ICustomCard>
            </IViewModal >
        </div >
    )
}
