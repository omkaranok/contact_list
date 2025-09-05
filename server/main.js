import { Meteor } from 'meteor/meteor';
import { ContactCollection } from '../imports/api/ContactCollection';
import '/imports/api/ContactMethods.js';

// Meteor.publish('contacts', function (page,limit) {
//   const skip = (page - 1)* limit;
//   return ContactCollection.find({},{
//     sort:{createdAt:-1},
//     skip,
//     limit
//   });
// });

Meteor.startup(async () => {
  const count = await ContactCollection.find().countAsync();
  if (count === 0) {
    await ContactCollection.insertAsync({
      name: "Test User",
      phone: "1234567890",
      email: "test@example.com",
      company: "Test Inc",
      notes: "First contact",
      createdAt: new Date()
    });
    console.log("Inserted first contact ✅");
  } else {
    console.log(`Already have ${count} contacts`);
  }
});
