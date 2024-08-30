const TODOIST_API_URL = 'https://api.todoist.com/rest/v2';

export const getTasks = async () => {
  try {
    const response = await fetch(`${TODOIST_API_URL}/tasks`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${process.env.TODOIST_API_KEY}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching tasks:', error);
    throw new Error('Failed to fetch tasks');
  }
};
