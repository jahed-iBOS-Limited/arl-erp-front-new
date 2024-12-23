import Axios from 'axios';
import { Field, Form, Formik } from 'formik';
import React, { useEffect, useState } from 'react';
import Select from 'react-select';
import * as Yup from 'yup';
import { Input } from '../../../../../../_metronic/_partials/controls';
import customStyles from '../../../../selectCustomStyle';

// Validation schema
const ProductEditSchema = Yup.object().shape({
  itemCategoryName: Yup.string()
    .min(2, 'Minimum 2 symbols')
    .max(100, 'Maximum 100 symbols')
    .required('Item Category is required'),
  itemTypeName: Yup.object().shape({
    label: Yup.string().required('Item Type is required'),
    value: Yup.string().required('Item Type is required'),
  }),
});

export default function _Form({
  product,
  btnRef,
  saveItemCategory,
  resetBtnRef,
  itemCategoryName,
}) {
  const [itemTypeList, setItemTypeList] = useState('');
  const [itemTypeOption, setItemTypeOption] = useState([]);

  useEffect(() => {
    getInfoData();
  }, []);

  const getInfoData = async () => {
    try {
      const res = await Axios.get('/item/ItemCategory/GetItemTypeListDDL');
      setItemTypeList(res.data);
    } catch (error) {}
  };

  useEffect(() => {
    const itemTypes = [];
    itemTypeList &&
      itemTypeList.forEach((item) => {
        let items = {
          value: item.itemTypeId,
          label: item.itemTypeName,
        };
        itemTypes.push(items);
      });
    setItemTypeOption(itemTypes);
  }, [itemTypeList]);

  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={product}
        validationSchema={ProductEditSchema}
        onSubmit={(values, { setSubmitting, resetForm }) => {
          saveItemCategory(values, () => {
            resetForm(product);
          });
        }}
      >
        {({
          handleSubmit,
          resetForm,
          values,
          handleChange,
          errors,
          touched,
          setFieldValue,
          isValid,
        }) => (
          <>
            <Form className="form form-label-right">
              <div className="form-group row global-form">
                <div className="col-lg-4">
                  <label>Item Type Name</label>
                  <Field
                    name="itemTypeName"
                    component={() => (
                      <Select
                        options={itemTypeOption}
                        placeholder="Select Item Type"
                        value={values.itemTypeName}
                        onChange={(valueOption) => {
                          setFieldValue('itemTypeName', valueOption);
                        }}
                        isSearchable={true}
                        styles={customStyles}
                        name="itemTypeName"
                      />
                    )}
                    placeholder="Select Item Type"
                    label="Select Item Type"
                  />
                  <p
                    style={{
                      fontSize: '0.9rem',
                      fontWeight: 400,
                      width: '100%',
                      marginTop: '0.25rem',
                    }}
                    className="text-danger"
                  >
                    {errors?.itemTypeName?.value}
                  </p>
                </div>

                <div className="col-lg-4">
                  <Field
                    name="itemCategoryName"
                    component={Input}
                    placeholder="Item Category Name"
                    label="Item Category Name"
                    disabled={itemCategoryName}
                  />
                </div>
              </div>

              <button
                type="submit"
                style={{ display: 'none' }}
                ref={btnRef}
                onSubmit={() => handleSubmit()}
              ></button>

              <button
                type="reset"
                style={{ display: 'none' }}
                ref={resetBtnRef}
                onSubmit={() => resetForm(product)}
              ></button>
            </Form>
          </>
        )}
      </Formik>
    </>
  );
}
