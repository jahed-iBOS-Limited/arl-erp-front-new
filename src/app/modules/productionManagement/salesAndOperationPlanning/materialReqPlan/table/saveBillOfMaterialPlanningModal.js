import React, { useEffect, useState } from "react";
import ICustomCard from "../../../../_helper/_customCard";
import InputField from "../../../../_helper/_inputField";
import { getBillOfMaterialPlan, saveBillOfMaterialPlanning } from "../helper";
import { useSelector } from "react-redux";
import Loading from "../../../../_helper/_loading";
import moment from "moment";
import { toast } from "react-toastify";

function SaveBillOfMaterialPlanningModal({ clickRowDto, landingCB }) {
  const [rowDto, setRowDto] = useState([]);
  const [loading, setLoading] = useState(false);

  const { selectedBusinessUnit } = useSelector((state) => {
    return {
      profileData: state.authData.profileData,
      selectedBusinessUnit: state.authData.selectedBusinessUnit,
    };
  });

  useEffect(() => {
    getBillOfMaterialPlan(
      clickRowDto?.intItemId,
      clickRowDto?.year?.value,
      selectedBusinessUnit?.value,
      setRowDto,
      setLoading
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const saveHandler = () => {
    // mimimum 1 quantity and rate
    if (rowDto?.length > 0) {
      const check = rowDto?.filter((item) => {
        return item?.quantity > 0 && item?.rate > 0;
      });
      if (check?.length === 0) {
        return toast.warn("Quantity and Rate must be greater than 0");
      }
    }

    const year = clickRowDto?.year?.label;
    const firstDateOfYear = moment(year)
      .startOf("year")
      .format("YYYY-MM-DD");

    const lastDateOfYear = moment(year)
      .endOf("year")
      .format("YYYY-MM-DD");

    const payload = rowDto?.map((item) => ({
      id: item?.id || 0,
      itemId: clickRowDto?.intItemId || 0,
      itemCode: clickRowDto?.stritemcode || "",
      itemName: clickRowDto?.stritemname || "",
      quantity: +item?.quantity || 0,
      rate: +item?.rate || 0,
      fromDate: firstDateOfYear,
      toDate: lastDateOfYear,
      yearId: +clickRowDto?.year?.value,
      monthId: +item?.monthId || 0,
    }));

    saveBillOfMaterialPlanning(payload, setLoading, () => {
      setRowDto([]);
      landingCB();
    });
  };
  return (
    <>
      {loading && <Loading />}
      <ICustomCard
        title='Material Annual Planning'
        saveHandler={() => {
          saveHandler();
        }}
      >
        <div className='d-flex mt-2'>
          <p className='mr-5 mb-1'>
            <span className='font-weight-bold'>Item Name:</span>{" "}
            {clickRowDto?.stritemname}
          </p>
          <p className='mb-1'>
            <span className='font-weight-bold'>Year:</span>{" "}
            {clickRowDto?.year?.label}
          </p>
        </div>

        <div className='table-responsive'>
          <table className='table table-striped table-bordered global-table mt-0'>
            <thead>
              <tr>
                <th>SL</th>
                <th>Month Name</th>
                <th>Quantity</th>
                <th>Rate</th>
                <th>Amount</th>
              </tr>
            </thead>
            <tbody>
              {rowDto?.map((item, i) => {
                const amount = (+item?.quantity || 0) * (+item?.rate || 0);
                return (
                  <tr key={i + 1}>
                    <td>{i + 1}</td>
                    <td className=''>{item?.monthName}</td>
                    <td>
                      <InputField
                        value={item?.quantity}
                        name='quantity'
                        onChange={(e) => {
                          const copy = [...rowDto];
                          copy[i].quantity = e.target.value;
                          setRowDto(copy);
                        }}
                        placeholder='Quantity'
                        type='number'
                      />
                    </td>
                    <td>
                      <InputField
                        value={item?.rate}
                        name='rate'
                        onChange={(e) => {
                          const copy = [...rowDto];
                          copy[i].rate = e.target.value;
                          setRowDto(copy);
                        }}
                        placeholder='Rate'
                        type='number'
                      />
                    </td>
                    <td className='text-right'>{amount}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </ICustomCard>
    </>
  );
}

export default SaveBillOfMaterialPlanningModal;
