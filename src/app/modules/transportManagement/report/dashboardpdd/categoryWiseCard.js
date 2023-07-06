import React from "react";

function CategoryWiseCard({
  categoryWiseCardObj,
  customOnClick,
  className,
  customCardOnClick,
}) {
  return (
    <div
      className={`categoryWiseCard ${className}`}
      onClick={() => {
        customCardOnClick &&
        customCardOnClick({
            ...categoryWiseCardObj,
          });
      }}
    >
      <div className='title'>
        <b>{categoryWiseCardObj?.title}</b>
      </div>
      <div className='cagegoryList'>
        {categoryWiseCardObj?.categoryList?.map((item, index) => {
          return (
            <div
              className='item'
              key={index}
              onClick={() => {
                customOnClick&& customOnClick({
                  ...item,
                  index: index,
                });
              }}
            >
              <div className='itemTitle'>{item?.title}</div>
              <div className='itemValue'>{item?.value}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default CategoryWiseCard;
