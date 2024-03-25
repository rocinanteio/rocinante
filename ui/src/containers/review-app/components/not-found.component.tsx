import React from 'react';
import { InfoSharp } from '@mui/icons-material';
import { Stack } from '@mui/system';

const NotFound = () => {
  return (
    <Stack
      direction="column"
      justifyContent="center"
      alignItems="center"
      gap={2}
      width={'100%'}
      height={500}
      textAlign={'center'}
    >
      <InfoSharp color={'error'} fontSize={'large'} />
      There isn't any review app. <br />
      (Pipeline review apps can be start only ci/cd steps)
    </Stack>
  );
};

export default NotFound;
