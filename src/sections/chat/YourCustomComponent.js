import React from 'react';
import parse from 'html-react-parser';
import reactStringReplace from 'react-string-replace';
import PropTypes from 'prop-types';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

import PetFoodCard from './food-item-card';
import NewParentList from './new-parent-list';
import PetCard from './pet-card';
import JobItem from './job-item';

import PetDNACard from './pet-dna-card';
import ProductFilters from './product-filters';

import FetchButton from './fetch-button';
import FetchAcceptPetButton from './fetch-accept-pet-button';

const YourCustomComponent = ({ messageContent, pet, setPet, onAiLoadingChange }) => {
  if (messageContent.responseType === 'get_pet_passport') {
    console.log('Value in messageContent: ', messageContent);

    // Define your user data
    const userData = {
      name: messageContent.prop.name,
      coverUrl: messageContent.prop.avatar,
      role: messageContent.prop.breed,
      totalFollowers: messageContent.prop.gender,
      totalPosts: 'N/A',
      avatarUrl: 'url_to_avatar_image',
      totalFollowing: messageContent.prop.age.life_stage,
    };

    // Handle invalid messageContent here (e.g., display an error message)
    return (
      <div style={{ paddingTop: '8px' }}>
      {reactStringReplace(parse(messageContent.body), '--react-component--', (match, index) => (
        <div style={{ paddingTop: '8px' }}>
          {/* Create an array of PetCard components with mapped propItems */}
          <div style={{ paddingTop: '8px', paddingBottom: '8px' }}>
            <PetCard xs={{py: 5}} user={userData} /> {/* Pass the same user data to UserCard */}
          </div>
        </div>
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
              <PetFoodCard post={propItems[index]} /> {/* Pass the propItem as post */}
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

  if (messageContent.responseType === 'handle_paws_before_profits_opt_in') {
    console.log('Called handle_paws_before_profits_opt_in in');
    if (Array.isArray(messageContent.prop)) {
      // Modify the structure of messageContent.prop to match PostItemHorizontal prop types
      const propItems = messageContent.prop.map((propItem) => ({
        title: propItem.title,
        createdAt: null,
        totalViews: propItem.price_usd_mo,
        totalComments: null,
        totalShares: null,
        author: {
          name: null,
          avatarUrl: propItem.image,
        },
        publish: propItem.enabled,
        description: propItem.description,
        coverUrl: propItem.command,
      }));
  
      // Render the array of messages using FoodInfo component and PostItemHorizontal
      const propContent = (
        <div>
          {messageContent.prop.map((subMessage, index) => (
            <div key={index}>
              <NewParentList post={propItems[index]} onAiLoadingChange={onAiLoadingChange} />
            </div>
          ))}
        </div>
      );
  
      // Return both body content and prop content
      return (
        <div style={{ marginTop: '12px' }}>
          <div>{parse(messageContent.body)}</div> 
          <ProductFilters
            open
            canReset
            filters={{ priceRange: [65, 125] }} // Provide initial filter values
          />
          </div>
      );
    }
    return <div>{parse(messageContent.body)}</div>;
  }

  if (messageContent.responseType === 'handle_submit_budget') {
    console.log('Called handle_submit_budget');
    if (Array.isArray(messageContent.prop)) {
      // Modify the structure of messageContent.prop to match PostItemHorizontal prop types
      const propItems = messageContent.prop.map((propItem) => ({
        title: propItem.title,
        createdAt: null,
        totalViews: propItem.price_usd_mo,
        totalComments: null,
        totalShares: null,
        author: {
          name: null,
          avatarUrl: propItem.image,
        },
        publish: propItem.enabled,
        description: propItem.description,
        coverUrl: propItem.command,
      }));
  
      // Render the array of messages using FoodInfo component and PostItemHorizontal
      const propContent = (
        <div>
          {messageContent.prop.map((subMessage, index) => (
            <div key={index}>
              <NewParentList post={propItems[index]} onAiLoadingChange={onAiLoadingChange} />
            </div>
          ))}
        </div>
      );
  
      // const replacedBody = reactStringReplace(parse(messageContent.body), '--react-component--', (match, index) =>
      // index === 0 ? <div style={{ paddingTop: '8px' }}><PetCard/></div> : match
      // );

      // console.log('Replaced body:', replacedBody);
  
      // Return both body content and prop content
      return (
        <div style={{ marginTop: '12px' }}>
          <div>{messageContent.body}</div> 

          {propContent}
        </div>
      );
    }
    return <div>{parse(messageContent.body)}</div>;
  }
  
  

  if (messageContent.responseType === 'handle_dna_conversation') {
    console.log('Called handle_dna_conversation');
    if (Array.isArray(messageContent.prop)) {
      // Modify the structure of messageContent.prop to match PostItemHorizontal prop types
      const propItems = messageContent.prop.map((propItem) => ({
        title: propItem.title, // Map the brand to title (adjust as needed)
        createdAt: null, // Set createdAt as needed
        totalViews: propItem.price_usd_mo, // Set totalViews as needed
        totalComments: null, // Set totalComments as needed
        totalShares: null, // Set totalShares as needed
        author: {
          name: null, // Set author name as needed
          avatarUrl: propItem.image, // Map the image to avatarUrl (adjust as needed)
        },
        publish: propItem.star_rating, // Set publish as needed
        description: propItem.description, // Set description as needed
        coverUrl: propItem.command, // Map the image to coverUrl (adjust as needed)
      }));

      // Render the array of messages using FoodInfo component and PostItemHorizontal
      const propContent = (
        <div>
          {messageContent.prop.map((subMessage, index) => (
            <div key={index}>
              <JobItem post={propItems[index]} onAiLoadingChange={onAiLoadingChange} />
            </div>
          ))}
        </div>
      );

      // Return both body content and prop content
      return (
        <div style={{ marginTop: '12px' }}>
          <div>{parse(messageContent.body)}</div>
          {propContent}
        </div>
      );
    }
    return <div>{parse(messageContent.body)}</div>;
  }

  // Check if the message content includes 'login' and return a button if it does
  if (messageContent.body.includes('html login button')) {
    return (
      <Typography sx={{ typography: 'chat_body', marginTop: '12px' }}>
        {reactStringReplace(parse(messageContent.body), 'html login button', (match, index) => (
          <>
            <FetchButton value={messageContent.body} onAiLoadingChange={onAiLoadingChange} />{' '}
          </>
        ))}
      </Typography>
    );
  }

  // Check if the message content includes 'login' and return a button if it does
  if (messageContent.body.includes('html accept pet button')) {
    return (
      <Typography sx={{ typography: 'chat_body', marginTop: '12px' }}>
        {reactStringReplace(
          parse(messageContent.body),
          'html accept pet button',
          (match, index) => (
            <>
              <FetchAcceptPetButton
                value={messageContent.body}
                pet={pet}
                setPet={setPet}
                onAiLoadingChange={onAiLoadingChange}
              />{' '}
            </>
          )
        )}
      </Typography>
    );
  }

  // Handle other response types or invalid response types
  // Example: display a message for unsupported types
  return <div>Unsupported response type: {messageContent.body}</div>;
};

YourCustomComponent.propTypes = {
  messageContent: PropTypes.string.isRequired,
  pet: PropTypes.array,
  setPet: PropTypes.func,
  onAiLoadingChange: PropTypes.func,
};

export default YourCustomComponent;
