import PropTypes from 'prop-types';
import { useCallback } from 'react';
// @mui
import Box from '@mui/material/Box';
import Pagination, { paginationClasses } from '@mui/material/Pagination';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';
import Divider from '@mui/material/Divider';
import Skeleton from '@mui/material/Skeleton'; 
// routes
import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';
//
import JobItem from './job-item';

// ----------------------------------------------------------------------

export default function JobList({ jobs, isApiLoading }) {
  const router = useRouter();

  console.log('JobList jobs: ', jobs);

  const handleView = useCallback(
    (id) => {
      router.push(paths.dashboard.job.details(id));
    },
    [router]
  );

  const handleEdit = useCallback(
    (id) => {
      router.push(paths.dashboard.job.edit(id));
    },
    [router]
  );

  const handleDelete = useCallback((id) => {
    console.info('DELETE', id);
  }, []);

  return (
    <>
      <Box
        gap={3}
        display="grid"
        gridTemplateColumns={{
          xs: 'repeat(1, 1fr)',
          sm: 'repeat(2, 1fr)',
          md: 'repeat(3, 1fr)',
        }}
      >
        {isApiLoading
          ? // Render skeleton placeholders while loading
          Array.from({ length: 9 }).map((_, index) => (
            <Card key={index}>
              <Stack sx={{ p: 3, pb: 2 }}>
                <Skeleton variant="rounded" width={48} height={48} />
                <Skeleton variant="text" height={20} width={50} />
                <Skeleton variant="text" height={16} width={35}/>
              </Stack>
              <Divider sx={{ borderStyle: 'dashed' }} />
              <Box sx={{ px: 3, py: 1 }}>
                <Stack spacing={0.5}>
                  <Skeleton variant="text" height={8} width={35}/>
                  <Skeleton variant="text" height={8} width={35}/>
                  <Skeleton variant="text" height={8} width={35}/>
                </Stack>
              </Box>
            </Card>
          ))
          : // Render actual job items when not loading
            jobs.map((job) => (
              <JobItem
                key={job.id}
                job={job}
                onView={() => handleView(job.id)}
                onEdit={() => handleEdit(job.id)}
                onDelete={() => handleDelete(job.id)}
              />
            ))}
      </Box>

      {jobs.length > 8 && (
        <Pagination
          count={8}
          sx={{
            mt: 8,
            [`& .${paginationClasses.ul}`]: {
              justifyContent: 'center',
            },
          }}
        />
      )}
    </>
  );
}

JobList.propTypes = {
  jobs: PropTypes.array,
  isApiLoading: PropTypes.bool,
};
