import React from "react";
export default function Toast(props) {
  return (
    <>
      <div className="toast-container position-fixed bottom-0 end-0 p-3">
        <div
          id={props.id}
          className="toast"
          role="alert"
          aria-live="assertive"
          aria-atomic="true"
        >
          <div className="toast-header">
            <strong className="me-auto">AWS NHÓM 65</strong>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="toast"
              aria-label="Close"
            ></button>
          </div>
          <div className={`toast-body ${props.bg} text-light`}>
            {props.text}
          </div>
        </div>
      </div>
    </>
  );
}
