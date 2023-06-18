import React, { InputHTMLAttributes, ForwardedRef } from "react";

const Input = (
  props: {
    label?: string;
    help?: string;
  } & InputHTMLAttributes<HTMLInputElement>,
  ref: ForwardedRef<HTMLInputElement>
) => {
  const { className, ...rest } = props;
  return (
    <div className="w-full">
      {props.label && (
        <label className="label">
          <span className="label-text">{props.label}</span>
        </label>
      )}
      <input
        className={`input input-bordered w-full ${className}`}
        {...rest}
        ref={ref}
      />
      {props.help && (
        <label className="label">
          <span className="label-text-alt">{props.help}</span>
        </label>
      )}
    </div>
  );
};

export default React.forwardRef(Input);
