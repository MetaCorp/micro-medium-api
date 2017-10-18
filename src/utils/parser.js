const R = require('ramda');
const { BASE_URL, BASE_IMAGEURL } = require('./constants');

const toJSON = R.pipe(R.replace('])}while(1);</x>', ''), JSON.parse);

const assocWithUrl = (username, posts) =>
  posts.map(post => {
    const url = `${BASE_URL}/@${username}/${post.uniqueSlug}`;
    const imageUrl = `${BASE_IMAGEURL}/${R.path(['virtuals', 'previewImage', 'imageId'])(post)}`;
    return R.pipe(R.assoc('url', url), R.assoc('imageUrl', imageUrl))(post);
  });

const posts = R.pipe(
  R.prop('payload'),
  R.converge(assocWithUrl, [
    R.path(['user', 'username']),
    R.pipe(R.path(['references', 'Post']), R.values),
  ])
);

const user = R.path(['payload', 'user']);

module.exports = {
  toJSON,
  posts,
  user,
};
