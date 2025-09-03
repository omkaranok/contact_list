import { Template } from 'meteor/templating';
import { Meteor } from 'meteor/meteor';
import { mainState } from './App.js';

Template.addedit.events({
  'submit .edit'(event, instance) {
    event.preventDefault();

    const form = event.target;
    const contactData = {
      name: form.name.value,
      phone: form.phone.value,
      email: form.email.value,
      company: form.company.value,
      notes: form.notes.value,
    };

    if (this.contact && this.contact._id) {
      Meteor.call('contacts.update', this.contact._id, contactData ,(err) =>{
        if(!err){
          mainState.set('isEditEnabled',false);
          mainState.set('isDetailsEnabled',false);
        }
      });
    } else {
      Meteor.call('contacts.insert', contactData,(err) => {
        if(!err){
          mainState.set('isEditEnabled',false);
          mainState.set('isDetailsEnabled',false);
        }
      });
    }
  },

  'click .delete-contact'(event, instance) {
    if (this.contact && this.contact._id) {
      Meteor.call('contacts.remove', this.contact._id);
    }
  },

});
