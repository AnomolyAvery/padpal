import { useFieldContext } from "@/lib/forms";
import { Checkbox } from "../ui/checkbox";
import { Field, FieldLabel } from "../ui/field";

interface CheckboxFieldProps {
  label: string;
}

export function CheckboxField({ label }: CheckboxFieldProps) {
  const field = useFieldContext<boolean>();
  const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;

  return (
    <Field orientation={"horizontal"} data-invalid={isInvalid}>
      <Checkbox
        id={field.name}
        name={field.name}
        aria-invalid={isInvalid}
        onBlur={field.handleBlur}
        checked={field.state.value}
        onCheckedChange={(e) => {
          const value = e.valueOf();
          if (typeof value === "boolean") {
            field.handleChange(value);
          } else {
            field.handleChange(value === "true");
          }
        }}
      />
      <FieldLabel htmlFor={field.name}>{label}</FieldLabel>
    </Field>
  );
}
