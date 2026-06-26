import { CheckboxField } from "@/components/forms/check-box-field";
import { SelectField } from "@/components/forms/select-field";
import { SubmitButton } from "@/components/forms/submit-button";
import { TextField } from "@/components/forms/text-field";
import {
  createFormHook,
  createFormHookContexts,
} from "@tanstack/react-form-nextjs";

const { fieldContext, formContext, useFieldContext, useFormContext } =
  createFormHookContexts();

const { useAppForm } = createFormHook({
  fieldComponents: {
    TextField,
    SelectField,
    CheckboxField,
  },
  formComponents: {
    SubmitButton,
  },
  fieldContext,
  formContext,
});

export { useFormContext, useFieldContext, useAppForm };
