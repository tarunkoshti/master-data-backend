import { z } from "zod";
import { DateUtil } from "./date.util";


export const dateSchema = z
  .string()
  .optional()
  .transform((val) => (val ? DateUtil.toDateOnly(val) : val));
