import { useMemo } from 'react';

const MOCK_DATA = {
  name: 'Website Chính',
  status: '503 Service Unavailable',
  time: '14:30 12/10/2023',
  url: 'https://example.com'
};

const usePreviewParser = (templateString, mockData = MOCK_DATA) => {
  return useMemo(() => {
    if (!templateString) return '';
    let parsedString = templateString;
    // Replace all known variables with their mock values
    Object.keys(mockData).forEach((key) => {
      const regex = new RegExp(`{${key}}`, 'g');
      parsedString = parsedString.replace(regex, mockData[key]);
    });
    return parsedString;
  }, [templateString, mockData]);
};

export default usePreviewParser;
