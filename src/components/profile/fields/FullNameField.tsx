import React, { useEffect, useState } from "react";
import { TextField } from "@mui/material";
import { useTranslation } from "react-i18next";

export type FullNameFieldProps = {
  value: string;
  onChange: (value: string) => void;
  onValidChange?: (valid: boolean) => void;
};

const FULL_NAME_PATTERN = /^[a-zA-Z0-9._\- ]+$/;
const FULL_NAME_MAX_LENGTH = 50;

const FullNameField = ({ value, onChange, onValidChange }: FullNameFieldProps) => {
  const { t } = useTranslation();
  const [error, setError] = useState<string | undefined>();

  const validate = (val: string) => {
    const v = (val ?? "").trim();
    if (!v) return undefined; // optional
    if (v.length > FULL_NAME_MAX_LENGTH) return t("Full name must be at most 50 characters");
    if (!FULL_NAME_PATTERN.test(v)) return t("Full name contains invalid characters");
    return undefined;
  };

  useEffect(() => {
    const e = validate(value);
    setError(e);
    onValidChange?.(!e);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  return (
    <TextField
      label={t("Full name")}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      error={!!error}
      helperText={error}
      fullWidth
    />
  );
};

export default FullNameField;
