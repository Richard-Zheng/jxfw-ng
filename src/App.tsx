import * as React from 'react';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import ProTip from './ProTip';
import { AppBar, Grid, Paper, TextField, Toolbar } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import SaveIcon from '@mui/icons-material/Save';
import * as api from './api/api';
import { ICSCalendar } from './api/ics';
import { CourseSchedule } from './api/course';

function Copyright() {
  return (
    <Typography variant="body2" color="text.secondary" align="center">
      {'Copyright © '}
      <Link color="inherit" href="https://mui.com/">
        Your Website
      </Link>{' '}
      {new Date().getFullYear()}.
    </Typography>
  );
}

function download(filename: string, text: string, mimeType = 'text/plain') {
    var pom = document.createElement('a');
    pom.setAttribute('href', `data:${mimeType};charset=utf-8,` + encodeURIComponent(text));
    pom.setAttribute('download', filename);

    if (document.createEvent) {
        var event = document.createEvent('MouseEvents');
        event.initEvent('click', true, true);
        pom.dispatchEvent(event);
    }
    else {
        pom.click();
    }
}

export default function App() {
  const [loading, setLoading] = React.useState(false);
  const [xnxqdm, setXnxqdm] = React.useState('202201');

  const handleClick = async () => {
    setLoading(true);
    const jxfwSession = {};
    const xnxqData = await api.xsAllKbList(jxfwSession, xnxqdm);
    const firstDayInSemester = await api.getFirstDayInSemester(jxfwSession, '202201');
    const cal = new ICSCalendar();
    for (const course of xnxqData) {
      const courseSchedule = new CourseSchedule(course);
      const dates = courseSchedule.getCourseSchedulesInDate(firstDayInSemester);
      for (const date of dates) {
        cal.addEvent(courseSchedule.kcmc, date.start, date.end, undefined, undefined, courseSchedule.jxcdmcs, {freq: 'WEEKLY', count: date.count});
      }
    }
    const calstr = cal.toString();
    download('schedule.ics', calstr, 'text/calendar');
    setLoading(false);
  }

  return (
    <React.Fragment>
      <AppBar
        position="absolute"
        color="default"
        elevation={0}
        sx={{
          position: 'relative',
          borderBottom: (t) => `1px solid ${t.palette.divider}`,
        }}
      >
        <Toolbar>
          <Typography variant="h6" color="inherit" noWrap>
            课程表日历
          </Typography>
        </Toolbar>
      </AppBar>
      <Container component="main" maxWidth="sm" sx={{ mb: 4 }}>
        <Paper variant="outlined" sx={{ my: { xs: 3, md: 6 }, p: { xs: 2, md: 3 } }}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                id="fullwidth"
                label="学年学期代码"
                InputLabelProps={{
                  shrink: true,
                }}
                value={xnxqdm}
                onChange={(e) => {
                  setXnxqdm(e.target.value);
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <LoadingButton
                size="small"
                color="secondary"
                onClick={handleClick}
                loading={loading}
                loadingPosition="start"
                startIcon={<SaveIcon />}
                variant="contained"
              >
                下载
              </LoadingButton>
            </Grid>


          </Grid>

        </Paper>
        <Box sx={{ my: 4 }}>
          <Copyright />
        </Box>
      </Container>
    </React.Fragment>
  );
}
