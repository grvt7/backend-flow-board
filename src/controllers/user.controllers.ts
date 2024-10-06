import asyncHandler from '../utils/asyncHandler';

const registerUser = asyncHandler(async (req, res) => {
  console.log('here');
  const data = req.body;
  console.log('userData', data);
  return res.status(200).send('Received');
});

export { registerUser };
