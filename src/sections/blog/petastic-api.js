const emailjs = require('@emailjs/browser');
const axios = require('axios');
const fetch = require('node-fetch');

// Function to update the database status
const updatePetStatus = async (pet_passport_id, pet_owner_id, new_status) => {
  console.log('Calling updatePetStatus');
  try {
    const requestData = {
      pet_passport_id,
      account_id: pet_owner_id,
      new_status,
    };

    // Make the API request to update pet status using Axios
    const response = await axios.post(
      'https://uot4ttu72a.execute-api.us-east-1.amazonaws.com/default/updatePetStatus',
      requestData,
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    // Check the response status code (status) instead of response.ok
    if (response.status !== 200) {
      // Handle API request error here
      console.error('API request error:', response.statusText);
      return { success: false, message: 'API request error' };
    }

    return { success: true, message: 'Pet status updated successfully' };
  } catch (error) {
    // Handle any other errors here
    console.error('An error occurred:', error);
    return { success: false, message: 'An error occurred' };
  }
};

// Function to handle pet adoption
const handlePetAdoption = async (petPassportId, currentAccountId, newOwnerInfo) => {
  try {
    // Prepare the request data including the new owner info
    const requestData = {
      pet_passport_id: petPassportId,
      account_id: currentAccountId,
      new_owner_description: newOwnerInfo, // Include the new owner info
    };

    console.log('requestData: ', requestData);

    // Make the API request to update pet adoption
    const response = await fetch(
      'https://uot4ttu72a.execute-api.us-east-1.amazonaws.com/default/handlePetAdoption',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData),
      }
    );

    if (!response.ok) {
      // Handle API request error here
      console.error('API request error:', response.statusText);
      return { success: false, message: 'API request error' };
    }

    // If the API request was successful, return a success message
    return { success: true, message: 'Pet adoption completed successfully' };
  } catch (error) {
    // Handle any other errors here
    console.error('An error occurred:', error);
    return { success: false, message: 'An error occurred' };
  }
};
// Function to send an email
const sendEmail = async (to_email, conversationId, petPassport, pet_image, pet_name) => {
  try {
    const templateParams = {
      to_email,
      conversationId,
      petPassport,
      pet_image,
      pet_name,
    };

    const result = await emailjs.send(
      'service_2nw5qla', // Replace with your service ID
      'template_doutfbm', // Replace with your template ID
      templateParams, // Template parameters
      'xdL7DKBOnhX6fRDbJ' // Replace with your user ID
    );

    console.log(result.text);
    return { success: true, message: 'Email sent successfully' };
  } catch (error) {
    console.log(error.text);
    return { success: false, message: 'Email sending failed' };
  }
};

module.exports = { updatePetStatus, handlePetAdoption, sendEmail };
