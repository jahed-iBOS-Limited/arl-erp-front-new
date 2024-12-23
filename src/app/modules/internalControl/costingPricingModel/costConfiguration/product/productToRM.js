import React, { useState, useEffect } from 'react';
import IForm from '../../../../_helper/_form';
import * as Yup from 'yup';
import { Formik, Form } from 'formik';
import { useLocation, useHistory } from 'react-router-dom';
import { toast } from 'react-toastify';
import InputField from '../../../../_helper/_inputField';
import SearchAsyncSelect from '../../../../_helper/SearchAsyncSelect';
import { shallowEqual, useSelector } from 'react-redux';
import axios from 'axios';
import Loading from '../../../../_helper/_loading';
import useAxiosPost from '../../../../_helper/customHooks/useAxiosPost';
import useAxiosGet from '../../../../_helper/customHooks/useAxiosGet';
import IDelete from '../../../../_helper/_helperIcons/_delete';

const initData = {
  productName: '',
  rawMaterial: '',
};

const validationSchema = Yup.object().shape({
  // Add any validation rules here, if needed
});

const ProductToRM = () => {
  const [objProps, setObjprops] = useState({});
  const [rowData, setRowData] = useState([]);
  const [, getProductInfo, productInfoLoading] = useAxiosGet();
  const [, saveData, tagRMloading] = useAxiosPost();
  const { selectedBusinessUnit, profileData } = useSelector(
    (state) => state.authData,
    shallowEqual,
  );
  const location = useLocation();
  const history = useHistory();

  const { item } = location?.state;

  useEffect(() => {
    getProductInfo(
      `costmgmt/Precosting/ProductGetById?productId=${item?.productId}`,
      (data) => {
        setRowData(data?.materialMappings || []);
      },
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedBusinessUnit?.value, item?.productId]);

  const saveHandler = (values) => {
    const materialMappings = [];

    // eslint-disable-next-line no-unused-expressions
    rowData?.forEach((data) => {
      if (data?.materialItemName && data?.materialItemId) {
        materialMappings.push({
          autoId: data?.autoId || 0,
          businessUnitId: selectedBusinessUnit?.value,
          materialItemId: data?.materialItemId,
          materialItemName: data?.materialItemName,
          productId: item?.productId,
          conversion: data?.conversion || 0,
          uomId: data?.uomId,
          uomName: data?.uomName,
        });
      } else {
        console.error('Invalid data in rowData: ', data);
      }
    });

    const payload = {
      productId: item?.productId,
      productName: item?.productName,
      businessUnitId: selectedBusinessUnit?.value,
      uomId: item?.uomId,
      uomName: item?.uomName,
      actionBy: profileData?.userId,
      mappingType: 'materialMappings',
      finishGoodMappings: [],
      materialMappings: [...materialMappings],
      commonCostElement: [],
    };

    saveData(
      `/costmgmt/Precosting/ProductItemMaterialElementConfigure`,
      payload,
      (res) => {
        if (res.statuscode === 200) {
          history.push('/internal-control/costing/costingconfiguration');
        }
      },
    );
  };

  const addNewRawMaterialHandler = (values) => {
    let foundData = rowData?.filter(
      (item) => item?.materialItemId === values?.rawMaterial?.value,
    );
    if (foundData?.length > 0) {
      toast.warning('Raw Material already exists', { toastId: 'RMe' });
    } else {
      let payload = {
        materialItemId: values?.rawMaterial?.value,
        materialItemName: values?.rawMaterial?.label,
        conversion: +values?.conversion,
        uomId: values?.rawMaterial?.uomId,
        uomName: values?.rawMaterial?.uomName,
      };
      setRowData([...rowData, payload]);
    }
  };

  const handleDelete = (rmValue) => {
    const filterData = rowData.filter(
      (item) => item.materialItemId !== rmValue,
    );
    setRowData(filterData);
  };

  return (
    <>
      <IForm title={'Product to RM Configuration'} getProps={setObjprops}>
        <Formik
          enableReinitialize={true}
          initialValues={initData}
          validationSchema={validationSchema}
          onSubmit={(values, { setSubmitting, resetForm }) => {
            saveHandler(values);
            resetForm(initData);
          }}
        >
          {({ handleSubmit, resetForm, values, errors, setFieldValue }) => (
            <>
              {(tagRMloading || productInfoLoading) && <Loading />}
              <Form className="global-form form form-label-right">
                <div className="form-group row">
                  <div className="col-lg-3">
                    <label>Product Name</label>
                    <InputField
                      value={item?.productName}
                      name="Product Name"
                      placeholder="Product Name"
                      type="text"
                      disabled={true}
                    />
                  </div>

                  <div className="col-lg-3">
                    <label>Raw Material</label>
                    <SearchAsyncSelect
                      selectedValue={values?.rawMaterial}
                      handleChange={(valueOption) => {
                        setFieldValue('rawMaterial', valueOption);
                      }}
                      placeholder="Minimum 3 characters to search"
                      loadOptions={(v) => {
                        const searchValue = v.trim();
                        if (searchValue?.length < 3) return [];
                        return axios
                          .get(
                            `/costmgmt/Precosting/GetPrecostingItemDDL?businessUnitId=${selectedBusinessUnit?.value}&itemTypeId=1&search=${searchValue}`,
                          )
                          .then((res) => res?.data);
                      }}
                    />
                  </div>
                  <div className="col-lg-3">
                    <label>Convertion Rate</label>
                    <InputField
                      value={values?.conversion}
                      name="conversion"
                      onChange={(e) => {
                        if (+e.target.value > 0 || +e.target.value === 0) {
                          setFieldValue('conversion', e.target.value);
                        } else {
                          setFieldValue('conversion', '');
                        }
                      }}
                      placeholder="Convertion Rate"
                      type="number"
                    />
                  </div>
                  <div className="col-lg-2 pt-6">
                    <button
                      type="button"
                      disabled={!values?.rawMaterial || !values?.conversion}
                      className="btn btn-primary"
                      onClick={() => {
                        addNewRawMaterialHandler(values);
                      }}
                    >
                      Add
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  style={{ display: 'none' }}
                  ref={objProps.btnRef}
                  onSubmit={() => handleSubmit()}
                ></button>

                <button
                  type="reset"
                  style={{ display: 'none' }}
                  ref={objProps.resetBtnRef}
                  onSubmit={() => resetForm(initData)}
                ></button>
              </Form>

              <div className="table-responsive pt-5">
                <table className="table table-striped table-bordered mt-3 bj-table bj-table-landing">
                  {rowData?.length > 0 && (
                    <thead>
                      <tr>
                        <th>SL</th>
                        <th>Raw Material</th>
                        <th>UOM</th>
                        <th>Conversion</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                  )}
                  <tbody>
                    {rowData?.length > 0 &&
                      rowData?.map((item, index) => (
                        <tr key={index}>
                          <td style={{ width: '15px' }} className="text-center">
                            {index + 1}
                          </td>
                          <td>
                            <span className="pl-2 text-center">
                              {item?.materialItemName}
                            </span>
                          </td>
                          <td>
                            <span className="pl-2 text-center">
                              {item?.uomName || ''}
                            </span>
                          </td>
                          <td>
                            <span className="pl-2 text-center">
                              {item?.conversion || ''}
                            </span>
                          </td>
                          <td>
                            <span
                              style={{ cursor: 'pointer' }}
                              onClick={() => handleDelete(item?.materialItemId)}
                            >
                              <IDelete />
                            </span>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </Formik>
      </IForm>
    </>
  );
};

export default ProductToRM;
