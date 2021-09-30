const { assert } = require('chai');

const { userLookUp } = require('../helpers.js');

const testUsers = {
  "userRandomID": {
    id: "userRandomID", 
    email: "user@example.com", 
    password: "purple-monkey-dinosaur"
  },
  "user2RandomID": {
    id: "user2RandomID", 
    email: "user2@example.com", 
    password: "dishwasher-funk"
  }
};

describe('userLookUp', function() {
  it('should return a user with valid email', function(done) {
    const user = userLookUp(testUsers, "user@example.com")
    const expectedOutput = "userRandomID";
    // Write your assert statement here
    assert.equal(user, expectedOutput)
    // assert.equal(expectedDesc, desc.trim());
    done()
  });

  it('should return undefined if there is no such email', function(done) {
    const user = userLookUp(testUsers, "abc@def.ghi")
    assert.equal(user, undefined)
    done()
  });
});


// describe('fetchBreedDescription', () => {
//   it('returns a string description for a valid breed, via callback', (done) => {
//     fetchBreedDescription('Siberian', (err, desc) => {
//       // we expect no error for this scenario
//       assert.equal(err, null);

//       const expectedDesc = "The Siberians dog like temperament and affection makes the ideal lap cat and will live quite happily indoors. Very agile and powerful, the Siberian cat can easily leap and reach high places, including the tops of refrigerators and even doors.";

//       // compare returned description
//       assert.equal(expectedDesc, desc.trim());

//       done();
//     });
//   });
//   //I messed up somewhere along the way here but it does validate an error if there is one
//   it('returns an error for an invalid breed, via callback', (done) => {
//     fetchBreedDescription('jsdfhdfsjkh', (err, des) => {
//       assert.equal(err, '404: cat not found')
//       done()
//     })
//   });
// });
