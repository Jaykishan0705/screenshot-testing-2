export const config = {
  pageShots: {
    pages: [{ path: '/pricing/customer-service/', name: 'pricing' }],
    baseUrl: process.env.TARGET_URL || 'https://www.sprinklr.com',
  },
  generateOnly: true,
  failOnDifference: true,
  beforeScreenshot: async (page: any) => {
    let scroll = (args: any) => {
      const { direction, speed } = args;
      const delay = (ms: number, callback: any) => setTimeout(callback, ms);
      const scrollHeight = () => document.body.scrollHeight;
      const start = direction === 'down' ? 0 : scrollHeight();
      const shouldStop = (position: number) => (direction === 'down' ? position > scrollHeight() : position < 0);
      const increment = direction === 'down' ? 100 : -100;
      const delayTime = speed === 'slow' ? 50 : 10;
      console.error(start, shouldStop(start), increment);

      let i = start;

      const scrollStep = () => {
        if (!shouldStop(i)) {
          window.scrollTo(0, i);
          i += increment;
          delay(delayTime, scrollStep);
        }
      };

      scrollStep();
    };
    await page.evaluate(scroll, { direction: 'down', speed: 'slow' });
    await page.evaluate(scroll, { direction: 'up', speed: 'fast' });
  },
};
