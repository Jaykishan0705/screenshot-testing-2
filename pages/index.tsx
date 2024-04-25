import Head from 'next/head';
import { useState } from 'react';
import axios from 'axios';

import { Box } from '@sprinklrjs/spaceweb/box';
import { Input } from '@sprinklrjs/spaceweb/input';
import { Button } from '@sprinklrjs/spaceweb/button';
import { VRTDisplay, ImageType } from '@/src/components/VRTDisplay';
import SpacewebProvider from '@sprinklrjs/spaceweb/spacewebProvider';

//light theme
import light from '@sprinklrjs/spaceweb-themes/hyperspace/light';
import { Typography } from '@sprinklrjs/spaceweb/typography';

const config = {
  pageShots: {
    pages: [
      { path: '/pricing/customer-service/', name: 'pricing-customer-service' },
      { path: '/pricing/social-media-management/', name: 'pricing-social-media-management' },
      { path: '/pricing/consumer-intelligence', name: 'pricing-consumer-intelligence' },
      { path: '/pricing/marketing-and-advertising', name: 'pricing-marketing-and-advertising' },
    ],
    baseUrl: process.env.TARGET_URL || 'https://www.sprinklr.com',
  },
  imagePathBaseline: 'pages/api/database/.lostpixel/baseline',
  imagePathCurrent: 'pages/api/database/.lostpixel/current',
  imagePathDifference: 'pages/api/database/.lostpixel/difference',
  generateOnly: true,
  failOnDifference: false,
  compareEngine: 'odiff',
}

export default function Home() {
  const [baseUrl, setBaseUrl] = useState('https://www.sprinklr.com');
  const [compareUrl, setCompareUrl] = useState('https://staging.sprinklr.com');

  const [isLoading, setIsLoading] = useState(false);

  const [images, setImages] = useState<ImageType[] | undefined>();

  const [err, setErr] = useState('');

  const compare = async () => {
    setImages(undefined);
    setIsLoading(true);
    setErr('');

    try {
      const { data } = await axios.post('/api/initiateCompare', { baseUrl, compareUrl });
      const taskId = data.taskId;

      const intervalId = setInterval(async () => {
        try {
          const { data } = await axios.get(`/api/trackCompareStatus?taskId=${taskId}`);
          if (data.status === 'completed') {
            // const { data } = await axios.get('/api/getImages');
            // setImages(data);
            const response = await fetch(`/api/get-images`);
            console.log('response',response);
            clearInterval(intervalId);
            setIsLoading(false);
          } else if (data.status === 'error') {
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
            disabled={isLoading}
          />
          <Input
            className="w-15/24"
            value={compareUrl}
            onChange={e => setCompareUrl(e.target.value)}
            placeholder="https://staging.sprinklr.com"
            disabled={isLoading}
          />
          <Button onClick={compare} isLoading={isLoading} className="w-12" disabled={isLoading}>
            Compare
          </Button>
          {images ? <VRTDisplay images={images} /> : null}
          {err ? <Typography className="spr-support-error-text">{err}</Typography> : null}
        </Box>
      </SpacewebProvider>
    </>
  );
}
