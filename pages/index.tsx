import Head from 'next/head';
import { useState } from 'react';
import axios from 'axios';

import { Box } from '@sprinklrjs/spaceweb/box';
import { Input } from '@sprinklrjs/spaceweb/input';
import { Button } from '@sprinklrjs/spaceweb/button';
import { VRTDisplay } from '@/src/components/VRTDisplay';
import SpacewebProvider from '@sprinklrjs/spaceweb/spacewebProvider';

//light theme
import light from '@sprinklrjs/spaceweb-themes/hyperspace/light';
import { Typography } from '@sprinklrjs/spaceweb/typography';

export default function Home() {
  const [baseUrl, setBaseUrl] = useState('https://www.sprinklr.com');
  const [compareUrl, setCompareUrl] = useState('https://staging.sprinklr.com');

  const [isLoading, setIsLoading] = useState(false);

  const [taskStatus, setTaskStatus] = useState('');

  const [err, setErr] = useState('');

  const compare = async () => {
    setIsLoading(true);
    setErr('');
    setTaskStatus('');

    try {
      const { data } = await axios.post('/api/taskHandler', { baseUrl, compareUrl });
      const taskId = data.taskId;

      const intervalId = setInterval(async () => {
        try {
          const { data } = await axios.get(`/api/taskHandler?taskId=${taskId}`);
          setTaskStatus(data.status);
          if (data.status === 'completed' || data.status === 'error') {
            clearInterval(intervalId);
            setIsLoading(false);
          }
        } catch (e) {
          console.log(e);
          clearInterval(intervalId);
          setIsLoading(false);
        }
      }, 10000);
    } catch (e: any) {
      setErr(e?.response?.data?.error);
      setIsLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>screenshot testing</title>
        <meta name="description" content="screenshot testing" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <SpacewebProvider direction="ltr" theme={light}>
        <Box className="flex flex-col gap-4">
          <Input
            className="w-15/24"
            value={baseUrl}
            onChange={e => setBaseUrl(e.target.value)}
            placeholder="https://www.sprinklr.com"
          />
          <Input
            className="w-15/24"
            value={compareUrl}
            onChange={e => setCompareUrl(e.target.value)}
            placeholder="https://staging.sprinklr.com"
          />
          <Button onClick={compare} isLoading={isLoading} className="w-12">
            Compare
          </Button>
          {taskStatus === 'completed' ? <VRTDisplay /> : null}
          {err ? <Typography className="spr-support-error-text">{err}</Typography> : null}
        </Box>
      </SpacewebProvider>
    </>
  );
}
