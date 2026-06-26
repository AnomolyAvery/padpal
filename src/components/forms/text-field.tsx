import { useFieldContext } from "@/lib/forms";
import { Field, FieldError, FieldLabel } from "../ui/field";
import { Input } from "../ui/input";
import type { HTMLInputTypeAttribute } from "react";

interface TextFieldProps {
  label: string;
  placeholder?: string;
  type?: HTMLInputTypeAttribute;
  asNumber?: boolean;
}

export function TextField({
  label,
  placeholder,
  type = "text",
  asNumber = false,
}: TextFieldProps) {
  const field = useFieldContext<string | number>();

  const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;

  return (
    <Field data-invalid={isInvalid}>
      <FieldLabel htmlFor={field.name}>{label}</FieldLabel>

      <Input
        id={field.name}
        name={field.name}
        type={type}
        step={asNumber ? "any" : undefined}
        placeholder={placeholder}
        value={String(field.state.value ?? "")}
        onBlur={(e) => {
          field.handleBlur();

          // convert to number only after editing finishes
          if (asNumber && e.target.value !== "") {
            field.handleChange(Number(e.target.value));
          }
        }}
        onChange={(e) => {
          field.handleChange(
            asNumber ? (e.target.value as never) : e.target.value,
          );
        }}
        aria-invalid={isInvalid}
      />

      {isInvalid && <FieldError errors={field.state.meta.errors} />}
    </Field>
  );
}
