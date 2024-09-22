const MATCHING_API_URL = process.env.MATCHING_API_URL;
const MATCHING_API_KEY = process.env.MATCHING_API_KEY;

const fetchMatchingAPI = async (url: string) => {
  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${MATCHING_API_KEY}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch data from ${url}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching from Matching API:', error);
    throw error;
  }
};

export const fetchMatchingItems = async () => {
  const url = `${MATCHING_API_URL}/api/lawars?sort[0]=id:asc&pagination[page]=1&pagination[pageSize]=7`;
  return await fetchMatchingAPI(url);
};

export const fetchMatchingItem = async (daerogiId: number) => {
  const url = `${MATCHING_API_URL}/api/lawars/${daerogiId}`;
  return await fetchMatchingAPI(url);
};

export const fetcAlarms = async () => {
  const url = `${MATCHING_API_URL}/api/lawar-slack-mentions?sort[0]=id:desc`;
  return await fetchMatchingAPI(url);
};

export const fetcNotifications = async () => {
  const url = `${MATCHING_API_URL}/api/lawar-slack-notifications?sort[0]=id:desc`;
  return await fetchMatchingAPI(url);
};

export const fetchSlackIds = async () => {
  const url = `${MATCHING_API_URL}/api/lawar-slack-ids?sort[0]=id:asc`;
  return await fetchMatchingAPI(url);
};

export const fetchSlackOnlyIds = async () => {
  const url = `${MATCHING_API_URL}/api/lawar-slack-only-ids?sort[0]=id:asc`;
  return await fetchMatchingAPI(url);
};
