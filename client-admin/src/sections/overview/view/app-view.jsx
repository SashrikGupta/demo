import { faker } from '@faker-js/faker';
import React, { createContext, useState } from "react";

import Container from '@mui/material/Container';
import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';

import Iconify from 'src/components/iconify';

import AppTasks from '../app-tasks';
import AppNewsUpdate from '../app-news-update';
import AppOrderTimeline from '../app-order-timeline';
import AppCurrentVisits from '../app-current-visits';
import AppWebsiteVisits from '../app-website-visits';
import AppWidgetSummary from '../app-widget-summary';
import AppTrafficBySite from '../app-traffic-by-site';
import AppCurrentSubject from '../app-current-subject';
import AppConversionRates from '../app-conversion-rates';
import { curr_context } from 'src/contexts/Central';
import { useContext  , useEffect} from 'react';
import { useFetch } from 'src/hooks/Fetcher';

// ----------------------------------------------------------------------

export default function AppView() {

  
const now_context = useContext(curr_context);
  const [data , loading , error] = useFetch("/sashrik/users")
  const [book , load , er] = useFetch("/sashrik/books")
console.log(data.lenght)
  
  return (
    <>{
      !loading && (
        <Container maxWidth="xl">
        <Typography variant="h4" sx={{ mb: 5 }}>
          Hi, Welcome back Admin
        </Typography>
  
        <Grid container spacing={3}>
          <Grid xs={12} sm={6} md={3}>
            <AppWidgetSummary
              title="Weekly buys"
              total={5}
              color="success"
              icon={<img alt="icon" src="/assets/icons/glass/ic_glass_bag.png" />}
            />
          </Grid>
  
          <Grid xs={12} sm={6} md={3}>
            <AppWidgetSummary
              title=" Users"
              total={data.length}
              color="info"
              icon={<img alt="icon" src="/assets/icons/glass/ic_glass_users.png" />}
            />
          </Grid>
  
          <Grid xs={12} sm={6} md={3}>
            <AppWidgetSummary
              title="Item "
              total={book.length}
              color="warning"
              icon={<img alt="icon" src="/assets/icons/glass/ic_glass_buy.png" />}
            />
          </Grid>
  
  
  
          <Grid xs={12} md={6} lg={8}>
            <AppWebsiteVisits
              title="monthly Visits"
              subheader="(+43%) than last year"
              chart={{
                labels: [
  
                  '08/01/2023',
                  '09/01/2023',
                  '10/01/2023',
                  '11/01/2023',
                  '01/01/2024',
                  '02/01/2024',
                  '03/01/2024',
                  '04/01/2024',
                  '05/01/2024',
                  '06/01/2024',
                  '07/01/2024',
                ],
                series: [
  
                  {
                    name: 'Team B',
                    type: 'area',
                    fill: 'gradient',
                    data: [44, 55, 41, 67, 22, 43, 21, 41, 56, 27, 43],
                  },
   
                ],
              }}
            />
          </Grid>
  
          <Grid xs={12} md={6} lg={4}>
            <AppCurrentVisits
              title="Current library status"
              chart={{
                series: [
                  { label: 'educational', value: 4344 },
                  { label: 'thriller', value: 5435 },
                  { label: 'sci-fi', value: 1443 },
                  { label: 'romantic', value: 4443 },
                ],
              }}
            />
          </Grid>
  
        </Grid>
      </Container>
      )
    }
    </>
   
  );
}
