interface Props {
  text: string;
  value: string;
  index: number;
  name: string;
  checked: boolean;
  setValue: (value: string) => void;
}

const RadioItem = ({ text, index, name, value, checked, setValue }: Props) => {
  return (
    <div>
      <div className='form_radio'>
        <input
          id={`radio-${index}`}
          className='radio'
          type='radio'
          name={name}
          value={value}
          checked={checked}
          onChange={() => {
            setValue(value);
            console.log(value);
          }}
        />
        <label htmlFor={`radio-${index}`}>{text}</label>
      </div>
      <style jsx>
        {`
          .form_radio {
            width: 100%;
            margin: 0 auto 13px;
            display: flex;
            flex-direction: row;
          }
          .form_radio .radio {
            display: none;
          }
          .form_radio label {
            display: inline-block;
            cursor: pointer;
            position: relative;
            padding-left: 25px;
            font-size: 14px;
            margin-right: 0;
            line-height: 18px;
            user-select: none;
            vertical-align: center;
          }
          .form_radio label:before {
            content: "";
            display: inline-block;
            width: 20px;
            height: 20px;
            position: absolute;
            left: 0;
            bottom: 1px;
            background: url("/img/radio.png") 50% no-repeat;
            background-size: 20px;
            overflow: visible;
          }

          /* Checked */
          .form_radio input[type="radio"]:checked + label:before {
            background: url("/img/radio-checked.png") 50% no-repeat;
            background-size: 20px;
            overflow: visible;
          }

          /* Hover */
          .form_radio label:hover:before {
            filter: brightness(120%);
          }
        `}
      </style>
    </div>
  );
};

export default RadioItem;
