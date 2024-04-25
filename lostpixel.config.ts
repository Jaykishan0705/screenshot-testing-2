export const config = {
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
};
