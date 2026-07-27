import { FormikHelpers } from "formik";

export interface DeedAddFormValues {
  name: string;
  description: string;
}

export interface DeedAddFormProps {
  onSubmit: (
    values: DeedAddFormValues,
    helpers: FormikHelpers<DeedAddFormValues>
  ) => void;
}