import {OrderedMap} from 'immutable';

export function filterNonListedCategories(categories_ids, categoryList) {
    const filterCategory = function(category) {
        var kids = OrderedMap();

        if (category.has('children')) {
            category.get('children').forEach((item, k) => {
                const filtered = filterCategory(item);
                if (filtered != null) {
                    kids = kids.set(k, filtered)
                }
            })
        }

        category = category.set('children', kids);

        if (categories_ids.includes(category.get('id')) || !kids.isEmpty()) {
            return category
        }


        return null
    };

    const entries = [];
    categoryList.forEach(item => {
        const c = filterCategory(item);
        if (c != null) {
            entries.push(c)
        }
    });
    return entries
}
