import { useState } from 'react';
import Link from 'next/link';
import { Box, IconButton, Typography, useTheme } from '@mui/material'; // LAYOUT BASED HOOK

import useLayout from './context/useLayout'; // CUSTOM COMPONENTS

import { Scrollbar } from 'components/scrollbar';
import { FlexBetween, FlexBox } from 'components/flexbox';
import MultiLevelMenu from './MultiLevelMenu';

import ArrowLeftToLine from 'icons/duotone/ArrowLeftToLine'; // STYLED COMPONENTS

import { SidebarWrapper } from '../layout-parts/styles/sidebar';
import { H5 } from '../../components/typography';
const TOP_HEADER_AREA = 70;

const DashboardSidebar = () => {
  const { sidebarCompact, handleSidebarCompactToggle } = useLayout();
  const theme = useTheme();

  const [onHover, setOnHover] = useState(false); // ACTIVATE COMPACT WHEN TOGGLE BUTTON CLICKED AND NOT ON HOVER STATE

  const COMPACT = sidebarCompact && !onHover ? 1 : 0;
  return (
    <SidebarWrapper
      compact={sidebarCompact ? 1 : 0}
      onMouseEnter={() => setOnHover(true)}
      onMouseLeave={() => sidebarCompact && setOnHover(false)}
    >
      <FlexBetween padding="1.5rem 1rem .5rem 2rem" height={TOP_HEADER_AREA}>
        {/* LOGO */}
        <Link href="/">
          <FlexBox
            style={{
              gap: 16,
              alignItems: 'center',
            }}
          >
            <Box
              component="img"
              src={theme.palette.logo}
              alt="logo"
              width={30}
              style={{
                transform: 'scale(1.5)',
              }}
            />
            {!sidebarCompact && (
              <Typography
                fontSize={16}
                fontWeight={'bold'}
                color={theme.palette.text.primary}
              >
                Rocinante
              </Typography>
            )}
          </FlexBox>
        </Link>
        {!COMPACT ? (
          <IconButton onClick={handleSidebarCompactToggle}>
            <ArrowLeftToLine />
          </IconButton>
        ) : null}
      </FlexBetween>

      <Scrollbar
        autoHide
        clickOnTrack={false}
        sx={{
          overflowX: 'hidden',
          maxHeight: `calc(100vh - ${TOP_HEADER_AREA}px)`,
        }}
      >
        <Box height="100%" px={2}>
          {/* NAVIGATION ITEMS */}
          <MultiLevelMenu sidebarCompact={!!COMPACT} />
        </Box>
      </Scrollbar>
    </SidebarWrapper>
  );
};

export default DashboardSidebar;
