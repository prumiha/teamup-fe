import React from 'react';
import {Divider, ListItemIcon, ListItemText, MenuItem, MenuList, Paper, Typography} from '@mui/material';
import ContentCut from '@mui/icons-material/ContentCut';
import ContentCopy from '@mui/icons-material/ContentCopy';
import ContentPaste from '@mui/icons-material/ContentPaste';
import Cloud from '@mui/icons-material/Cloud';
import {AlertType, useAlert} from "./providers/AlertProvider";
import useSettings from "./hooks/useSettings";
import {Theme} from "./providers/StyleProvider";
import { useTranslation } from 'react-i18next';

const Test = () => {
    const alert = useAlert();
    const settings = useSettings();
    const { t } = useTranslation();
    return (
        <Paper sx={{ width: 320, maxWidth: '100%' }}>
            <MenuList>
                <MenuItem onClick={() => settings.setTheme(Theme.LIGHT)}>
                    <ListItemIcon>
                        <ContentCut fontSize="small" />
                    </ListItemIcon>
                    <ListItemText>{t('Light Theme')}</ListItemText>
                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                        ⌘X
                    </Typography>
                </MenuItem>
                <MenuItem onClick={() => settings.setTheme(Theme.DARK)}>
                    <ListItemIcon>
                        <ContentCopy fontSize="small" />
                    </ListItemIcon>
                    <ListItemText>{t('Dark Theme')}</ListItemText>
                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                        ⌘C
                    </Typography>
                </MenuItem>
                <MenuItem >
                    <ListItemIcon>
                        <ContentPaste fontSize="small" />
                    </ListItemIcon>
                    <ListItemText>{t('Paste')}</ListItemText>
                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                        ⌘V
                    </Typography>
                </MenuItem>
                <Divider />
                <MenuItem
                    onClick={() => alert.showAlert(t('Test message'), AlertType.SUCCESS, 5000)}>
                    <ListItemIcon>
                        <Cloud fontSize="small" />
                    </ListItemIcon>
                    <ListItemText>{t('Web Clipboard')}</ListItemText>
                </MenuItem>
            </MenuList>
        </Paper>
    );
};

export default Test;
