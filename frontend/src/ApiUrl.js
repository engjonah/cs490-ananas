export default process.env.NODE_ENV === 'production'
  ? window.location.origin
  : 'http://localhost:3000';
