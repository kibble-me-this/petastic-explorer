// src/pages/dashboard/org/tabs/ShopTab.js

import React from 'react';
import { useParams } from 'react-router-dom';
import { ProductShopView } from 'src/sections/product/view';

export default function ShopTab() {
    const { id } = useParams();
    return <ProductShopView userId={id} />;
}
