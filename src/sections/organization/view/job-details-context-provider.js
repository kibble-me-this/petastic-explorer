// src/sections/organization/view/job-details-context-provider.js

import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import PropTypes from 'prop-types';
import { useParams } from 'react-router-dom';
import orderBy from 'lodash/orderBy';
import { _jobs } from 'src/_mock';

const JobDetailsContext = createContext();

export const useJobDetailsContext = () => useContext(JobDetailsContext);

const defaultFilters = {
    publish: 'all',
};

export const JobDetailsContextProvider = ({ children }) => {
    const { id } = useParams();
    const [sortBy, setSortBy] = useState('latest');
    const [filters, setFilters] = useState(defaultFilters);
    const currentJob = _jobs.filter((job) => job.id === id)[0];
    const [publish, setPublish] = useState(currentJob?.publish);
    const [isApiLoading, setIsApiLoading] = useState(true);
    const [apiPets, setApiPets] = useState([]);
    const [filteredAndSortedPets, setFilteredAndSortedPets] = useState([]);

    const updateFilteredAndSortedPets = useCallback((newPets) => {
        setFilteredAndSortedPets(newPets);
        handleFilterPublish(null, 'adopted');
    }, []);

    useEffect(() => {
        setIsApiLoading(true);
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
                setApiPets(data.pets);
                const filteredAndSortedData = applyFilter(data.pets, filters, sortBy);
                setFilteredAndSortedPets(filteredAndSortedData);
                setIsApiLoading(false);
            })
            .catch((error) => {
                console.error('Error fetching user pets:', error);
                setIsApiLoading(false);
            });
    }, [id, filters, sortBy]);

    const handleFilterPublish = (event, newValue) => {
        setFilters((prevState) => ({
            ...prevState,
            publish: newValue,
        }));
    };

    const applyFilter = (inputData, currentFilters, currentSortBy) => {
        const { publish: filterPublish } = currentFilters;

        if (currentSortBy === 'latest') {
            inputData = orderBy(inputData, ['createdAt'], ['desc']);
        }

        if (currentSortBy === 'oldest') {
            inputData = orderBy(inputData, ['createdAt'], ['asc']);
        }

        if (currentSortBy === 'popular') {
            inputData = orderBy(inputData, ['totalViews'], ['desc']);
        }

        if (filterPublish !== 'all') {
            const filteredData = [];

            inputData.forEach((post) => {
                const type = post.type;
                const status = post.status;

                if (
                    type.includes('Anymal::Carnivora::Canidae::Canis::Canis Lupus Familiars::Domesticated Dog:Dog') &&
                    filterPublish === 'dog'
                ) {
                    if (typeof status === 'undefined' || status.includes('adoptable')) {
                        filteredData.push(post);
                    }
                }

                if (
                    type.includes('Anymal::Carnivora::Felidae::Felis::Felis Catus::Domesticated Cat::Cat') &&
                    filterPublish === 'cat'
                ) {
                    if (typeof status === 'undefined' || status.includes('adoptable')) {
                        filteredData.push(post);
                    }
                }

                if (typeof status !== 'undefined' && status.includes('adopted') && filterPublish === 'adopted') {
                    filteredData.push(post);
                }
            });

            inputData = filteredData;
        }

        return inputData;
    };

    const contextValue = useMemo(() => ({
        dataFiltered: filteredAndSortedPets,
        isApiLoading,
        filteredAndSortedPets,
        updateFilteredAndSortedPets,
    }), [filteredAndSortedPets, isApiLoading, updateFilteredAndSortedPets]);

    return (
        <JobDetailsContext.Provider value={contextValue}>
            {children}
        </JobDetailsContext.Provider>
    );
};

JobDetailsContextProvider.propTypes = {
    children: PropTypes.node,
};
