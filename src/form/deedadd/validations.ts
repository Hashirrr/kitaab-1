import * as Yup from 'yup';
import { PLACEHOLDERS } from '@/constants/placeholders';

const { DEED_NAME_REQUIRED_HELPER } = PLACEHOLDERS;

export const deedAddValidationSchema = Yup.object({
  name: Yup.string()
    .trim()
    .required(DEED_NAME_REQUIRED_HELPER),
  description: Yup.string().trim()
});