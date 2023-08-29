export const get404 = (req, res) => {
  res.status(404).render('404', {
    pageTitle: 'Page not found',

    path: '*'
  });
};

export const get500 = (req, res) => {
  res.status(500).render('500', {
    pageTitle: 'Error page',
    path: '/500'
  });
};
