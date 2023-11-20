import React from 'react';
import parse from 'html-react-parser';
import reactStringReplace from 'react-string-replace';
import PropTypes from 'prop-types';

import PostItemHorizontal from './food-item-card';
import PetCard from './pet-card';

const YourCustomComponent = ({ messageContent }) => {
  if (messageContent.responseType === 'get_pet_passport') {
    // Define your user data
    const userData = {
      name: messageContent.prop.name,
      coverUrl: messageContent.prop.avatar_file_name,
      role: messageContent.prop.breed,
      totalFollowers: messageContent.prop.gender,
      totalPosts: 'N/A',
      avatarUrl: 'url_to_avatar_image',
      totalFollowing: messageContent.prop.age.life_stage,
    };

    // Handle invalid messageContent here (e.g., display an error message)
    return (
      <div>
        {reactStringReplace(parse(messageContent.body), '--react-component--', (match, index) => (
          <>
            {/* Create an array of PetCard components with mapped propItems */}
            <PetCard user={userData} /> {/* Pass the same user data to UserCard */}
          </>
        ))}
      </div>
    );
  }
  if (messageContent.responseType === 'get_pet_food_recommendations') {
    if (Array.isArray(messageContent.prop)) {
      // Modify the structure of messageContent.prop to match PostItemHorizontal prop types
      const propItems = messageContent.prop.map((propItem) => ({
        title: propItem.formula, // Map the brand to title (adjust as needed)
        createdAt: null, // Set createdAt as needed
        totalViews: propItem.price_usd_mo, // Set totalViews as needed
        totalComments: null, // Set totalComments as needed
        totalShares: null, // Set totalShares as needed
        author: {
          name: null, // Set author name as needed
          avatarUrl: propItem.image, // Map the image to avatarUrl (adjust as needed)
        },
        publish: propItem.star_rating, // Set publish as needed
        description: propItem.brand, // Set description as needed
        coverUrl: propItem.image, // Map the image to coverUrl (adjust as needed)
      }));

      // Render the array of messages using FoodInfo component and PostItemHorizontal
      const propContent = (
        <div>
          {messageContent.prop.map((subMessage, index) => (
            <div key={index}>
              <PostItemHorizontal post={propItems[index]} /> {/* Pass the propItem as post */}
            </div>
          ))}
        </div>
      );

      // Return both body content and prop content
      return (
        <div>
          {parse(messageContent.body)}
          {propContent}
        </div>
      );
    }
    return <div>{parse(messageContent.body)}</div>;
  }

  // Handle other response types or invalid response types
  // Example: display a message for unsupported types
  return <div>Unsupported response type: {messageContent.responseType}</div>;
};

YourCustomComponent.propTypes = {
  messageContent: PropTypes.string.isRequired,
};

export default YourCustomComponent;
