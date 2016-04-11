var assert = require("assert");
var mongoose = require("mongoose");
var moment = require("moment");
var User = require("../models/User");
var Note = require("../models/Note");
mongoose.connect('mongodb://localhost/test');
User.clearUsers();

//global user vars
User.createUser("jack florey", "krotus", function() {});
User.createUser("james p. tetazoo", "hackitoergosum", function(){});
User.createUser("j arthur random", "foobar", function(){});

/***********************************************************************\
|                            USER MODEL TESTS:                          |
\***********************************************************************/
describe("User", function() {

    describe("#findByUsername", function () {

        it("1. retrieve existing user", function (done) {
            User.findByUsername("jack florey", function(err, result) {
                assert.deepEqual(err, null);
                assert.deepEqual(result.username, "jack florey");
                done();
            });
        });

        it("2. agnostic to capitalization", function (done) {
            User.findByUsername("Jack Florey", function(err, result) {
                assert.deepEqual(err, null);
                assert.deepEqual(result.username, "jack florey");
                done();
            });
        });

        it("3. nonexistent user, return error", function (done) {
            User.findByUsername("stickmen", function(err, result) {
                assert.notDeepEqual(err, null);
                done();
            });
        });

    });

    describe("#followUser", function () {
        
        it("1. nonexistent user followed, return error", function (done) {
            User.followUser("james p. tetazoo", "41west", function(err, result) {
                assert.notDeepEqual(err, null);
                done();
            });
        });

        it("2. nonexistent user follower, return error", function (done) {
            User.followUser("41west", "jack florey", function(err, result) {
                assert.notDeepEqual(err, null);
                done();
            });
        });

        it("3. follow self not possible, return error", function (done) {
            User.followUser("jack florey", "jack florey", function(err, result) {
                assert.notDeepEqual(err, null);
                done();
            });
        });

        it("4. successful follow, yay!", function (done) {
            User.followUser("jack florey", "james p. tetazoo", function(err, result) {
                assert.deepEqual(err, null);
                done();
            });
        });

        it("5. already following, return error", function (done) {
            User.followUser("james p. tetazoo", "jack florey", function(err, result) {
                User.followUser("james p. tetazoo", "jack florey", function(innerErr, inneResult) {
                    assert.notDeepEqual(innerErr, null);
                    done();
                });
            });
        });

    });

    describe("#getFollows", function () {

        it("1. nonexistent user, return error", function (done) {
            User.getFollows("fail", function(err, result) {
                assert.notDeepEqual(err, null);
                done();
            });
        });

        it("2. successful getFollows", function (done) {
            User.followUser("j arthur random", "james p. tetazoo", function(outerOuterErr,outerOuterResult) {
                User.followUser("j arthur random", "jack florey", function(outerErr, outerResult) {
                    User.getFollows("j arthur random", function(err, result) {
                        assert.deepEqual(err, null);
                        assert.deepEqual(result.length, 2);
                        assert.ok(result.indexOf("jack florey") > -1); //something something modern browers only have includes
                        assert.ok(result.indexOf("james p. tetazoo") > -1);
                        done();
                    });
                })
            })
        });

    });

    describe("#authUser", function () {

        it("1. nonexistent user, return error", function (done) {
            User.authUser("hello", "hoo", function(err, result) {
                assert.notDeepEqual(err, null);
                done();
            });
        });

        it("2. wrong password, return error", function (done) {
            User.authUser("jack florey", "hackitoergosum", function(err, result) {
                assert.notDeepEqual(err, null);
                done();
            });
        });

        it("3. successful login, same capitalization", function (done) {
            User.authUser("jack florey", "krotus", function(err, result) {
                assert.deepEqual(err, null);
                done();
            });
        });

        it("4. successful login, different capitalization", function (done) {
            User.authUser("Jack Florey", "krotus", function(err, result) {
                assert.deepEqual(err, null);
                done();
            });
        });

    });

    describe("#createUser", function () {

        it("1. Existing user, return error", function (done) {
            User.createUser("jack florey", "hackitoergosum", function(err, result) {
                assert.notDeepEqual(err, null);
                done();
            });
        });

        it("2. Username too short, return error", function (done) {
            User.createUser("ec", "fredthedorm", function(err, result) {
                assert.notDeepEqual(err, null);
                done();
            });
        });

        it("3. Username too long, return error", function (done) {
            User.createUser("eastcampusalumnihouseingestatthedawnoftimeitself", "longlivefred", function(err, result) {
                assert.notDeepEqual(err, null);
                done();
            });
        });

        it("4. Invalid username characters, return error", function (done) {
            User.createUser("i<3u", "notreally", function(err, result) {
                assert.notDeepEqual(err, null);
                done();
            });
        });

        it("5. Successful User Created, lowercase username", function (done) {
            User.createUser("acleankitchen", "onecandream", function(err, result) {
                assert.deepEqual(err, null);
                assert.deepEqual(result, {username: "eek"});
                done();
            });
        });

        it("6. Successful User Created, uppercase username", function (done) {
            User.createUser("Beast", "shallrise", function(err, result) {
                assert.deepEqual(err, null);
                assert.deepEqual(result, {username: "blah"});
                done();
            });
        });
    });

});

/***********************************************************************\
|                            NOTE MODEL TESTS:                          |
\***********************************************************************/
describe("Note", function() {

    describe("#addNote", function () {

        it("1. Nonexistent user, return error", function (done) {
            Note.addNote("putz", "Important Putz Poll", moment(), function(err, result) {
                assert.notDeepEqual(err, null);
                Note.clearNotes();
                done();
            });
        });

        it("2. Successful addNote", function (done) {
            Note.addNote("Jack Florey", "Hey everbody!", moment(), function(err, result) {
                assert.deepEqual(err, null);
                assert.notDeepEqual(result._id, undefined);
                Note.clearNotes();
                done();
            });
        });

    });

    describe("#refreet", function () {

        it("1. nonexistent tweet, return error", function (done) {
            Note.refreet("putz", "642e642e642e", moment(), function(err, result) {
                assert.notDeepEqual(err, null);
                Note.clearNotes();
                done();
            });
        });

        it("2. can't refreet yourself, return error", function (done) {
            Note.addNote("jack florey", "Hey everbody!", moment(), function(err, result) {
                var id = result._id;
                Note.refreet("jack florey", id, moment(), function(innerErr, innerResult) {
                    assert.notDeepEqual(innerErr, null);
                    Note.clearNotes();
                    done();
                });
            });
        });

        it("3. successful refreet, yay!", function (done) {
            Note.addNote("jack florey", "Hey everbody! My name is Jack Florey.", moment(), function(err, result) {
                var id = result._id;
                Note.refreet("james p. tetazoo", id, moment(), function(innerErr, innerResult) {
                    Note.getNotes("jack florey", function(innerInnerInnerErr, innerInnerResult) {
                        assert.deepEqual(innerErr, null); //no err on refreet
                        assert.deepEqual(innerInnerResult.length, 2); //and it worked...
                        Note.clearNotes(); //clear your things
                        done();
                    });
                });
            });
        });

    });

    describe("#getNoteById", function () {

        it("1. Nonexistent note, fake Id, return error", function (done) {
            Note.getNoteById("totallyNot21", function(err, result) {
                assert.notDeepEqual(err, null);
                done();
            });
        });

        it("2. Successful getNoteById", function (done) {
            Note.addNote("jack florey", "Hey, everbody!", moment(), function(err, result) {
                Note.getNoteById(result.id, function(innerErr, innerResult) {
                    assert.deepEqual(innerErr, null);
                    assert.deepEqual(innerResult.text, "Hey, everbody!")
                    Note.clearNotes();
                    done();
                });
            });
        });
    });


    describe("#getNotesByAuthor", function () {

        it("1. Get Notes For One Existing User", function (done) {
            Note.addNote("james p. tetazoo", "My name is Jack Florey.", moment(), function() {
                Note.addNote("james p. tetazoo", "His name is Jack Florey.", moment(), function() {
                    Note.getNotesByAuthor("james p. tetazoo", function(err, result) {
                        assert.deepEqual(err, null);
                        assert.deepEqual(result.length,2);
                        assert.deepEqual(result[0].author,"james p. tetazoo");
                        assert.deepEqual(result[0].text,"My name is Jack Florey.");
                        assert.deepEqual(result[1].author,"james p. tetazoo");
                        assert.deepEqual(result[1].text,"His name is Jack Florey.");
                        Note.clearNotes();
                        done();
                    });
                });
            });
        });

        it("2. Get Notes from Multiple Existing Users", function (done) {
            Note.addNote("james p. tetazoo", "My name is Jack Florey.", moment(), function() {
                Note.addNote("j arthur random", "His name is Jack Florey.", moment(), function() {
                    Note.addNote("j arthur random", "Her name is also Jack Florey.", moment(), function() {
                        Note.addNote("j arthur random", "Tonight all our names are Jack Florey.", moment(), function() {
                            Note.addNote("jack florey", "has identity crisis", moment(), function() {
                                Note.getNotesByAuthor("j arthur random", ["james p. tetazoo","j arthur random"], function(err, result) {
                                    assert.deepEqual(err, null);
                                    assert.deepEqual(result.length,4);
                                    assert.deepEqual(result[0].author,"james p. tetazoo");
                                    assert.deepEqual(result[0].text,"My name is Jack Florey.");
                                    assert.deepEqual(result[1].author,"j arthur random");
                                    assert.deepEqual(result[1].text,"His name is Jack Florey.");
                                    assert.deepEqual(result[2].author,"j arthur random");
                                    assert.deepEqual(result[2].text,"Her name is also Jack Florey.");
                                    assert.deepEqual(result[3].author,"j arthur random");
                                    assert.deepEqual(result[3].text,"Tonight all our names are Jack Florey.");
                                    Note.clearNotes();
                                    done();
                                });
                            });
                        });
                    });
                });
            });
        });
    });

    describe("#getNotes", function () {

        it("1. Successful return of all notes", function (done) {
            Note.addNote("james p. tetazoo", "My name is Jack Florey.", moment(), function() {
                Note.addNote("j arthur random", "His name is Jack Florey.", moment(), function() {
                    Note.getNotes("james p. tetazoo", function(err, result) {
                        assert.deepEqual(err, null);
                        assert.deepEqual(result.length,2);
                        assert.deepEqual(result[0].author,"james p. tetazoo");
                        assert.deepEqual(result[0].text,"My name is Jack Florey.");
                        assert.deepEqual(result[1].author,"j arthur random");
                        assert.deepEqual(result[1].text,"His name is Jack Florey.");
                        Note.clearNotes();
                        done();
                    });
                });
            });
        });
    });


    describe("#deleteNoteById", function () {

        it("1. Successful deleteNoteById", function (done) {
            var id; //scope yo
            Note.addNote("jack florey", "I thought I was the real Jack Florey", moment(), function(err, result) {
                id = result.id;
                Note.getNotes("jack florey", function(innerErr, innerResult) {    
                    Note.deleteNoteById("Jack Florey", id, function(innerInnerErr, innerInnerResult) {
                        Note.getNotes("jack florey", function(err, innerInnerInnerResult) {
                            assert.deepEqual(innerResult.length,1); //there used to be a note there
                            assert.deepEqual(innerInnerErr, null);
                            assert.deepEqual(innerInnerInnerResult.length,0); // but there isn't anymmore!
                            Note.clearNotes();
                            done(); //woo!
                        });
                    });
                });
            });
        });

        it("2. Unauthorized User, return error", function (done) {
            var id;
            Note.addNote("james p. tetazoo", "You're just a figment of our collective imagination", moment(), function(err, result) {
                id = result.id;
                Note.deleteNoteById("j arthur random", id, function(err, result) {
                    assert.notDeepEqual(err, null);
                    Note.clearNotes();
                    done();
                });
            });
        });

        it("3. Fake Id, return error", function (done) {
            Note.addNote("jack florey", "I'm going to light my room on fire, that can't go wrong.", moment(), function(){});
            Note.deleteNoteById("jack florey", "stillNotOver21", function(err, result) {
                assert.notDeepEqual(err, null);
                done();
            });
            Note.clearNotes();
        });
    });

});