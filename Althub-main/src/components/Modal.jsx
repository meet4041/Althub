import React, { useEffect } from 'react'

function Modal({closeModal}) {
    useEffect(()=>{
        document.body.style.overflowY="hidden";
        return()=>{
            document.body.style.overflowY="scroll";
        };
    },[]);
  return (
    <>
    <div className="modal-wrapper" onClick={closeModal}></div>
    <div className="modal-container">
    </div>
        
    </>
  )
}

export default Modal