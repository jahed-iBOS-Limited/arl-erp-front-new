import React from "react";

function CategoryWiseCard({ categoryWiseCardObj, customOnClick, className }) {
  return (
    <div className={`categoryWiseCard ${className}`}>
      <div className='title'><b>{categoryWiseCardObj?.title}</b></div>
      <div className='cagegoryList'>
        {categoryWiseCardObj?.categoryList?.map((item, index) => {
          return (
            <div className='item' key={index} onClick={() => {
              customOnClick({
                ...item,
                index: index,
              });
            }}>
              <div className='itemTitle'>{item?.title}</div>
              <div className='ItemValue'>{item?.value}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default CategoryWiseCard;
