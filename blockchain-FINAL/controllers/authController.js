const { get } = require("mongoose");
const User = require("../models/User");
const jwt = require('jsonwebtoken');

// handle errors
const handleErrors = (err) => {
  console.log(err.message, err.code);
  let errors = { email: '', password: '' };

  // incorrect email
  if (err.message === 'incorrect email') {
    errors.email = 'That email is not registered';
  }

  // incorrect password
  if (err.message === 'incorrect password') {
    errors.password = 'That password is incorrect';
  }

  // duplicate email error
  if (err.code === 11000) {
    errors.email = 'that email is already registered';
    return errors;
  }

  // validation errors
  if (err.message.includes('user validation failed')) {
    // console.log(err);
    Object.values(err.errors).forEach(({ properties }) => {
      // console.log(val);
      // console.log(properties);
      errors[properties.path] = properties.message;
    });
  }

  return errors;
}

// create json web token
const maxAge = 3 * 24 * 60 * 60;
const createToken = (id) => {
  return jwt.sign({ id }, 'net ninja secret', {
    expiresIn: maxAge
  });
};

// controller actions
module.exports.signup_get = (req, res) => {
  res.render('signup');
}
module.exports.users_get = async (req, res) => {
  try {
    const users = await getAllUsers();
    res.render('usoers', { users });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

module.exports.login_get = (req, res) => {
  res.render('login');
}

module.exports.signup_post = async (req, res) => {
  const { email, password,f_name,s_name,bio,image } = req.body;

  try {
    const user = await User.create({ email, password,f_name,s_name,bio,image });
    const token = createToken(user._id);
    res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge * 1000 });
    res.status(201).json({ user: user._id });
  }
  catch(err) {
    const errors = handleErrors(err);
    res.status(400).json({ errors });
  }
 
}

module.exports.login_post = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.login(email, password);
    const token = createToken(user._id);
    res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge * 1000 });
    res.status(200).json({ user: user._id });
  } 
  catch (err) {
    const errors = handleErrors(err);
    res.status(400).json({ errors });
  }

}

module.exports.logout_get = (req, res) => {
  res.cookie('jwt', '', { maxAge: 1 });
  res.redirect('/');
}
module.exports.profile_get = (req, res) => {
  res.render('profile');
}


async function getAllUsers() {
  try {
    const users = await User.find();
    return users;
  } catch (err) {
    throw new Error('Error fetching users: ' + err.message);
  }
}




module.exports.users_get = async (req, res) => {
  try {
    const users = await getAllUsers();
    res.render('users', { users });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function getOneUser(pk) {
  try {
    const user = await User.findOne({ _id: pk });
    return user;
  } catch (err) {
    throw new Error('Error fetching user: ' + err.message);
  }
}

module.exports.user_get = async (req, res) => {
  try {
    const pk = req.params.pk; // Получаем идентификатор пользователя из параметра маршрута
    const oneuser = await getOneUser(pk); // Вызываем функцию для получения одного пользователя
    res.render('user', { oneuser });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}




module.exports.profile_post = async (req, res) => {
  
  try {
    const { f_name, s_name, bio, image ,id} = req.body;
    await User.updateOne({ _id: id}, { f_name, s_name, bio, image }); // Используйте updateOne для обновления одного документа

    res.redirect('profile');
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

