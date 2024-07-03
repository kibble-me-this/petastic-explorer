// src/pages/dashboard/org/tabs/PetsTab.js

import React from 'react';
import PetListHorizontal from 'src/sections/blog/pet-list-horizontal';
import { useJobDetailsContext } from 'src/sections/organization/view/job-details-context-provider';

export default function PetsTab() {
    const { dataFiltered, isApiLoading, filteredAndSortedPets, updateFilteredAndSortedPets } = useJobDetailsContext();

    return (
        <>
            <PetListHorizontal
                posts={dataFiltered}
                loading={isApiLoading}
                filteredAndSortedPets={filteredAndSortedPets}
                updateFilteredAndSortedPets={updateFilteredAndSortedPets}
            />
        </>
    );
}
