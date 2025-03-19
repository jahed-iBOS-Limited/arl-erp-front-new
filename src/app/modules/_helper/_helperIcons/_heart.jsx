import React from "react";

function IHeart({ isShown, kpiId, updateIsShown, classNames }) {
  return (
    <>
      <i
        onClick={() => {
          updateIsShown(kpiId, !isShown);
        }}
        style={{ fontSize: "17px", cursor: "pointer", zIndex: "99999" }}
        className={
          isShown
            ? `fa fa-heart ml-4 i-heart text-danger ${classNames}`
            : `fa fa-heart ml-4 i-heart ${classNames}`
        }
      ></i>
    </>
  );
}

export default React.memo(IHeart);
