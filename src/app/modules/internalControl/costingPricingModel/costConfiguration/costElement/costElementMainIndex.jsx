import { Form, Formik } from 'formik';
import React, { useEffect, useState } from 'react';
import { shallowEqual, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import * as Yup from 'yup';
import { CardHeaderToolbar } from '../../../../../../_metronic/_partials/controls';
import IDelete from '../../../../_helper/_helperIcons/_delete';
import InputField from '../../../../_helper/_inputField';
import Loading from '../../../../_helper/_loading';
import useAxiosGet from '../../../../_helper/customHooks/useAxiosGet';
import useAxiosPost from '../../../../_helper/customHooks/useAxiosPost';

const initData = {
  productName: '',
  finishedGood: '',
};

const validationSchema = Yup.object().shape({
  //   productName: Yup.string().required("Product Name is required"),
  //   finishedGood: Yup.string().required("Finished Good is required"),
});
const ProductToFG = () => {
  const [, saveData, tagFGloading] = useAxiosPost();
  const [, getProductInfo, productInfoLoading] = useAxiosGet();
  const [objProps] = useState({});
  const [rowData, setRowData] = useState([]);
  const { selectedBusinessUnit, profileData } = useSelector(
    (state) => state.authData,
    shallowEqual
  );
  useEffect(() => {
    getProductInfo(`costmgmt/Precosting/ProductGetById?productId=0`, (data) => {
      setRowData(data?.commonCostElement || []);
    });
  }, [selectedBusinessUnit?.value]);

  const saveHandler = (values) => {
    const costElemtList = [];

    // Use forEach instead of map for side effects (pushing data)

    rowData?.forEach((data) => {
      if (data?.costElementName) {
        costElemtList.push({
          costElementId: data?.costElementId || 0,
          costElementName: data?.costElementName,
        });
      } else {
        console.error('Invalid data in rowData: ', data);
      }
    });

    const payload = {
      actionBy: profileData?.userId,
      mappingType: 'commonCostElement',
      finishGoodMappings: [],
      materialMappings: [],
      commonCostElement: [...costElemtList],
    };
    saveData(
      `/costmgmt/Precosting/ProductItemMaterialElementConfigure`,
      payload,
      (res) => {
        if (res.statuscode === 200) {
          toast.success('Created Successfully');
        } else {
          toast.error('Failed!');
        }
      }
    );
  };

  const addNewFeatureHandler = (values) => {
    let foundData = rowData?.filter(
      (item) => item?.costElementName === values?.costElementName
    );
    if (foundData?.length > 0) {
      toast.warning('Cost element already exist', { toastId: 'Fae' });
    } else {
      let payload = {
        costElementName: values?.costElementName,
      };
      setRowData([...rowData, payload]);
    }
  };

  const handleDelete = (fgValue) => {
    const filterData = rowData.filter(
      (item) => item.costElementName !== fgValue
    );
    setRowData(filterData);
  };
  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={initData}
        validationSchema={validationSchema}
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
          errors,
          touched,
          setFieldValue,
          isValid,
        }) => (
          <>
            {(tagFGloading || productInfoLoading) && <Loading />}
            <Form className="global-form form form-label-right">
              <div className="form-group row">
                <div className="col-lg-3">
                  <InputField
                    value={values?.costElementName}
                    label="Cost Element Name"
                    name="costElementName"
                    type="text"
                    onChange={(e) =>
                      setFieldValue('costElementName', e.target.value)
                    }
                  />
                </div>

                <div className="col-lg-3 pt-6">
                  <button
                    type="button"
                    disabled={!values?.costElementName}
                    className="btn btn-primary"
                    onClick={() => {
                      addNewFeatureHandler(values);
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
            <CardHeaderToolbar>
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => saveHandler()}
              >
                Save
              </button>
            </CardHeaderToolbar>
            <div className="table-responsive pt-5">
              <table className="table table-striped table-bordered mt-3 bj-table bj-table-landing">
                {rowData?.length > 0 && (
                  <thead>
                    <tr>
                      <th>SL</th>
                      <th>Cost Element</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                )}
                <tbody>
                  {rowData?.length > 0 &&
                    rowData?.map((item, index) => {
                      return (
                        <tr key={index}>
                          <td style={{ width: '15px' }} className="text-center">
                            {index + 1}
                          </td>
                          <td>
                            <span className="pl-2 text-center">
                              {item?.costElementName}
                            </span>
                          </td>
                          <td>
                            <span
                              style={{ cursor: 'pointer' }}
                              onClick={() => {
                                handleDelete(item?.costElementName);
                              }}
                            >
                              <IDelete />
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                </tbody>
              </table>
            </div>
          </>
        )}
      </Formik>
    </>
  );
};

export default ProductToFG;
