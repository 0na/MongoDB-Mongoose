const mongoose = require('mongoose');
const Schema = mongoose.Schema;

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost/nodeappdatabase', {
    useMongoClient: true
});

//new user Schema
const userSchema = new Schema({
    name: String,
    username: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    admin: Boolean,
    created_at: Date,
    updated_at: Date
});

//Mongoose schema method
userSchema.methods.manify = function (next) {
    this.name = this.name + '-boy';

    return next(null, this.name);
};

//pre-save method
userSchema.pre('save', function (next) {
    //pobranie aktualnego czasu
    const currentDate = new Date();

    //zmiana pola na aktualny czas
    this.updated_at = currentDate;

    if (!this.created_at)
        this.created_at = currentDate;

    next();
});


const kenny = new User({
    name: 'Kenny',
    username: 'Kenny_the_boy',
    password: 'password'
});

kenny.manify(function (err, name) {
    if (err) throw err;
    console.log('Twoje nowe imię to: ' + name);
});


kenny.save(function (err) {
    if (err) throw err;

    console.log('Uzytkownik zapisany pomyslnie');
});


// const mongoose = require('mongoose');
// mongoose.connect('mongodb://localhost/nodeappdatabase', {
//     useMongoClient: true
// });

// const Schema = mongoose.Schema;

// const userSchema = new Schema({
//     name: String,
//     username: {
//         type: String,
//         required: true,
//         unique: true
//     },
//     password: {
//         type: String,
//         required: true
//     },
//     admin: Boolean
// });

// const User = mongoose.model('User', userSchema);

// userSchema.methods.manify = function (next) {
//     this.name = this.name + '-boy';

//     return next(null, this.name);
// };

// userSchema.pre('save', function (next) {
//     //pobranie aktualnego czasu
//     const currentDate = new Date();

//     //zmiana pola na aktualny czas
//     this.updated_at = currentDate;

//     if (!this.created_at) {
//         this.created_at = currentDate;
//     }

//     // next() jest funkcją która przechodzi do następnego hooka do
//     // wykonania przed lub po requeście
//     next();
// });