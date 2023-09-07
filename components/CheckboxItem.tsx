interface Props {
  text: string;
  value: string;
  index: number;
  checked: boolean;
  setValue: (value: string) => void;
}

const CheckboxItem = ({ text, index, value, checked, setValue }: Props) => {
  return (
    <div>
      <div className='fieldWrap'>
        {/* <input type='checkbox' name='sendToModerator' id='sendToModerator' className={styles.checkbox} /> */}
        <label htmlFor='notify' className='fieldName checkboxWrap'>
          <div
            id='notify'
            onClick={() => {
              setValue(value);
            }}
            className={checked ? "checkbox checked" : "checkbox"}></div>
          <span>{text}</span>
        </label>
      </div>
      <style jsx>
        {`
          .fieldWrap {
            width: 100%;
            margin-bottom: 25px;
            &:first-child {
              margin-top: 38px;
            }
          }

          .fieldName {
            font-size: 12px;
            line-height: 150%;
            /* identical to box height, or 18px */

            /* 1c1c1c */
            margin-bottom: 8px;
            display: block;
            color: #1c1c1c;
            &.center {
              margin: 0 calc(50% - 54px);
              text-align: center;
            }
            &.toggle {
              font-size: 16px;
              margin-top: 10px;
            }
          }

          .checkboxWrap {
            display: flex;
            flex-direction: row;
            align-items: center;
            justify-content: center;
          }

          .checkbox {
            display: inline-block;
            // pointer-events: none;
            flex-shrink: 0;
            flex-grow: 0;
            margin-right: 0.5em;
            background-repeat: no-repeat;
            background-position: center center;
            background-size: 50% 50%;
            height: 24px;
            width: 24px;
            border: 2px solid #254a63;
            border-radius: 5px;
            transition: all 0.2s;
            cursor: pointer;
            &:hover {
              background-color: #254a6345;
            }
            &.checked {
              background-image: url("/img/check.png") !important;
            }
          }
        `}
      </style>
    </div>
  );
};

export default CheckboxItem;
