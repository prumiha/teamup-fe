import React, {useEffect, useState} from "react";
import {TextField} from "@mui/material";
import {useTranslation} from "react-i18next";

export type PhoneFieldProps = {
  value: string;
  onChange: (value: string) => void;
  onValidChange?: (valid: boolean) => void;
};

const PHONE_PATTERN = /^[0-9+\- ]+$/;
const PHONE_MAX_LENGTH = 20;

const PhoneField: React.FC<PhoneFieldProps> = ({ value, onChange, onValidChange }) => {
  const { t } = useTranslation();
  const [error, setError] = useState<string | undefined>();

  const validate = (val: string) => {
    const v = (val ?? "").trim();
    if (!v) return undefined; // optional
    if (v.length > PHONE_MAX_LENGTH) return t("Phone must be at most 20 characters");
    if (!PHONE_PATTERN.test(v)) return t("Phone can contain digits, +, -, and spaces only");
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
      label={t("Phone")}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      error={!!error}
      helperText={error}
      fullWidth
    />
  );
};

export default PhoneField;
