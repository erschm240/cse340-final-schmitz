const instructors = {
    'emily-johnson': {
        id: 0,
        slug: 'emily-johnson',
        name: 'Emily Johnson',
        username: 'emilyknits1234',
        img: `/images/instructors/emily-johnson.jpg`,
        biographyText: 'Hi! I\'m Emily and I\'ve been knitting for 5 years. I love sharing my knowledge with others.'
    },
    'amber-brown': {
        id: 1,
        slug: 'amber-brown',
        name: 'Amber Brown',
        username: 'crazycrochet89',
        img: `/images/instructors/amber-brown.jpg`,
        biographyText: 'Hi! I\'m Amber and I\'ve been crocheting for 8 years. I love sharing my knowledge with others.'
    },
    'jennifer-clarke': {
        id: 2,
        slug: 'jennifer-clarke',
        name: 'Jennifer Clarke',
        username: 'craftingwithjennifer54',
        img: `/images/instructors/jennifer-clarke.jpg`,
        biographyText: 'Hi! I\'m Jennifer and I\'ve been knitting for 7 years. I love sharing my knowledge with others.'
    }
}

// Model functions

const getAllInstructors = () => {
    return instructors;
};

const getInstructorBySlug = (instructorSlug) => {
    return instructors[instructorSlug] || null;
};

export { getAllInstructors, getInstructorBySlug };