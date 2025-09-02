import { Template } from 'meteor/templating';
import { Accounts } from 'meteor/accounts-base';
import './Login.html';

Template.login.events({
  'submit .login-form'(event) {
    event.preventDefault();

    // Get the button that submitted the form
    const buttonClicked = event.originalEvent.submitter;
    
    const username = event.target.username.value;
    const password = event.target.password.value;

    if (buttonClicked && buttonClicked.textContent === "Log In") {
      // Login
      Meteor.loginWithPassword(username, password, (err) => {
        if (err) {
          alert(err.reason);
        } else {
          console.log('Logged in successfully!');
        }
      });
    } else if (buttonClicked && buttonClicked.textContent === "SignUp") {
      // Sign Up
      Accounts.createUser({ username, password }, (err) => {
        if (err) {
          alert(err.reason);
        } else {
          console.log('User signed up successfully!');
        }
      });
    }
  }
});
