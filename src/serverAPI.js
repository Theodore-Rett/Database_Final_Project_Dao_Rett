/**
 * 3. List the number of videos for each video category.
 * 4. List the number of videos for each video category where the inventory is non-zero.
 * 5. For each actor, list the video categories that actor has appeared in.
 * 6. Which actors have appeared in movies in different video categories?
 * 7. Which actors have not appeared in a comedy?
 * 8. Which actors have appeared in both a comedy and an action adventure movie?
 *
 * 9. Come up with your own question that requires you join at least three tables. List the question, the SQL you used to answer it, and the answer itself.
 *
 */

const query3 = [
    {
        $group: {
            _id: "$category",
            num: {$count: {}}
        }
    }
]

const query4 = [
    {
        $match: {
            stock: {$gt: 0}
        }
    },
    {
        $group: {
            _id: "$category",
            num: {$count: {}}
        }
    }
]

const query5 = [
    {
        $unwind: {
            path: '$actors',
            preserveNullAndEmptyArrays: true
        }
    },
    {
        $group: {
            _id: '$actors',
            categories: {$addToSet: '$category'}
        }
    },
    {
        $project: {
            _id: 0,
            actor: '$_id',
            categories: '$categories'
        }
    }
]

const query6 = [
    {
        $unwind: {
            path: '$actors',
            preserveNullAndEmptyArrays: true
        }
    },
    {
        $group: {
            _id: '$actors',
            categories: {$addToSet: '$category'}
        }
    },
    {
        $project: {
            _id: 0,
            actor: '$_id',
            categories: '$categories'
        }
    },
    {
        $match: {
            'categories.1': {$exists: true}
        }
    }
]

const query7 = [
    {
        $unwind: {
            path: '$actors',
            preserveNullAndEmptyArrays: true
        }
    },
    {
        $group: {
            _id: '$actors',
            categories: {$addToSet: '$category'}
        }
    },
    {
        $project: {
            _id: 0,
            actor: '$_id',
            categories: '$categories'
        }
    },
    {
        $match: {
            categories: {$not: {$in: ['Comedy']}}
        }
    }
]

const query8 = [
    {
        $unwind: {
            path: '$actors',
            preserveNullAndEmptyArrays: true
        }
    },
    {
        $group: {
            _id: '$actors',
            categories: {$addToSet: '$category'}
        }
    },
    {
        $project: {
            _id: 0,
            actor: '$_id',
            categories: '$categories'
        }
    },
    {
        $match: {
            categories: {$in: ['Comedy', 'Action & Adventure']}
        }
    }
]

const query9 = []

const SERVER_URL = 'http://localhost:3000';
const SERVER_QUERY_URL = `${SERVER_URL}/query/%s`;
const queryMap = {
    3: query3,
    4: query4,
    5: query5,
    6: query6,
    7: query7,
    8: query8,
    9: query9
}

const conductQuery = async (query) => {
    const results = await fetch(SERVER_QUERY_URL.replace('%s', JSON.stringify(query)));
    if (!results.ok) {
        throw new Error(`Server Error: ${results.statusMessage}`);
    }

    const json = await results.json();

    if (json.status === 'error') {
        throw new Error(`API Error: ${json.message}`);
    }

    return json;
}

const getRecordings = async () => {
    const results = await fetch(SERVER_URL+"/data");
    if (!results.ok) {
        throw new Error(`Server Error: ${results.statusMessage}`);
    }

    const json = await results.json();
    if (json.status === 'error') {
        throw new Error(`API Error: ${json.message}`);
    }

    return json;
}