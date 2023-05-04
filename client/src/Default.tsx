import { useEffect } from 'react';
import { Box, Typography } from '@mui/material';

const Default = () => {

    useEffect(() => {
        const timeout = setTimeout(() => {
            document.location.assign('/');
        }, 3000);

        return () => clearTimeout(timeout);
    }, [history]);

    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                height: '100vh',
            }}
        >
            <Typography variant="h1" color="secondary" sx={{ mb: 4 }}>
                404
            </Typography>
            <Typography variant="h4" sx={{ textAlign: 'center', mb: 4 }}>
                Sorry, we couldn't find the page you were looking for.
            </Typography>
            <Typography variant="body1" sx={{ textAlign: 'center' }}>
                You will be redirected to the home page in 3 seconds.
            </Typography>
        </Box>
    );
};

export default Default;