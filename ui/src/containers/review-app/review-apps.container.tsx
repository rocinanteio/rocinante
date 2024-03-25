// @ts-nocheck
'use client';

import { useEffect, useState } from 'react';
import { Box, Card, CircularProgress, Grid } from '@mui/material';

import Header from './header/header.container';
import { ReviewAppTabEnum } from './models/review-app-tab.enum';
import { getPipelineProjects } from './services/review-app.services';
import ProjectCard from './components/project.card';
import NotFoundComponent from './components/not-found.component';
import { Stack } from '@mui/system';
import useSettings from '../../hooks/useSettings';

const ReviewAppsContainer = () => {
  const [selectedTab, setSelectedTab] = useState(ReviewAppTabEnum.PipelineApps);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  const { apiUrl } = useSettings();

  const fetchProjects = async () => {
    setLoading(true);
    getPipelineProjects(apiUrl)
      .then((res) => {
        setProjects(res.data);
        setLoading(false);
      })
      .catch((e) => {
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleChangeFilter = (key, value) => {
    setSelectedTab(value);
  };

  const changeTab = (_, newValue) => {
    handleChangeFilter('role', newValue);
  };

  return (
    <Box pt={2} pb={4}>
      <Card
        sx={{
          px: 3,
          py: 2,
        }}
      >
        <Header value={selectedTab} changeTab={changeTab} />
        <Box py={3}>
          <Grid container spacing={3}>
            {loading && (
              <Stack
                width={'100%'}
                alignItems={'center'}
                height={50}
                justifyContent={'center'}
              >
                <CircularProgress />
              </Stack>
            )}
            {projects.length === 0 && !loading ? (
              <NotFoundComponent />
            ) : (
              projects.map((item) => {
                return (
                  <Grid item md={4} sm={6} xs={12} key={item.id}>
                    <ProjectCard
                      status={'Running'}
                      project={item}
                      refresh={() => fetchProjects()}
                    />
                  </Grid>
                );
              })
            )}
          </Grid>
        </Box>
      </Card>
    </Box>
  );
};

export default ReviewAppsContainer;
