import React from "react";

const ToggleSwitch = ({ label, value, setValue }) => {
  return (
    <div className='container'>
      <span className='fieldName'>{label}</span>
      <div className='toggle-switch'>
        <input
          type='checkbox'
          className='checkbox'
          name={label}
          id={label}
          onClick={(event) => {
            setValue(event.target.value);
            console.log(event.target.value);
          }}
        />
        <label className='label' htmlFor={label}>
          <span className='inner' />
          <span className='switch' />
        </label>
      </div>
      <style jsx>{`
        .container {
          text-align: center;
        }

        .fieldName {
          display: block;
        }
        .toggle-switch {
          position: relative;
          width: 75px;
          display: inline-block;
          text-align: left;
          top: 8px;
        }
        .checkbox {
          display: none;
        }
        .label {
          display: block;
          overflow: hidden;
          cursor: pointer;
          border: 0 solid #bbb;
          border-radius: 20px;
        }
        .inner {
          display: block;
          width: 200%;
          margin-left: -100%;
          transition: margin 0.3s ease-in 0s;
        }
        .inner:before,
        .inner:after {
          float: left;
          width: 50%;
          height: 36px;
          padding: 0;
          line-height: 36px;
          color: #fff;
          font-weight: bold;
          box-sizing: border-box;
        }
        .inner:before {
          content: "";
          padding-left: 10px;
          background-color: #c4c6d6;
          //   filter: brightness(120%);
          color: #fff;
        }
        .inner:after {
          content: "";
          padding-right: 10px;
          background-color: #ff8c00;

          color: #fff;
          text-align: right;
        }
        .switch {
          display: block;
          width: 24px;
          margin: 5px;
          background: #fff;
          position: absolute;
          top: 0;
          bottom: 0;
          right: 40px;
          border: 0 solid #bbb;
          border-radius: 20px;
          transition: all 0.3s ease-in 0s;
        }
        .checkbox:checked + .label .inner {
          margin-left: 0;
        }
        .checkbox:checked + .label .switch {
          right: 0px;
        }
      `}</style>
    </div>
  );
};

export default ToggleSwitch;
