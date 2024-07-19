const mongoose = require("mongoose");

const usersSchema = mongoose.Schema({
    name: {
        type: String,
        maxlength: [30, "Name length exceeds 30 characters"],
        required: [true, "Name is required"]
    },
    email: {
        type: String,
        unique: [true, "Email has been registered"],
        required: [true, "Email is required"]
    },
    pwd: {
        type: String,
        minlength: [6, "Password must be at least 6 characters"],
        required: [true, "Password is required"]
    }
}, {timestamps: true});

usersSchema.statics.checkEmail = async function(email) {
    const emailExisted = await this.findOne({email});
    return emailExisted;
}

usersSchema.statics.registerUser = async function(name, email, pwd) {
    const newUser = await this.create({name, email, pwd});
    return newUser;
}

usersSchema.statics.findUser = async function(id) {
    try {
        const info = await this.findById(id).select("name email");
        return info;
    } catch (err) {
        return null;
    }
}

const Users = new mongoose.model("Users", usersSchema);

module.exports = Users;