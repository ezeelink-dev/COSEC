// src/handlers/menuHandler.jsx
import axios from 'axios';

// Function to fetch menu data for a specific user
export const fetchMenuData = async (userId) => {
  try {
    const response = await axios.get(`http://103.142.175.92:5001/api/menus/user/1`);
    return response.data;
  } catch (error) {
    console.error('Error fetching menu data:', error);
    return [];
  }
};