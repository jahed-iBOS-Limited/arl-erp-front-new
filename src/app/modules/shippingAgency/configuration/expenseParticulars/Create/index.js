import { Formik } from "formik";
import React, { useEffect, useState } from "react";
import { shallowEqual, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import ICustomCard from "../../../../_helper/_customCard";
import InputField from "../../../../_helper/_inputField";
import Loading from "../../../../_helper/_loading";
import NewSelect from "../../../../_helper/_select";
import {
  categoryDDL,
  createUpdateExpenseParticularsApi,
  getExpenseParticularsById,
} from "../helper";
import * as Yup from "yup";
import { useParams } from "react-router";
const initData = {
  isActive: true,
  category: "",
  particularName: "",
};
const validationSchema = Yup.object().shape({
  particularName: Yup.string().required("Particular Name is required"),
  category: Yup.object().shape({
    label: Yup.string().required("Category is required"),
    value: Yup.string().required("Category is required"),
  }),
});
const ExpenseParticularsCreate = () => {
  const [loading, setLoading] = useState(false);
  const { editId } = useParams();

  // get user data from store
  const {
    profileData: { accountId: accId, userId },
    selectedBusinessUnit: { value: buId },
  } = useSelector((state) => state?.authData, shallowEqual);

  useEffect(() => {
    if (accId && buId) {
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [accId, buId]);

  const history = useHistory();

  const saveHandler = (values, cb) => {
    const payload = {
      expenseParticularsId: +editId || 0,
      category: values?.category?.label,
      particularName: values?.particularName || "",
      isActive: values?.isActive || false,
      actionBy: userId,
      lastActionDateTime: new Date(),
    };

    createUpdateExpenseParticularsApi(payload, setLoading, () => {
      cb();
      if (editId) {
        commonGetById();
      }
    });
  };

  const formikRef = React.useRef(null);
  useEffect(() => {
    if (editId) {
      commonGetById();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editId]);

  const commonGetById = async () => {
    getExpenseParticularsById(editId, setLoading, (resData) => {
      if (formikRef.current) {
        formikRef.current.setValues({
          particularName: resData?.particularName || "",
          category:
            categoryDDL?.find((itm) => itm?.label === resData?.category) || "",
          isActive: resData?.isActive,
        });
      }
    });
  };

  return (
    <>
      {loading && <Loading />}
      <Formik
        innerRef={formikRef}
        enableReinitialize={true}
        initialValues={initData}
        onSubmit={(values, { setSubmitting, resetForm }) => {
          saveHandler(values, () => {
            resetForm(initData);
          });
        }}
        validationSchema={validationSchema}
      >
        {({
          values,
          setFieldValue,
          touched,
          errors,
          resetForm,
          handleSubmit,
        }) => (
          <>
            <ICustomCard
              title='Expense Particulars Create'
              backHandler={() => {
                history.goBack();
              }}
              saveHandler={() => {
                handleSubmit();
              }}
              resetHandler={() => {
                resetForm(initData);
              }}
            >
              <div className='row global-form my-3'>
                <div className='col-lg-6'>
                  <label>Particular Name</label>
                  <InputField
                    value={values?.particularName}
                    name='particularName'
                    type='text'
                    onChange={(e) => {
                      setFieldValue("particularName", e.target.value);
                    }}
                  />
                </div>
                <div className='col-lg-3'>
                  <NewSelect
                    options={categoryDDL || []}
                    name='category'
                    onChange={(valueOption) => {
                      setFieldValue("category", valueOption);
                    }}
                    placeholder='Category'
                    label='Category'
                    value={values?.category}
                    errors={errors}
                    touched={touched}
                  />
                </div>
                <div className='col-lg-3 mt-5 d-flex justify-content-start align-items-center'>
                  <input
                    type='checkbox'
                    id='checkbox_id'
                    checked={values?.isActive}
                    name='isActive'
                    onChange={(event) => {
                      setFieldValue("isActive", event.target.checked);
                    }}
                  />
                  <label for='checkbox_id' className='mr-2 ml-3'>
                    Is Active
                  </label>
                </div>
              </div>
            </ICustomCard>
          </>
        )}
      </Formik>
    </>
  );
};

export default ExpenseParticularsCreate;
