import AddIcon from '@mui/icons-material/Add';
import AssignmentTurnedInRoundedIcon from '@mui/icons-material/AssignmentTurnedInRounded';
import { AppBar, Box, Button, Container, Stack, Toolbar, Typography } from '@mui/material';
import { Link as RouterLink, Outlet } from 'react-router-dom';

export function AppLayout() {
  return (
    <Box sx={{ minHeight: '100vh', background: 'linear-gradient(180deg, #f8fafc 0%, #eef4ff 100%)' }}>
      <AppBar position="sticky" elevation={0} color="transparent" sx={{ backdropFilter: 'blur(10px)' }}>
        <Toolbar>
          <Container maxWidth="lg" disableGutters sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Stack direction="row" spacing={1.5} alignItems="center">
              <AssignmentTurnedInRoundedIcon color="primary" />
              <Typography
                component={RouterLink}
                to="/"
                variant="h6"
                sx={{ textDecoration: 'none', color: 'text.primary', fontWeight: 700 }}
              >
                Task Manager SPA
              </Typography>
            </Stack>

            <Button component={RouterLink} to="/task/new" variant="contained" startIcon={<AddIcon />}>
              New task
            </Button>
          </Container>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Outlet />
      </Container>
    </Box>
  );
}
