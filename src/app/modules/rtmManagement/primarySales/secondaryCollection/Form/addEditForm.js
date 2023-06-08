import React, { useState, useEffect } from "react";
import { useSelector, shallowEqual } from "react-redux";
import Form from "./form";
import { GetSecondaryCollectionView } from "../helper";
import { useLocation, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import Loading from "../../../../_helper/_loading";
import ICard from "../../../../_helper/_card";

const initData = {
  orderAmount: "",
};

export default function SecondaryCollectionForm({
  history,
  match: {
    params: { id },
  },
}) {
  const [isDisabled, setDisabled] = useState(false);
  const [objProps, setObjprops] = useState({});
  const [rowDto, setRowDto] = useState([]);
  const params = useParams();
  const location = useLocation();
  const [total, setTotal] = useState({ totalAmount: 0 });
  const setter = (payload) => {
    setRowDto([...rowDto, payload]);
  };

  // get user profile data from store
  const profileData = useSelector((state) => {
    return state.authData.profileData;
  }, shallowEqual);

  // get selected business unit from store
  const selectedBusinessUnit = useSelector((state) => {
    return state.authData.selectedBusinessUnit;
  }, shallowEqual);

  //SingleData to view
  const [singleData, setSingleData] = useState("");
  useEffect(() => {
    if (params?.id) {
      GetSecondaryCollectionView(params?.id, setSingleData, setRowDto);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params]);

  // // Show when in edit mode, rowData
  useEffect(() => {
    // eslint-disable-next-line no-unused-vars
    const newData = singleData?.row?.map((item) => ({
      itemId: item?.productId,
      productName: item?.productName,
      uomname: item?.uomname,
      price: item?.price,
      orderStatus: item?.orderStatus,
      orderQuantity: item?.orderQuantity,
      orderAmount: item?.orderAmount,
    }));

    if (params?.id) {
      setRowDto(newData);
    } else {
      setRowDto([]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [singleData]);

  const saveHandler = async (values, cb) => {
    setDisabled(true);
    if (values && profileData?.accountId && selectedBusinessUnit?.value) {
      if (params?.id) {
        if (rowDto?.length === 0) {
          toast.warn("Please add transaction");
        } else {
        }
      } else {
        if (rowDto?.length === 0) {
          toast.warn("Please add transaction");
        } else {
        }
      }
    } else {
      setDisabled(false);
    }
  };

  const remover = (index) => {
    const filterArr = rowDto.filter((itm, idx) => idx !== index);
    setRowDto(filterArr);
  };

  // Change Handler for Received Amount
  const rowDtoHandler = (name, value, sl) => {
    const xData = [...rowDto];
    xData[sl][name] = +value;
    setRowDto([...xData]);
  };

  //total amount calculation
  useEffect(() => {
    let totalAmount = 0;
    let totalQR = 1;
    let total = 0;
    if (rowDto?.length) {
      for (let i = 0; i < rowDto?.length; i++) {
        totalQR = +rowDto[i].quantity * +rowDto[i].rate;
        total = totalQR;
        totalAmount += total;
      }
    }
    setTotal({ totalAmount });
  }, [rowDto]);

  const backHandler = () => {
    history.goBack();
  };

  return (
    <ICard
      getProps={setObjprops}
      isDisabled={isDisabled}
      title="View Secondary Collection"
    >
      <div className="row" style={{ marginTop: "-45px" }}>
        <div className="col-lg-2 offset-10 text-right">
          <button
            onClick={backHandler}
            type="button"
            className="btn btn-primary"
          >
            <i class="fa fa-arrow-left"></i>Back
          </button>
        </div>
      </div>
      {isDisabled && <Loading />}
      <Form
        {...objProps}
        initData={params?.id ? singleData : initData}
        saveHandler={saveHandler}
        //disableHandler={disableHandler}
        accountId={profileData?.accountId}
        selectedBusinessUnit={selectedBusinessUnit?.value}
        isEdit={id || false}
        total={total}
        rowDto={rowDto}
        state={location.state}
        setter={setter}
        remover={remover}
        setRowDto={setRowDto}
        rowDtoHandler={rowDtoHandler}
      />
    </ICard>
  );
}
