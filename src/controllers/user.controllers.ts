import User from '../models/user.model';
import { ApiError } from '../utils/ApiErrors';
import asyncHandler from '../utils/asyncHandler';
import { ApiResponse } from '../utils/ApiResponse';
import { Error } from 'mongoose';
import { ExpressRequestInterface } from 'models/expressRequest.interface';

const generateAccessAndRefreshTokens = async (userId: string) => {
  try {
    // Fetch the user
    const user = await User.findById(userId);
    if (!user) throw new ApiError(404, 'USER NOT FOUND!!');

    // Generate the token
    const accessToken = await user.generateAccessToken();
    const refreshToken = await user.generateRefreshToken();

    // Assign the refresh token and save
    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    //Self explanatory
    return { accessToken, refreshToken };
  } catch (error) {
    // Again //Self explanatory
    throw new ApiError(
      500,
      'Something went wrong while generating the tokens.',
    );
  }
};

const registerUser = asyncHandler(async (req, res) => {
  const { email, username, password, fullname } = req.body;
  // Checks if any field is missing
  if (
    [fullname, email, username, password].some(
      (field) => field.trim() === null || field.trim() === '',
    )
  ) {
    throw new ApiError(400, 'All fields are necessary.');
  }

  // // Checks if the user already exists
  const existingUser = await User.findOne({ $or: [{ username }, { email }] });
  if (existingUser) {
    throw new ApiError(409, 'User with username or email already exists.');
  }

  // To save the new user - Using the mongodb validation
  // and serving the errors, asks for required fields but
  // allows creation of user when same values exist -- need refinement
  // let createdUser;
  // try {
  //   const newUser = new User({
  //     email,
  //     fullname,
  //     username: username.toLowerCase(),
  //     password,
  //   });
  //   createdUser = await newUser.save();
  // } catch (error) {
  //   if (error instanceof Error.ValidationError) {
  //     const message = Object.values(error.errors).map((err) => err.message);
  //     throw new ApiError(422, 'Validation Error', message);
  //   }
  // }

  // Creates user data through model
  const newUser = new User({
    email,
    fullname,
    username: username.toLowerCase(),
    password,
  });

  // Saves the new user
  const createdUser = await newUser.save();
  if (!createdUser) {
    throw new ApiError(500, 'Something when wrong while creating user.');
  }

  // Generates access and refresh tokens
  // const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(
  //   createdUser._id as string,
  // );

  // Exclude sensitive information before returning user data
  const sanitizedUser = await User.findById(createdUser._id).select(
    '-password -refreshToken',
  );
  if (!sanitizedUser) {
    throw new ApiError(500, 'Something went wrong while sanitizing user.');
  }

  // Improving user experience: sending both while reggister
  // FE logins the user directly and redirects to home
  // res.cookie('accessToken', accessToken, {
  //   httpOnly: true,
  //   secure: true,
  //   sameSite: 'lax',
  //   expires: new Date(Date.now() + 15 * 60 * 1000), // Expiration in 15 min
  // });

  // res.cookie('refreshToken', refreshToken, {
  //   httpOnly: true,
  //   secure: true,
  //   sameSite: 'lax',
  //   expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // Expiration in 30 days
  // });

  return res
    .status(201)
    .json(new ApiResponse(200, sanitizedUser, 'User sucessfully registered.'));
});

const userLogin = asyncHandler(async (req, res) => {
  const { username, email, password } = req.body;
  console.log({ username, email, password });

  // Checks if either one is available
  if (!(username || email)) {
    throw new ApiError(400, 'Username or Email is required.');
  }

  // Looks for the user in database using either
  const user = await User.findOne({ $or: [{ username }, { email }] }).select(
    '+password',
  );
  if (!user) {
    throw new ApiError(404, 'User does not exist');
  }

  return res.status(200).json(new ApiResponse(201, user, 'succss'));

  // // Checks for the validity of the password
  // const isPasswordValid = await user.validatePassword(password);
  // if (!isPasswordValid) {
  //   throw new ApiError(401, 'Unauthorized - Invalid Password');
  // }

  // // Generates the access and refresh token
  // const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(
  //   user._id as string,
  // );

  // // Looks for the user with the userId
  // const loggedInUser = await User.findById(user._id).select(
  //   '-password -refreshToken',
  // );

  // Set acess token and refresh tokens in the cookies
  // res.cookie('accessToken', accessToken, {
  //   httpOnly: true,
  //   secure: true,
  //   sameSite: 'lax',
  //   expires: new Date(Date.now() + 15 * 60 * 1000), // Expiration in 15 min
  // });

  // res.cookie('refreshToken', refreshToken, {
  //   httpOnly: true,
  //   secure: true,
  //   sameSite: 'lax',
  //   expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // Expiration in 30 days
  // });

  // // Return data
  // return res
  //   .status(200)
  //   .json(
  //     new ApiResponse(
  //       200,
  //       { data: loggedInUser, accessToken, refreshToken },
  //       'User logged in successfully',
  //     ),
  //   );
});

const getUser = asyncHandler(async (req: ExpressRequestInterface, res) => {
  console.log('data', { req });
  return res
    .status(200)
    .send(new ApiResponse(200, req.user, 'User Fetched Successfully'));
});

const logoutUser = asyncHandler(async (req: ExpressRequestInterface, res) => {
  console.log({ req });
  await User.findByIdAndUpdate(
    req.user?._id,
    {
      $unset: {
        refreshToken: 1,
      },
    },
    {
      new: true,
    },
  );

  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .clearCookie('accessToken', options)
    .clearCookie('refreshToken', options)
    .json(new ApiResponse(200, {}, 'User Logged Out'));
});

export { registerUser, userLogin, getUser, logoutUser };
