import './App.html';
import './Addedit.html';
import { Template } from 'meteor/templating';
import { ReactiveDict } from 'meteor/reactive-dict';
import './Addedit.js';
import { ContactCollection } from '../api/ContactCollection.js';
import './Login.js';
import './Login.html';
import { ReactiveVar } from 'meteor/reactive-var';

export const mainState = new ReactiveDict();

const getUser = () => Meteor.user();
const getUserId = () => Meteor.userId();
const isUserLogged = () => !!getUserId();

Template.main.onCreated(function () {
  mainState.set('isEditEnabled', false);
  mainState.set('selectedContact', null);
  mainState.set('isDetailsEnabled', false);
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

  this.page = new ReactiveVar(1);
  this.limit = new ReactiveVar(12);

  // this.autorun(() => {
  //   const page = this.page.get();
  //   const limit = this.limit.get();
  //   this.subscribe("contacts",page,limit);
  // })
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

  'click .prev-page'(event, instance) {
    const current = instance.page.get();
    if (current > 1) {
      instance.page.set(current - 1);
    }
  },

  'click .next-page'(event, instance) {
    const current = instance.page.get();
    instance.page.set(current + 1);
  }

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
  page(){
    return Template.instance().page.get();
  },

  contacts() {
    const instance = Template.instance();
    const page = instance.page.get();
    const limit = instance.limit.get();
    const skip = (page-1)*limit;

    const search = instance.state.get('searchQuery');
    if (search) {
      return ContactCollection.find(
        { name: { $regex: search, $options: 'i' } }, 
        { sort: { createdAt: -1 },skip,limit }
      );
    }
    return ContactCollection.find({}, { sort: { createdAt: -1 },skip,limit });
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


