const DAEROGI_API_URL = process.env.DAEROGI_API_URL;
const DAEROGI_API_KEY = process.env.DAEROGI_API_KEY;

export const fetchDaerogiItems = async () => {
  try {
    const response = await fetch(
      `${DAEROGI_API_URL}/api/lawars?sort[0]=id:asc&pagination[page]=1&pagination[pageSize]=7`,
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${DAEROGI_API_KEY}`,
          'Content-Type': 'application/json',
        },
      },
    );

    if (!response.ok) {
      throw new Error('Failed to fetch lawar data');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching lawar:', error);
    throw error;
  }
};

export const fetchDaerogiItem = async (daerogiId: number) => {
  try {
    const response = await fetch(`${DAEROGI_API_URL}/api/lawars/${daerogiId}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${DAEROGI_API_KEY}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch lawar data');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching lawar:', error);
    throw error;
  }
};
