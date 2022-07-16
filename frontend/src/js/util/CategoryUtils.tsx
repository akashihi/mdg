import React from 'react';
import Category from '../models/Category';
import MenuItem from '@mui/material/MenuItem';

export const mapCategoryListToMenu = (
    categories: Category[],
    account_type: string,
    category_id?: number
): JSX.Element[] => {
    let entries = [];

    let entry = (
        <MenuItem key="top" value={-1}>
            &lt;TOP&gt;
        </MenuItem>
    );
    entries.push(entry);

    const mapEntry = function (category: Category, prefix: number) {
        // We do not want edited category and it's children in a parents list
        if (category.id === category_id) {
            return;
        }

        const prepend = '-'.repeat(prefix);
        const entry = (
            <MenuItem key={category.id} value={category.id}>
                {prepend}
                {category.name}
            </MenuItem>
        );
        entries.push(entry);
        if (Array.isArray(category.children)) {
            category.children.forEach(c => {
                mapEntry(c, prefix + 1);
            });
        }
    };

    categories
        .filter(v => v.account_type.toLowerCase() === account_type.toLowerCase())
        .forEach(c => {
            mapEntry(c, 0);
        });
    return entries;
};
