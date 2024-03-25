// @ts-nocheck
import { TextField } from '@mui/material';
import Search from '@mui/icons-material/Search';

import useNavigate from 'hooks/useNavigate';
import useLocation from 'hooks/useLocation';

import { FlexBetween } from 'components/flexbox';

const SearchContainer = (props) => {
  const { value = '', onChange } = props;

  const navigate = useNavigate();
  const { pathname } = useLocation();

  const activeColor = (path) =>
    pathname === path ? 'primary.main' : 'grey.400';

  return (
    <FlexBetween gap={1} my={3}>
      {/* SEARCH BOX */}
      <TextField
        value={value}
        onChange={onChange}
        placeholder="Search..."
        InputProps={{
          startAdornment: <Search />,
        }}
        sx={{
          maxWidth: 400,
          width: '100%',
        }}
      />
    </FlexBetween>
  );
};

export default SearchContainer;
