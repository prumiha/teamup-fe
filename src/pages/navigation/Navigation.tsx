import React from 'react';
import BottomNavigation from '@mui/material/BottomNavigation';
import BottomNavigationAction from '@mui/material/BottomNavigationAction';
import HomeIcon from '@mui/icons-material/Home';
import PersonIcon from '@mui/icons-material/Person';
import SettingsIcon from '@mui/icons-material/Settings';
import Paper from '@mui/material/Paper';
import {useNavigate} from 'react-router-dom';
import {useTranslation} from 'react-i18next';

export enum NavigationPaths {
    HOME = '/',
    PROFILE = '/profile',
    SETTINGS = '/settings',
}

const decideInitialPage = () => {
    const currentPath = window.location.pathname;
    const allowedPaths = Object.values(NavigationPaths) as string[];
    return allowedPaths.includes(currentPath as NavigationPaths)
        ? (currentPath as NavigationPaths)
        : NavigationPaths.HOME;
}

export const Navigation = () => {
    const navigate = useNavigate();
    const initialPage = decideInitialPage();
    const [currentPage, setCurrentPage] = React.useState<NavigationPaths>(initialPage);
    const { t } = useTranslation();

    const handleChange = (_: React.SyntheticEvent, newValue: NavigationPaths) => {
        setCurrentPage(newValue);
        navigate(newValue);
    };

    return (
        <Paper
            sx={{
                position: 'fixed',
                bottom: 0,
                left: 0,
                right: 0,
                zIndex: 1000,
                borderTop: 1,
                borderColor: 'divider',
            }}
            elevation={3}
        >
            <BottomNavigation
                showLabels
                value={currentPage}
                onChange={handleChange}
            >
                <BottomNavigationAction
                    label={t('Home')}
                    icon={<HomeIcon />}
                    value={NavigationPaths.HOME}
                />
                <BottomNavigationAction
                    label={t('Profile')}
                    icon={<PersonIcon />}
                    value={NavigationPaths.PROFILE}
                />
                <BottomNavigationAction
                    label={t('Settings')}
                    icon={<SettingsIcon />}
                    value={NavigationPaths.SETTINGS}
                />
            </BottomNavigation>
        </Paper>
    );
};
