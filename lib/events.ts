const EVENTS_API_URL = process.env.EVENTS_API_URL!;
const EVENTS_API_KEY = process.env.EVENTS_API_KEY!;
const EVENTS_DATABASE_ID = process.env.EVENTS_DATABASE_ID!;

export const fetchEventsData = async () => {
  try {
    const response = await fetch(`${EVENTS_API_URL}/${EVENTS_DATABASE_ID}/query`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${EVENTS_API_KEY}`,
        'Content-Type': 'application/json',
        'Notion-Version': '2022-06-28',
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch data: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching Events API data:', error);
    return null;
  }
};
