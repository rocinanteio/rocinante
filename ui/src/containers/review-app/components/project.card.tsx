import React from 'react';
import {
  alpha,
  Button,
  Card,
  Chip,
  Fab,
  IconButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  MenuList,
  useTheme,
} from '@mui/material';
import { FlexBetween } from 'components/flexbox';
import { IconWrapper } from '../../../components/icon-wrapper';
import { H6, Paragraph, Span, Tiny } from '../../../components/typography';
import { Navigation } from '@mui/icons-material';
import Layers from '../../../icons/Layers';
import { ProjectModel } from '../models/project.model';
import moment from 'moment';
import { MoreButton } from '../../../components/more-button';
import DeleteIcon from '../../../icons/DeleteIcon';
import { stopPipelineProject } from '../services/review-app.services';
import { toast } from 'react-toastify';
import useSettings from '../../../hooks/useSettings';

const ProjectCard = ({
  status,
  project,
  refresh,
}: {
  status: string;
  project: ProjectModel;
  refresh: () => void;
}) => {
  const theme = useTheme();
  const { apiUrl } = useSettings();

  const getStatusColor = (status: string) => {
    if (status === 'Pending') return theme.palette.primary.main;
    if (status === 'Completed') return theme.palette.success.main;
    return theme.palette.warning.main;
  };

  const color = getStatusColor(status);

  const stopImage = async () => {
    try {
      const promise = stopPipelineProject(apiUrl, {
        appPort: project.appPort,
        image: project.image,
        name: project.name,
      });

      await toast.promise(promise, {
        pending: {
          render() {
            return 'Stopping Project';
          },
          icon: false,
        },
        success: {
          render({ data }) {
            refresh();
            return `Project Stopped`;
          },
        },
        error: {
          render({ data }) {
            return 'An error occurred';
          },
        },
      });
    } catch (e) {}
  };

  return (
    <Card
      sx={{
        padding: 3,
      }}
    >
      <FlexBetween>
        <IconWrapper bgcolor={alpha(color, 0.1)}>
          <Layers
            sx={{
              color,
            }}
          />
        </IconWrapper>

        <MoreButton
          renderOptions={() => (
            <MenuItem onClick={stopImage}>
              <ListItemIcon>
                <DeleteIcon fontSize={'small'} color={'error'} />
              </ListItemIcon>
              <ListItemText color={'red'}>Stop View App</ListItemText>
            </MenuItem>
          )}
        />
      </FlexBetween>
      <FlexBetween>
        <H6 fontSize={16} my={2}>
          {project.name}
        </H6>
        <Chip label={status} size="small" color={'warning'} />
      </FlexBetween>
      <Paragraph color="text.secondary">
        <Span fontWeight={'bold'} color={'green'}>
          Image:
        </Span>{' '}
        {project.image}
      </Paragraph>{' '}
      <Paragraph color="text.secondary">
        <Span fontWeight={'bold'} color={'green'}>
          Port:
        </Span>{' '}
        {project.appPort}
      </Paragraph>
      <Paragraph color="text.secondary">
        <Span fontWeight={'bold'} color={'green'}>
          Created At:{' '}
        </Span>{' '}
        {moment(project.created_at).format('MMMM Do YYYY, h:mm:ss a')}
      </Paragraph>
      <br />
      <FlexBetween>
        <Fab
          variant="extended"
          color={'success'}
          size={'small'}
          href={project.host}
          target={'_blank'}
        >
          <Navigation sx={{ mr: 1 }} />
          View App
        </Fab>
      </FlexBetween>
    </Card>
  );
};

export default ProjectCard;
