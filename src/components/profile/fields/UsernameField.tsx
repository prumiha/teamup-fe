import React, {useEffect, useState} from "react";
import {TextField} from "@mui/material";
import {useTranslation} from "react-i18next";

export type UsernameFieldProps = {
  value: string;
  onChange: (value: string) => void;
  onValidChange?: (valid: boolean) => void;
  autoFocus?: boolean;
};

const USERNAME_PATTERN = /^[a-zA-Z0-9._-]+$/;
const USERNAME_MAX_LENGTH = 20;
const USERNAME_MIN_LENGTH = 3;

const UsernameField = ({ value, onChange, onValidChange, autoFocus }: UsernameFieldProps) => {
  const { t } = useTranslation();
  const [error, setError] = useState<string | undefined>();

  const validate = (val: string) => {
    const v = (val ?? "").trim();
    if (!v) return t("Username is required");
    if (v.length < USERNAME_MIN_LENGTH || v.length > USERNAME_MAX_LENGTH) return t("Username must be 3-20 characters");
    if (!USERNAME_PATTERN.test(v))
      return t("Username can include letters, numbers, dot, underscore, and hyphen only");
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
      label={t("Username")}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      error={!!error}
      helperText={error}
      required
      autoFocus={autoFocus}
      fullWidth
    />
  );
};

export default UsernameField;
