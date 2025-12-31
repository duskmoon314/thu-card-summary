import { fetchData, getServiceHallCookie } from '@/lib/api';
import { analyze } from '@/lib/data-processing';
import type { ExtensionMessage, FetchDataMessage, ReportData } from '@/lib/types';

export default defineBackground(() => {
  console.log('[BACKGROUND] Background worker initialized', { id: browser.runtime.id });

  // Load debug config from storage on init
  browser.storage.local.get(['debugEnabled', 'debugConfig']).then((result) => {
    console.log('[CONFIG] Loaded from storage:', result);
  });

  // Listen for messages from content script and popup
  browser.runtime.onMessage.addListener(
    (
      message: ExtensionMessage | any,
      sender: browser.Runtime.MessageSender,
      sendResponse: (response: any) => void
    ) => {
      console.log('[MESSAGE] Received:', { type: message.type, sender: sender.tab?.id });

      if (message.type === 'FETCH_DATA') {
        // Handle async operation
        handleFetchData(message)
          .then((response) => {
            console.log('[MESSAGE] Sending response:', response);
            sendResponse(response);
          })
          .catch((error) => {
            console.error('[MESSAGE] Error in handler:', error);
            sendResponse({
              type: 'FETCH_DATA_RESPONSE',
              success: false,
              error: error.message,
            });
          });

        // Return true to indicate we'll send response asynchronously
        return true;
      }

      if (message.type === 'UPDATE_DEBUG_CONFIG') {
        console.log('[CONFIG] Debug config updated:', message.payload);
        sendResponse({ success: true });
        return false;
      }

      sendResponse({ success: false, error: 'Unknown message type' });
      return false;
    }
  );
});

async function handleFetchData(message: FetchDataMessage) {
  try {
    const { userId, startDate, endDate } = message.payload;
    console.log('[FETCH_DATA] Starting:', { userId, startDate, endDate });

    // Get servicehall cookie from browser
    console.log('[COOKIE] Getting servicehall cookie...');
    const serviceHallCookie = await getServiceHallCookie();
    console.log('[COOKIE] Result:', serviceHallCookie ? 'Found' : 'Not found');

    if (!serviceHallCookie) {
      throw new Error(
        'ServiceHall cookie not found. Please make sure you are logged in to card.tsinghua.edu.cn'
      );
    }

    // Fetch transaction data
    console.log('[FETCH_DATA] Fetching from API...');
    const rawData = await fetchData(userId, serviceHallCookie, startDate, endDate);
    console.log('[FETCH_DATA] Fetched records:', rawData?.length || 0);

    if (!rawData || rawData.length === 0) {
      throw new Error('No transaction data found for the specified date range');
    }

    // Analyze data and generate report
    console.log('[ANALYZE] Starting analysis...');
    const reportData: ReportData = await analyze(rawData);
    console.log('[ANALYZE] Complete:', {
      totalAmount: reportData.totalAmount,
      totalMeals: reportData.totalMeals
    });

    const response = {
      type: 'FETCH_DATA_RESPONSE',
      success: true,
      data: reportData,
    };

    console.log('[FETCH_DATA] Returning response with data:', !!response.data);
    return response;
  } catch (error) {
    console.error('[FETCH_DATA] Error:', error);

    return {
      type: 'FETCH_DATA_RESPONSE',
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    };
  }
}
