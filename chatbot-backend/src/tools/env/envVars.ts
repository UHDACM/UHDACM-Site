import dotenv from "dotenv";

dotenv.config();

const pe = process.env;

const env_vars = {
  PORT: Number(pe.PORT!),
} as const;


for (const [key, val] of Object.entries(env_vars)) {
  if (val == undefined) {
    throw new Error(`Expected environment variable \"${key}\" to be defined`);
  }
}

if (isNaN(env_vars.PORT)) {
  throw new Error(`env_vars PORT is NaN`);
}

export { env_vars };