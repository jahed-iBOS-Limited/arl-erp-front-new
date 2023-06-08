import React from 'react';
import johariImage from './assets/johariWindow.jpg';

function HelpImage() {
   return (
      <div>
         <img
            className="workplan-modal-image"
            style={{
               width: '30rem',
            }}
            src={johariImage}
            alt="johari window instruction i,age"
         />
      </div>
   );
}

export default HelpImage;
