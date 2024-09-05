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
    console.error('Error fetching from Daerogi API:', error);
    throw error;
  }
};

export const fetchDaerogiItems = async () => {
  const url = `${DAEROGI_API_URL}/api/lawars?sort[0]=id:asc&pagination[page]=1&pagination[pageSize]=7`;
  return await fetchDaerogiAPI(url);
};

export const fetchDaerogiItem = async (daerogiId: number) => {
  const url = `${DAEROGI_API_URL}/api/lawars/${daerogiId}`;
  return await fetchDaerogiAPI(url);
};
