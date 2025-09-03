import './App.html';
import './Addedit.html';
import { Template } from 'meteor/templating';
import { ReactiveDict } from 'meteor/reactive-dict';
import './Addedit.js';
import { ContactCollection } from '../api/ContactCollection.js';
import './Login.js';
import './Login.html';

export const mainState = new ReactiveDict();

const getUser = () => Meteor.user();
const getUserId = () => Meteor.userId();
const isUserLogged = () => !!getUserId();

Template.main.onCreated(function () {
  mainState.set('isEditEnabled', false);
  mainState.set('selectedContact', null);
  mainState.set('isDetailsEnabled', false);

  this.autorun(() => {
    this.subscribe('contacts');
  });

});

Template.main.helpers({
  isEditEnabled() {
    return mainState.get('isEditEnabled');
  },
  selectedContact() {
    return mainState.get('selectedContact');
  },

  isDetailsEnabled(){
    return mainState.get('isDetailsEnabled');
  },

  isUserLogged() {
    return !!Meteor.userId(); 
  },

});

Template.mainContainer.onCreated(function () {
  this.state = new ReactiveDict();
  this.state.set('searchQuery', '');
});

Template.mainContainer.events({
  'click .conbut'() {
    mainState.set('selectedContact', null);
    mainState.set('isEditEnabled', true);
    mainState.set('isDetailsEnabled', false);
  },

  'click .logout'(){
    Meteor.logout();
  },

  'input .intext'(event, instance) {
    instance.state.set('searchQuery', event.target.value.trim());
  },
});

Template.contactItem.events({
  'click .edit-contact-items'() {
    mainState.set('selectedContact', this);
    mainState.set('isEditEnabled', true);
    mainState.set('isDetailsEnabled', false);
  },
  'click .delete-contact'() {
    Meteor.call('contacts.remove', this._id);
  },

  'click .view-details'(){
    mainState.set('selectedContact', this);
    mainState.set('isEditEnabled', false);
    mainState.set('isDetailsEnabled', true);
  }
});

Template.mainContainer.helpers({
  contacts() {
    const instance = Template.instance();
    const search = instance.state.get('searchQuery');
    if (search) {
      return ContactCollection.find(
        { name: { $regex: search, $options: 'i' } }, 
        { sort: { createdAt: -1 } }
      );
    }
    return ContactCollection.find({}, { sort: { createdAt: -1 } });
  }
});

Template.addedit.events({
    'click .back-button'(event) {
        event.preventDefault();
        mainState.set('isEditEnabled', false);
        mainState.set('isDetailsEnabled', false);
        mainState.set('selectedContact', null);
    }
})

Template.contactDetails.events({
    'click .close-details'(event){
        event.preventDefault();
        mainState.set('isEditEnabled', false);
        mainState.set('isDetailsEnabled', false);
        mainState.set('selectedContact', null);
    }
})


