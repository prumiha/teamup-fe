import React, { useEffect, useMemo, useState } from "react";
import { TextField } from "@mui/material";
import { useTranslation } from "react-i18next";

export type BioFieldProps = {
  value: string;
  onChange: (value: string) => void;
  onValidChange?: (valid: boolean) => void;
};


const BIO_MAX_LENGTH = 500;

const EditBioField: React.FC<BioFieldProps> = ({ value, onChange, onValidChange }) => {
  const { t } = useTranslation();
  const [error, setError] = useState<string | undefined>();
  const count = value?.length ?? 0;

  const validate = (val: string) => {
    const v = val ?? "";
    if (v && v.length > BIO_MAX_LENGTH) return t("Bio must be at most 500 characters");
    return undefined;
  };

  useEffect(() => {
    const e = validate(value);
    setError(e);
    onValidChange?.(!e);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  const helper = useMemo(() => error || `${count}/${BIO_MAX_LENGTH}`, [error, count]);

  return (
    <TextField
      label={t("Bio")}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      error={!!error}
      helperText={helper}
      multiline
      minRows={4}
      fullWidth
      size={"small"}
    />
  );
};

export default EditBioField;
