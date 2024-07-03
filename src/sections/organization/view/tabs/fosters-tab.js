import React from 'react';
import { useParams } from 'react-router-dom';
import { _userFollowers } from 'src/_mock';
import ProfileFollowers from 'src/sections/user/profile-followers';

export default function FostersTab() {
    const { id } = useParams();
    return <ProfileFollowers followers={_userFollowers} account_id={id} />;
}
