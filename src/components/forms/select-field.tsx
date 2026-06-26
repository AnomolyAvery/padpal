import { useFieldContext } from "@/lib/forms";
import { Field, FieldLabel } from "../ui/field";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import type { Icon } from "@tabler/icons-react";

interface SelectFieldProps {
  label: string;
  options: {
    label: string;
    value: string;
    icon?: Icon;
  }[];
  placeholder?: string;
}
export function SelectField(props: SelectFieldProps) {
  const field = useFieldContext<string>();
  const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;

  return (
    <Field data-invalid={isInvalid}>
      <FieldLabel htmlFor={field.name}>{props.label}</FieldLabel>
      <Select
        name={field.name}
        value={field.state.value}
        onValueChange={field.handleChange}
      >
        <SelectTrigger
          id={field.name}
          aria-invalid={isInvalid}
          className="min-w-30"
        >
          <SelectValue placeholder={props.placeholder} />
        </SelectTrigger>
        <SelectContent>
          {props.options.map((opt, optIdx) => (
            <SelectItem key={`${opt.label}-${optIdx}`} value={opt.value}>
              {opt.icon && <opt.icon />}
              {opt.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </Field>
  );
}
