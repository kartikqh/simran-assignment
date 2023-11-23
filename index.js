const express = require('express');
const session = require('express-session');
const path = require('path');
const ejs = require('ejs');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const middleware = require('./middleware');
const adminMiddleware = require('./admin_middleware');
mongoose.connect('mongodb+srv://sammehra:Vanshu12345@cluster0.u41evgd.mongodb.net/assignmentdatabase?retryWrites=true&w=majority', { useNewUrlParser: true })
.then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((err) => {
    console.error('Error connecting to MongoDB:', err);
     });
const userModel = require('./models/UserModel');
const { Console } = require('console');

const app = new express()
app.use(express.static('public'))
app.set('view engine' , 'ejs')
app.use(bodyParser.urlencoded({extended: true}));

app.use(
  session({
    secret: '12345', 
    resave: true,
    saveUninitialized: true,
  })
);

app.listen(3000, () =>{
    console.log('App listening on port 3000')
})

app.get('/', (req, res)=>{
  if(req.session.user){
    return res.render('index',{ user: req.session.user, userType: req.session.user.userType});
  }
    return res.render('index');
})
app.get('/g',middleware.requireDriverAccess, (req, res)=>{
  try {
    
    // Find the user based on the License Number
    const user = req.session.user;
    if (!user) {
      // If user not found, display a message and options to go back or to G2_page
      return res.render('g', { message: 'No User Found',user: req.session.user, userType: req.session.user.userType });
    } else if ( user.licenseNo === "License Number") {
      return res.render ('g2', {message: 'Please Update your information first.',user: req.session.user, userType: req.session.user.userType});
    }
    else if(user.userType=="Driver"){
      // If user found, display user's information and allow editing car information
      return res.render('g', { user: req.session.user, userType: req.session.user.userType});
    }
  } catch (error) {
    return res.render('g', {message: 'Error Fetching user.',user: req.session.user, userType: req.session.user.userType});
  }

})
app.get('/g2',middleware.requireDriverAccess, (req, res)=>{
   return res.render('g2',{user: req.session.user, userType: req.session.user.userType}) 

})
app.get('/login', (req, res)=>{
    return res.render('login');

})

app.get('/logout', (req, res)=>{
  if(req.session.user){
    delete req.session.user;

  }
  res.render('index')

})

app.get('/getUser', async(req, res)=>{
    
    try {
        const licenseNumber = req.query.licenseNumber; 
        // Find the user based on the License Number
        const user = await userModel.findOne({ licenseNo: licenseNumber });
        if (!user) {
          // If user not found, display a message and options to go back or to G2_page
          return res.render('g', { message: 'No User Found' });
        } else {
          // If user found, display user's information and allow editing car information
          return res.render('g', { user });
        }
      } catch (error) {
        return res.render('g', {message: 'Error Fetching user.'});
      }
})

app.post('/createuser', async(req, res) => {
  
  const user = req.session.user;
  try {
    const saltRounds = 6;
    const hashedLicenseNumber = await bcrypt.hash(req.body.licenseNumber, saltRounds);
    // Create a new user object using the User model
    
      user.firstname = req.body.firstName;
      user.lastname = req.body.lastName;
      user.licenseNo = hashedLicenseNumber;
      user.age = req.body.age;
      user.carInfo = {
        make: req.body.make,
        model: req.body.model,
        year: req.body.year,
        platno: req.body.plateNumber};

        await userModel.findOneAndUpdate({ _id: user._id }, user, { new: true });

    return res.render('g', {message: 'User Updated sucessfully.',user: req.session.user, userType: req.session.user.userType} );
  } catch (error) {
    console.log(error);
    res.status(500).send('An error occurred while saving the user.');
  }
  });

  app.post('/updateCarInfo', async (req, res) => {
    const userId = req.body.userId;
    const newData = {
      car_details: {
        make: req.body.make,
        model: req.body.model,
        year: req.body.year,
        platno: req.body.platenumber
      },
    };
  
    try {
      // Find the user by their user ID
      const user = await userModel.findById(userId);
  
      if (!user) {
        res.status(404).send('User not found.');
      } else {
        // Update the car information
        Object.assign(user, newData);
        await user.save();
        return res.render('g', { message: 'Car information updated successfully.',user: req.session.user, userType: req.session.user.userType });
      }
    } catch (error) {
      console.error('Error updating car information:', error);
      res.status(500).send('An error occurred while updating car information.');
    }
  });

  app.post('/signup', async (req, res) => {
    const { username, password, confirmPassword, userType } = req.body;
    try {
      
      if (password !== confirmPassword) {
        return res.render('login', { message: 'Passwords do not match' });
      }
  
      // Check if the username already exists
      const existingUser = await userModel.findOne({ username: username });
  
      if (existingUser) {
        return res.render('login', { message: 'Username already exists' });
      }
  
      // Hash the password
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(password, saltRounds);
  
      // Create a new user
      const newUser = new userModel({
        username: username,
        password: hashedPassword,
        userType: userType,
      });
  
      // Save the new user to the database
      await newUser.save();
  
      return res.render ('login', { message: 'User registration successful'});
    } catch (error) {
      console.log(error);
      return res.render ('login', { message: 'An error occurred while signing up' });
    }
  });

  // Login Request
app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    // Check if the username exists in the database
    const user = await userModel.findOne({ username });
    console.log(user);
    if (!user) {
      return res.render('login', { message: 'User not found' });
    }

    // Check if the password matches
    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res.render('login', { message: 'Invalid password' });
    }

    // Logic for handling first-time or second-time login here
    req.session.user = user;
    return res.render('index', { message: 'Login successful' ,user: req.session.user, userType: req.session.user.userType});
  } catch (error) {
    console.log(error);
    return res.render('login', { message: 'An error occurred while logging in' });
  }
});

app.get('/appointment',middleware.requireDriverAccess, (req, res)=>{
  return res.render('appointment',{user: req.session.user, userType: req.session.user.userType}) 

});