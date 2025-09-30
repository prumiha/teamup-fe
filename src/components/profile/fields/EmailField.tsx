import React, {useEffect, useState} from "react";
import {TextField} from "@mui/material";
import {useTranslation} from "react-i18next";

export type EmailFieldProps = {
  value: string;
  onChange: (value: string) => void;
  onValidChange?: (valid: boolean) => void;
};

const EMAIL_PATTERN = /^[A-Za-z0-9+_.-]+@[A-Za-z0-9.-]+$/;
const EMAIL_MAX_LENGTH = 40;

const EmailField = ({ value, onChange, onValidChange }: EmailFieldProps) => {
  const { t } = useTranslation();
  const [error, setError] = useState<string | undefined>();

  const validate = (val: string) => {
    const v = (val ?? "").trim();
    if (!v) return undefined; // optional
    if (v.length > EMAIL_MAX_LENGTH) return t("Email must be at most 40 characters");
    if (!EMAIL_PATTERN.test(v)) return t("Enter a valid email");
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
      label={t("Email")}
      type="email"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      error={!!error}
      helperText={error}
      fullWidth
    />
  );
};

export default EmailField;
