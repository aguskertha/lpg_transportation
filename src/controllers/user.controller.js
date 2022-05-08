const User = require('./../models/user.model');
const bcrypt = require('bcryptjs');
const passport = require('passport');

const register = async (req, res, next) => {
    try {
        const {name, email, password, password2} = req.body;
        let errors = [];
        if(!name || !email || !password || !password2){
            errors.push({message: 'Please fill in all fields!'});
        }
        
        if(password !== password2){
            errors.push({message: 'Password not matched!'});
        }
        
        if(password.length < 6){
            errors.push({message: 'Password should be at least 6 characters!'});
        }

        if(errors.length > 0 ){
            res.render('User/register', {
                layout: 'layouts/main-layout-no-nav',
                errors,
                name,
                email,
                password,
                password2
            });
        }
        else{
            const user = await User.findOne({email: email});
            if(user){
                errors.push({message: 'User already exist!'});
                res.render('User/register', {
                    layout: 'layouts/main-layout-no-nav',
                    errors,
                    name,
                    email,
                    password,
                    password2
                });
            }
            else{
                const newUser = new User({name, email, password});
                bcrypt.hash(password, 10, async (err, hashedPassword) => {
                    if(err){
                        errors.push({message: err});
                        res.render('User/register', {
                            layout: 'layouts/main-layout-no-nav',
                            errors,
                            name,
                            email,
                            password,
                            password2
                        });
                    }
                    else{
                        newUser.password = hashedPassword;
                        await newUser.save();
                        req.flash('success_msg', 'You are now registered and can login!');
                        res.redirect('/user/login');
                    }
                })
            }
        }

    } catch (error) {
        res.render('error', {
            layout: 'layouts/main-layout-no-nav',
            message: error,
            status: 400
        });
    }
}

const registerPage = async (req, res, next) => {
    try {
        res.render('User/register', {
            layout: 'layouts/main-layout-no-nav',
        })
    } catch (error) {
        res.render('error', {
            layout: 'layouts/main-layout-no-nav',
            message: error,
            status: 400
        });
    }
}

const login = async (req, res, next) => {
    try {
        passport.authenticate('local', {
            successRedirect: '/topic',
            failureRedirect: '/user/login',
            failureFlash: true
        })(req, res, next);
    } catch (error) {
        res.render('error', {
            layout: 'layouts/main-layout-no-nav',
            message: error,
            status: 400
        });
    }
}

const logout = async (req, res, next) => {
    try {
        req.logout();
        req.flash('success_msg', 'You are logged out!');
        res.redirect('/user/login');
    } catch (error) {
        res.render('error', {
            layout: 'layouts/main-layout-no-nav',
            message: error,
            status: 400
        });
    }
}

const loginPage = async (req, res, next) => {
    try {
        res.render('User/login', {
            layout: 'layouts/main-layout-no-nav',
        })
    } catch (error) {
        res.render('error', {
            layout: 'layouts/main-layout-no-nav',
            message: error,
            status: 400
        });
    }
}

module.exports = {
    loginPage,
    registerPage,
    register,
    login,
    logout
}