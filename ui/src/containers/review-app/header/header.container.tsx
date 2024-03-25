import { TabContext, TabList } from '@mui/lab';
import { styled, Tab } from '@mui/material';

import useNavigate from 'hooks/useNavigate';

import { Paragraph } from 'components/typography';
import { IconWrapper } from 'components/icon-wrapper';
import { FlexBetween, FlexBox } from 'components/flexbox'; // CUSTOM ICON COMPONENTS

import Folder from 'icons/Folder';
import { SyntheticEvent } from 'react';
import { ReviewAppTabEnum } from '../models/review-app-tab.enum';

const TabListWrapper = styled(TabList)(({ theme }) => ({
  borderBottom: 0,
  [theme.breakpoints.down(727)]: {
    order: 3,
  },
}));

interface HeaderProps {
  value: ReviewAppTabEnum;
  changeTab: (
    event: SyntheticEvent<Element, Event>,
    value: ReviewAppTabEnum,
  ) => void;
}

const Header = ({ value, changeTab }: HeaderProps) => {
  const navigate = useNavigate();

  return (
    <FlexBetween flexWrap="wrap" gap={1}>
      <FlexBox alignItems="center">
        <IconWrapper>
          <Folder
            sx={{
              color: 'primary.main',
            }}
          />
        </IconWrapper>
        <Paragraph fontSize={16}>Review App</Paragraph>
      </FlexBox>

      <TabContext value={value}>
        <TabListWrapper variant="scrollable" onChange={changeTab}>
          <Tab
            disableRipple
            label={ReviewAppTabEnum.PipelineApps}
            value={ReviewAppTabEnum.PipelineApps}
          />
        </TabListWrapper>
      </TabContext>
    </FlexBetween>
  );
};

export default Header;
