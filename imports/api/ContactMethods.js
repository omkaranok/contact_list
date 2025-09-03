import { ContactCollection } from "./ContactCollection.js";
import { Meteor } from "meteor/meteor";
import { check } from "meteor/check";

Meteor.methods({
  async "contacts.insert"({ name, phone, email, company, notes }) {
    check(name, String);
    check(phone, String);
    check(email, String);
    check(company, String);
    check(notes, String);

    return await ContactCollection.insertAsync({
      name,
      phone,
      email,
      company,
      notes,
      createdAt: new Date(),
    });
  },

  async "contacts.update"(contactId, { name, phone, email, company, notes }) {
    check(contactId, String);

    return await ContactCollection.updateAsync(contactId, {
      $set: {
        name,
        phone,
        email,
        company,
        notes,
        updatedAt: new Date(),
      },
    });
  },

  async "contacts.remove"(contactId) {
    check(contactId, String);
    return await ContactCollection.removeAsync(contactId);
  },
});
