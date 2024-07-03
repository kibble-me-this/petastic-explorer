// src/sections/organization/view/org-details-view.js

import PropTypes from 'prop-types';
import { useCallback, useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation, Outlet } from 'react-router-dom';
// @mui
import Tab from '@mui/material/Tab';
import Card from '@mui/material/Card';
import Tabs, { tabsClasses } from '@mui/material/Tabs';
import Container from '@mui/material/Container';
// _mock
import { _jobs, JOB_PUBLISH_OPTIONS, _userAbout } from 'src/_mock';
// components
import Label from 'src/components/label';
import Iconify from 'src/components/iconify';
import { useSettingsContext } from 'src/components/settings';
import OrgDetailsToolbar from '../org-details-toolbar';
import ProfileCover from '../../user/profile-cover';


export default function JobDetailsView({ initialTab }) {
  const settings = useSettingsContext();
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const currentJob = _jobs.filter((job) => job.id === id)[0];
  const [publish, setPublish] = useState(currentJob?.publish);
  const [ownerName, setOwnerName] = useState('');
  const [ownerLogo, setOwnerLogo] = useState('');
  const [activeTab, setActiveTab] = useState(initialTab || 'pets');

  useEffect(() => {
    const path = location.pathname.split('/').pop();
    setActiveTab(path);
  }, [location]);

  useEffect(() => {
    const shelterAccountId = id;
    const apiUrl = `https://uot4ttu72a.execute-api.us-east-1.amazonaws.com/default/getPetsByAccountId?account_id=${shelterAccountId}`;

    fetch(apiUrl)
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then((data) => {
        setOwnerName(data.shelter_name_common);
        setOwnerLogo(data.logo);
      })
      .catch((error) => {
        console.error('Error fetching user pets:', error);
      });
  }, [id]);

  const handleChangeTab = useCallback(
    (event, newValue) => {
      navigate(`/dashboard/org/${id}/${newValue}`);
      setActiveTab(newValue);
    },
    [id, navigate]
  );

  const handleChangePublish = useCallback((newValue) => {
    setPublish(newValue);
  }, []);

  const TABS = [
    {
      value: 'pets',
      label: 'Pets',
      icon: <Iconify icon="solar:heart-bold" width={24} />,
    },
    {
      value: 'fosters',
      label: 'Fosters',
      icon: <Iconify icon="solar:users-group-rounded-bold" width={24} />,
    },
    {
      value: 'shop',
      label: 'Shop',
      icon: <Iconify icon="solar:gallery-wide-bold" width={24} />,
    },
    {
      value: 'orders',
      label: 'Orders',
      icon: <Iconify icon="solar:gallery-wide-bold" width={24} />,
    },
  ];

  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      <OrgDetailsToolbar
        backLink="/dashboard/org"
        editLink={`/dashboard/job/edit/${currentJob?.id}`}
        liveLink="#"
        publish={publish || ''}
        onChangePublish={handleChangePublish}
        publishOptions={JOB_PUBLISH_OPTIONS}
      />
      <Card
        sx={{
          mb: 3,
          height: 250,
          boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
        }}
      >
        <ProfileCover
          role={_userAbout.role}
          name={ownerName}
          avatarUrl={ownerLogo}
          coverUrl="/assets/background/hero.jpg"
        />

        <Tabs
          value={activeTab}
          onChange={handleChangeTab}
          sx={{
            width: 1,
            bottom: 0,
            zIndex: 9,
            position: 'absolute',
            bgcolor: 'background.paper',
            [`& .${tabsClasses.flexContainer}`]: {
              pr: { md: 3 },
              justifyContent: {
                sm: 'center',
                md: 'flex-end',
              },
            },
          }}
        >
          {TABS.map((tab) => (
            <Tab key={tab.value} value={tab.value} icon={tab.icon} label={tab.label} />
          ))}
        </Tabs>
      </Card>

      <Outlet />
    </Container>
  );
}

JobDetailsView.propTypes = {
  initialTab: PropTypes.string,
};
