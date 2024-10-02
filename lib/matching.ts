const DAEROGI_API_URL = process.env.DAEROGI_API_URL;
const DAEROGI_API_KEY = process.env.DAEROGI_API_KEY;

const fetchDaerogiAPI = async (url: string) => {
  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${DAEROGI_API_KEY}`,
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
  const url = `${DAEROGI_API_URL}/api/lawar-matchings?sort[0]=createdAt:asc`;
  return await fetchDaerogiAPI(url);
};

export const fetchMatchingItem = async (daerogiId: string) => {
  const url = `${DAEROGI_API_URL}/api/lawar-matchings/${daerogiId}`;
  return await fetchDaerogiAPI(url);
};

export const fetcAlarms = async () => {
  const url = `${DAEROGI_API_URL}/api/lawar-slack-mentions?sort[0]=createdAt:desc`;
  return await fetchDaerogiAPI(url);
};

export const fetcNotifications = async () => {
  const url = `${DAEROGI_API_URL}/api/lawar-slack-notifications?sort[0]=createdAt:desc`;
  return await fetchDaerogiAPI(url);
};

export const fetchSlackIds = async () => {
  const url = `${DAEROGI_API_URL}/api/lawar-slack-ids?sort[0]=createdAt:asc`;
  return await fetchDaerogiAPI(url);
};

export const fetchSlackOnlyIds = async () => {
  const url = `${DAEROGI_API_URL}/api/lawar-slack-only-ids?sort[0]=createdAt:asc`;
  return await fetchDaerogiAPI(url);
};
