const emailjs = require('@emailjs/browser');
const axios = require('axios');
const fetch = require('node-fetch');

// Function to fetch pets by account ID, pet_passport, or email
const getPetsByAccountId = async (id) => {
  console.log('Call getPetsByAccountId:', getPetsByAccountId);
  console.log('Call getPetsByAccountId with :', id);

  try {
    let apiUrl = `https://uot4ttu72a.execute-api.us-east-1.amazonaws.com/default/getPetsByAccountId`;

    const queryParameters = [];

    if (id.includes('@')) {
      queryParameters.push(`email=${encodeURIComponent(id)}`);
    } else {
      queryParameters.push(`account_id=${encodeURIComponent(id)}`);
    }

    apiUrl += `?${queryParameters.join('&')}`;

    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching user pets:', error);
    throw error;
  }
};

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

// Function to handle create account
const handleCreateAccount = async (magic_user) => {
  try {
    // Prepare the request data including the magic_user object
    const requestData = {
      email: magic_user.email,
      isMfaEnabled: magic_user.isMfaEnabled,
      issuer: magic_user.issuer,
      phoneNumber: magic_user.phoneNumber,
      recoveryFactors: magic_user.recoveryFactors,
      walletType: magic_user.walletType,
    };

    // Make the API request to create an account
    const response = await fetch(
      'https://uot4ttu72a.execute-api.us-east-1.amazonaws.com/default/handleCreateAccount',
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
    const responseData = await response.json();
    return responseData;
  } catch (error) {
    // Handle any other errors here
    console.error('An error occurred:', error);
    return { success: false, message: 'An error occurred' };
  }
};

// Function to handle create account
const handlePetPassportTransfer = async (new_account_id, pet_passport_id) => {
  try {
    console.log('new_account_id: ', new_account_id);
    console.log('pet_passport_id: ', pet_passport_id);

    // Prepare the request data including the magic_user object
    const requestData = {
      new_account_id,
      pet_passport_id,
    };

    // Make the API request to create an account
    const response = await fetch(
      'https://uot4ttu72a.execute-api.us-east-1.amazonaws.com/default/handlePetPassportTransfer',
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
    const responseData = await response.json();
    return responseData;
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

module.exports = {
  getPetsByAccountId,
  updatePetStatus,
  handlePetAdoption,
  handleCreateAccount,
  handlePetPassportTransfer,
  sendEmail,
};
