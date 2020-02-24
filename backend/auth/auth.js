const passport = require(`passport`);
const localStrategy = require(`passport-local`).Strategy;
const userModel = require(`../models/user`);
const jwtStrategy = require(`passport-jwt`).Strategy;
const extractJWT = require(`passport-jwt`).ExtractJwt;