const tutorials = {
    'cast-on': {
        id: 0,
        slug: 'cast-on',
        title: 'Casting On for Knitting',
        textContent: `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut a mauris quis libero elementum pretium sit amet eu justo. Pellentesque id mauris ac nisi euismod laoreet. Morbi velit ligula, imperdiet ut sem vel, condimentum placerat arcu. Sed ligula dolor, venenatis a aliquet nec, molestie nec eros. Praesent tempor nulla ut tincidunt ultricies. Nunc mollis facilisis massa, quis ullamcorper nisi iaculis vitae. Nunc risus magna, fringilla eleifend leo eu, pulvinar laoreet leo.

        In vel enim mi. Cras facilisis enim eu tempor porta. Sed malesuada elit non imperdiet semper. Duis quis enim elementum, tempus ipsum eget, finibus dolor. Phasellus vulputate condimentum purus, et elementum turpis vehicula et. Phasellus quis tempus risus, ut facilisis libero. Donec rhoncus enim interdum erat vulputate ultrices. Cras dapibus sed nisl suscipit bibendum. Etiam id elit ut ex feugiat pretium et sit amet felis. Nunc auctor vestibulum est, ac ultrices elit rutrum at. Etiam sit amet dui massa. Nam maximus convallis lacinia.

        Suspendisse sed quam nec lectus porta egestas lobortis non ante. Quisque aliquam sapien vel magna dictum sollicitudin. Vivamus tincidunt orci id sapien placerat, at pellentesque mauris venenatis. Phasellus in imperdiet mi. Integer ultrices velit non dapibus congue. Praesent porta rutrum feugiat. Nulla sit amet volutpat quam. Proin non erat nisi. Aenean fringilla lacus quis bibendum ullamcorper. Ut iaculis risus id neque imperdiet, ut pulvinar nulla pretium. In blandit dapibus bibendum. Mauris sed ex velit. Duis dignissim tempor tincidunt. Nunc lacinia commodo vestibulum.`,
        lastUpdated: '3-5-26',
        author: 'Laura Grace',
        likes: "5"
    },
    'cast-off': {
        id: 2,
        slug: 'cast-off',
        title: 'Casting Off for Knitting',
        textContent: `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut a mauris quis libero elementum pretium sit amet eu justo. Pellentesque id mauris ac nisi euismod laoreet. Morbi velit ligula, imperdiet ut sem vel, condimentum placerat arcu. Sed ligula dolor, venenatis a aliquet nec, molestie nec eros. Praesent tempor nulla ut tincidunt ultricies. Nunc mollis facilisis massa, quis ullamcorper nisi iaculis vitae. Nunc risus magna, fringilla eleifend leo eu, pulvinar laoreet leo. Ut tempor ultrices mauris, sit amet viverra elit ornare id. Nulla facilisi. Praesent sollicitudin tincidunt eros, et rhoncus velit egestas sed. Nam vitae nulla et magna tristique vestibulum at in purus. Mauris interdum pulvinar nunc. Vestibulum vitae ante viverra, pharetra orci nec, tincidunt felis. Duis consectetur a felis quis maximus. Fusce dignissim dolor ac ex condimentum malesuada. Fusce varius sollicitudin rhoncus.

        In vel enim mi. Cras facilisis enim eu tempor porta. Sed malesuada elit non imperdiet semper. Duis quis enim elementum, tempus ipsum eget, finibus dolor. Phasellus vulputate condimentum purus, et elementum turpis vehicula et. Phasellus quis tempus risus, ut facilisis libero. Donec rhoncus enim interdum erat vulputate ultrices. Cras dapibus sed nisl suscipit bibendum. Etiam id elit ut ex feugiat pretium et sit amet felis. Nunc auctor vestibulum est, ac ultrices elit rutrum at. Etiam sit amet dui massa. Nam maximus convallis lacinia.

        Vivamus tempus urna id luctus fringilla. Pellentesque nec imperdiet ante. Morbi vel tincidunt metus. Vestibulum ac ante sit amet enim consequat iaculis. In eu purus sit amet felis fermentum aliquet a vitae urna. Nulla condimentum non felis et malesuada. Sed a urna congue, efficitur dolor et, mattis erat. Curabitur vitae nunc porttitor, viverra erat eu, blandit eros. Praesent sodales vitae sapien id egestas.`,
        lastUpdated: '3-2-26',
        author: 'Lucy Jiang',
        likes: "4"
    },
    'knit-stitch': {
        id: 1,
        slug: 'knit-stitch',
        title: 'The Knit Stitch (Stockinette)',
        textContent: `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut a mauris quis libero elementum pretium sit amet eu justo. Pellentesque id mauris ac nisi euismod laoreet. Morbi velit ligula, imperdiet ut sem vel, condimentum placerat arcu. Sed ligula dolor, venenatis a aliquet nec, molestie nec eros. Praesent tempor nulla ut tincidunt ultricies. 

        Nunc mollis facilisis massa, quis ullamcorper nisi iaculis vitae. Nunc risus magna, fringilla eleifend leo eu, pulvinar laoreet leo. Ut tempor ultrices mauris, sit amet viverra elit ornare id. Nulla facilisi. Praesent sollicitudin tincidunt eros, et rhoncus velit egestas sed. 

        In vel enim mi. Cras facilisis enim eu tempor porta. Sed malesuada elit non imperdiet semper. Duis quis enim elementum, tempus ipsum eget, finibus dolor. Phasellus vulputate condimentum purus, et elementum turpis vehicula et. 
        
        Phasellus quis tempus risus, ut facilisis libero. Donec rhoncus enim interdum erat vulputate ultrices. Cras dapibus sed nisl suscipit bibendum. Etiam id elit ut ex feugiat pretium et sit amet felis. Nunc auctor vestibulum est, ac ultrices elit rutrum at. Etiam sit amet dui massa. Nam maximus convallis lacinia.`,
        lastUpdated: '2-28-26',
        author: 'Jennifer Clarke',
        likes: "4"
    },
};

// Model functions

const getAllTutorials = () => {
    return tutorials;
};

const getTutorialBySlug = (tutorialSlug) => {
    return tutorials[tutorialSlug] || null;
};

export { getAllTutorials, getTutorialBySlug };