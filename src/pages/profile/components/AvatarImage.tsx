import React from "react";
import { Avatar, Box } from "@mui/material";

export type AvatarImageProps = {
    src?: string | null;
    size?: number;
    alt?: string;
    fallbackText?: string;
};

export const AvatarImage = ({
  src,
  size = 96,
  alt = "User Avatar",
  fallbackText = "",
}: AvatarImageProps) => {
    return (
        <Box display="flex" justifyContent="center" alignItems="center">
            <Avatar
                src={src ?? undefined}
                sx={{ width: size, height: size, fontSize: size * 0.4 }}
                alt={alt}
            >
                {!src && fallbackText}
            </Avatar>
        </Box>
    );
};
