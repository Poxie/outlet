import { forwardRef } from 'react';

const Input = forwardRef<HTMLInputElement, {
    onChange: (value: string) => void;
    value?: string | number;
    placeholder?: string;
    autoFocus?: boolean;
    type?: 'text' | 'password' | 'number';
    className?: string
    containerClassName?: string;
    textArea?: boolean;
}>(({ onChange, value, placeholder, autoFocus, textArea=false, type='text', className='' }, ref) => {
    const props = {
        placeholder,
        autoFocus,
        value,
        type,
        ref: ref as any,
        autoComplete: 'off',
        className: "p-3 bg-tertiary border-[1px] bg-light-secondary border-light-tertiary outline-none rounded-md text-sm " + className,
        onChange: (e: React.ChangeEvent<any>) => onChange(e.target.value),
        'aria-placeholder': placeholder,
    }
    return(
        !textArea ? (
            <input {...props} />
        ) : (
            <textarea {...props}></textarea>
        )
    )
});
export default Input;