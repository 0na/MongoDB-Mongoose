const mongoose = require('mongoose');
const Schema = mongoose.Schema;

mongoose.Promise = global.Promise;
mongoose.connect('mongodb+srv://0na:<password>@cluster0-utgjd.mongodb.net/test?retryWrites=true', {
    useMongoClient: true
});


//schemat tworzący użytkowników
const userSchema = new Schema({ //przechowuje bazowy model
    name: String, //należy przekazać String itd.
    username: {
        type: String,
        required: true,
        unique: true
    }, //unique - musi istnieć jedyne w bazie
    password: {
        type: String,
        required: true
    }, //required: true - jest wymagany
    admin: Boolean,
    created_at: Date,
    updated_at: Date
});

//metoda - modyfikuje nam imię użytkownika 
userSchema.methods.manify = function (next) {
    this.name = this.name + '-boy';

    return next(null, this.name);
};

//pre-save method, funkcja, która wykona się przed 
//zapisaniem rekordu i ustawi odpowiednie pola
userSchema.pre('save', function (next) {
    //pobranie aktualnego czasu:
    const currentDate = new Date();
    //zmiana pola na aktualny czas:
    this.updated_at = currentDate;

    if (!this.created_at) {
        this.created_at = currentDate;
    }

    // next() jest funkcją która przechodzi do następnego hooka do
    // wykonania przed lub po requeście
    next();
});

//model tworzony na podstawie userSchema
const User = mongoose.model('User', userSchema);

//instancje klasy User
const kenny = new User({
    name: 'Kenny',
    username: 'Kenny_the_boy',
    password: 'password'
});

kenny.manify(function (err, name) {
    if (err) throw err;
    console.log('Twoje nowe imię to: ' + name);
});

const benny = new User({
    name: 'Benny',
    username: 'Benny_the_boy',
    password: 'password'
});

benny.manify(function (err, name) {
    if (err) throw err;
    console.log('Twoje nowe imię to: ' + name);
});

const mark = new User({
    name: 'Mark',
    username: 'Mark_the_boy',
    password: 'password'
});

mark.manify(function (err, name) {
    if (err) throw err;
    console.log('Twoje nowe imię to: ' + name);
});

const findAllUsers = function () {
    // find all users
    return User.find({}, function (err, res) {
        if (err) throw err;
        console.log('Actual database records are ' + res);
    });
}

const findSpecificRecord = function () {
    // find specific record
    return User.find({
        username: 'Kenny_the_boy'
    }, function (err, res) {
        if (err) throw err;
        console.log('Record you are looking for is ' + res);
    })
}

const updadeUserPassword = function () {
    // update user password
    return User.findOne({
            username: 'Kenny_the_boy'
        })
        .then(function (user) {
            console.log('Old password is ' + user.password);
            console.log('Name ' + user.name);
            user.password = 'newPassword';
            console.log('New password is ' + user.password);
            return user.save(function (err) {
                if (err) throw err;

                console.log('Uzytkownik ' + user.name + ' zostal pomyslnie zaktualizowany');
            })
        })
}

const updateUsername = function () {
    // update username
    return User.findOneAndUpdate({
        username: 'Benny_the_boy'
    }, {
        username: 'Benny_the_man'
    }, {
        new: true
    }, function (err, user) {
        if (err) throw err;

        console.log('Nazwa uzytkownika po aktualizacji to ' + user.username);
    })
}

const findMarkAndDelete = function () {
    // find specific user and delete
    return User.findOne({
            username: 'Mark_the_boy'
        })
        .then(function (user) {
            return user.remove(function () {
                console.log('User successfully deleted');
            });
        })
}

const findKennyAndDelete = function () {
    // find specific user and delete
    return User.findOne({
            username: 'Kenny_the_boy'
        })
        .then(function (user) {
            return user.remove(function () {
                console.log('User successfully deleted');
            });
        });
}

const findBennyAndRemove = function () {
    // find specific user and delete
    return User.findOneAndRemove({
            username: 'Benny_the_man'
        })
        .then(function (user) {
            return user.remove(function () {
                console.log('User successfully deleted');
            });
        });
}

Promise.all([kenny.save(), mark.save(), benny.save()])
    .then(findAllUsers)
    .then(findSpecificRecord)
    .then(updadeUserPassword)
    .then(updateUsername)
    .then(findMarkAndDelete)
    .then(findKennyAndDelete)
    .then(findBennyAndRemove)
    .catch(console.log.bind(console))