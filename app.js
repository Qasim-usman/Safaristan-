if (process.env.NODE_ENV !== "production") {
    require('dotenv').config();
}

const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const ejsMate = require("ejs-mate");
const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const MongoStore = require("connect-mongo");
const User = require("./models/user");

// ⬇️ Load environment variables
const dbUrl = process.env.DB_URL || 'mongodb://127.0.0.1:27017/airnbn';
const secret = process.env.SECRET || 'defaultSecret';

// ⬇️ MongoDB connection
mongoose.connect( dbUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log("✅ MongoDB connected");
}).catch(err => {
    console.error("❌ MongoDB error:", err);
});

// ⬇️ MongoStore for sessions
const store = MongoStore.create({
    mongoUrl: dbUrl,
    secret,
    touchAfter: 24 * 3600
});

// ⬇️ Session config
const sessionConfig = {
    store,
    name: 'session',
    secret,
    resave: false,
    saveUninitialized: false,
    cookie: {
        httpOnly: true,
        maxAge: 1000 * 60 * 60 * 24 * 7 // 1 week
    }
};

app.engine('ejs', ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(session(sessionConfig));
app.use(flash());

// ⬇️ Passport config
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// ⬇️ Set locals for templates
app.use((req, res, next) => {
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    res.locals.userCurr = req.user;
    next();
});

// ⬇️ Routes
const listingsRoute = require("./routes/listings");
const reviewsRoute = require("./routes/reviews");
const userRoute = require("./routes/user");

app.get("/", (req, res) => {
    res.send("🌍 Welcome to the Root Route!");
});

app.use("/listings", listingsRoute);
app.use("/listings/:id/reviews", reviewsRoute);
app.use("/", userRoute);

// ⬇️ Error Handler
app.use((err, req, res, next) => {
    const { status = 500, message = "Something went wrong!" } = err;
    res.status(status).render("error", { status, message });
});

// ⬇️ Start server
const port = process.env.PORT || 3000;
app.listen(port, '0.0.0.0', () => {
    console.log(`🚀 Server is running on http://localhost:${port}`);
});
