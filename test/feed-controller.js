const expect = require('chai').expect;
// const sinon = require('sinon');
const mongoose = require('mongoose');

const User = require('../models/user');
const feedController = require('../controllers/feed');

describe('Feed Controller', function(){
    before(function(done){ //'before' is a lifecycle hook given by 'Mocha'
        // gets call only once before all the 'it' statements
        //there are many other methods like 'beforeEach','after','afterEach'
        //'beforeEach' gets call before every 'it' statements
        //'after' gets call after all 'it' statements
        //'afterEach' gets call after every 'it' statements
        mongoose
        .connect(
            'mongodb://MongoDB_User:MongoDBUser%40210791@node-complete-shard-00-00.0vl9o.mongodb.net:27017,node-complete-shard-00-01.0vl9o.mongodb.net:27017,node-complete-shard-00-02.0vl9o.mongodb.net:27017/test-messages?ssl=true&replicaSet=atlas-13wbgl-shard-0&authSource=admin&retryWrites=true&w=majority'
        )
        .then(result => {
            const user = new User({
                email: 'testuser@test.com',
                password: 'TestPassword',
                name: 'TestUser',
                posts: [],
                _id: '6179262f69fee595ddae3074'
            });

            return user.save();
        })
        .then(() => {
            done();
        })
        .catch(done)
    })

    it('should create a post and add it to user details', function(done){
        // 'argument 'done' above tells mocha to wait 'done' to get execute manually from code before
        // passing/failing the test case

        const req = {
            body: {
                title: 'The Sample Title',
                content: 'Sample content of test post'
            },
            file: {
                path: 'abc'
            },
            userId: '6179262f69fee595ddae3074'
        };
        const res = {
            status: function(){
                return this;
            },
            json : function() {}
        };

        feedController.createPost(req, res, () => {}).then(savedUser => {
            expect(savedUser).to.have.property('posts');
            expect(savedUser.posts).to.have.length(1);
            done();
        }).catch(done);
    });

    after(function(done){ //lifecycle hook by 'Mocha'
        User.deleteMany({})
            .then(() => {
                return mongoose.disconnect();
            })
            .then(() => {
                done();
            })
            .catch(done)
    })
})