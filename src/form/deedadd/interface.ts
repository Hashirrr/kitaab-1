import { FormikHelpers } from "formik";
import { DeedItem } from "@/hooks/deeds/interface";

export interface DeedAddFormValues {
  name: string;
  description: string;
}

export interface DeedAddFormProps {
  modalType: string;
  currentDeed: DeedItem | undefined;
  onSubmit: (
    values: DeedAddFormValues,
    helpers: FormikHelpers<DeedAddFormValues>
  ) => void;
}