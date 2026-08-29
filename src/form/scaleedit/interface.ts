import { FormikHelpers } from "formik";
import { ScaleItem } from "@/hooks/scales/interface";

export interface ScaleEditFormValues {
  name: string;
  description: string;
}

export interface ScaleEditFormProps {
  modalType: string;
  currentScale: ScaleItem | undefined;
  onSubmit: (
    values: ScaleEditFormValues,
    helpers: FormikHelpers<ScaleEditFormValues>
  ) => void;
}
