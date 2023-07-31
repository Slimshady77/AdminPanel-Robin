const express = require('express');
const app = express();
var http = require('http').Server(app);
const dotenv = require('dotenv');
const multer = require('multer');
const axios = require('axios');
const fs = require('fs');


const { v4: uuidV4 } = require('uuid');
const passport = require('passport');
const BodyParser = require('body-parser');
const expressSession = require('express-session');
// const fileStore = require("session-file-store")(expressSession)
// const cookieParser = require('cookie-parser');
app.use(BodyParser.urlencoded({ extended: false }));
app.use(express.json());
app.use(express.static(__dirname + '/public'));

const path = require('path');
dotenv.config({ path: './config.env' });
// const userModel1 = require('./model/library.js');


const { model } = require('mongoose');
const library = require('./model/library');
const course = require('./model/course');
const userModel = require('./model/model');
const chapter = require('./model/chapter')


const PORT = process.env.PORT;
const secret = process.env.SECRET;
app.use(expressSession({ secret: secret, resave: false, saveUninitialized: false, cookie: { secure: false, maxAge: 60000 } }));
// user Passport middleware
app.use(passport.initialize());
app.use(passport.session());


// call Local strategy 
const { initializingPassport } = require('./passportConfig');
initializingPassport(passport);

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));


const io = require('socket.io')(http, {
    cors: {
        origin: '*',
    }
});






//  middleware function to check for logged-in users

// app.use(cookieParser());
// app.use(
//     expressSession({
//         key: "user_id",
//         secret: secret,
//         resave: false,
//         saveUninitialized: true,
//         store: new fileStore(),
//         cookies: {
//             secure: false,
//             expires: 60000,
//         }
//     })
// );

function isAuthenticated(req, res, done) {
    if (req.user) {
        return done()
    }
    res.send('not allowed!')
    return false;

}

// app.use((req,res,next)=>{
//     if(req.cookies.user_id && !req.expressSession.user )
//     {
//         res.clearCookie('user_id');
//     }
//     next();
// })

// var sessionChecker = (req, res, next) => {
//     if (req.expressSession.user && req.cookies.user_id) {
//         res.redirect("/index");
//     }
//     else {
//         next();
//     }
// }

// Routes




app.get('/index', (req, res) => {
    res.render('index');
})


app.get('/index-crypto-currency', (req, res) => {
    res.render('index-crypto-currency');
})
app.get('/auth-lockscreen', (req, res) => {
    res.render('auth-lockscreen');
})
app.get('/auth-login', (req, res) => {
    res.render('auth-login');
})
app.get('/auth-register', (req, res) => {
    res.render('auth-register');
})
app.get('/calendar-full', (req, res) => {
    res.render('calendar-full');
})
app.get('/calendar-list', (req, res) => {
    res.render('calendar-list');
})
app.get('/layout-mini', (req, res) => {
    res.render('layout-mini');
})
app.get('/page-404', (req, res) => {
    res.render('page-404');
})
app.get('/page-500', (req, res) => {
    res.render('page-500');
})

app.get('/page-clients', (req, res) => {
    res.render('page-clients');
})
app.get('/page-coming-soon', (req, res) => {
    res.render('page-coming-soon');
})
app.get('/page-contacts', (req, res) => {
    res.render('page-contacts');
})
app.get('/page-employees', (req, res) => {
    res.render('page-employees');
})
app.get('/page-faq', (req, res) => {
    res.render('page-faq');
})
app.get('/page-file-manager', (req, res) => {
    res.render('page-file-manager');
})
app.get('/page-gallery', (req, res) => {
    res.render('page-gallery');
})
app.get('/page-pricing', (req, res) => {
    res.render('page-pricing');
})
app.get('/page-task-list', (req, res) => {
    res.render('page-task-list');
})
app.get('/chart-apex', (req, res) => {
    res.render('chart-apex');
})
app.get('/chart-c3', (req, res) => {
    res.render('chart-c3');
})
app.get('/chart-chartist', (req, res) => {
    res.render('chart-chartist');
})
app.get('/chart-chartjs', (req, res) => {
    res.render('chart-chartjs');
})
app.get('/chart-flot', (req, res) => {
    res.render('chart-flot');
})
app.get('/chart-knob', (req, res) => {
    res.render('chart-knob');
})
app.get('/chart-morris', (req, res) => {
    res.render('chart-morris');
})
app.get('/chart-sparkline', (req, res) => {
    res.render('chart-sparkline');
})
app.get('/app-chat', (req, res) => {
    res.render('app-chat');
})
app.get('/course-upload', (req, res) => {
    res.render('course-upload');
})
app.get('/login', (req, res) => {
    res.render('login');
})
app.get('/subscribers', (req, res) => {
    userModel.find().then(data => {
        res.render('subscribers', { data: data });
    })
})
app.get('/final', (req, res) => {
    userModel.find().then(data => {
        res.render('final', { data: data });
    })
})
app.get('/final-exam-upload', (req, res) => {
    res.render('final-exam-upload');
})

app.get('/assistant', (req, res) => {
    res.render('assistant');
})
app.get('/support', (req, res) => {
    res.render('support');
})
app.get('/calculator', (req, res) => {
    res.render('calculator');
})
app.get('/chapter-assignment', (req, res) => {
    res.render('chapter-assignment');
})


app.get('/course-chapter', (req, res) => {
    chapter.find().then((data) => {
        res.render('course-chapter', { data: data });
    })
})
app.get('/course-chapter-upload', (req, res) => {
    chapter.find().then((data) => {
        res.render('course-chapter-upload', { data: data });

    })

})


// app.get('/', (req, res)=>{
//     res.redirect(`/${uuidV4()}`);
// })
// app.get('/:room', (req, res)=>{
//     res.render('room', {roomId: req.params.room});
// })






// register

app.post('/auth-register', async (req, res) => {
    const { fname, lname, email, username, password } = req.body;
    const user = await userModel.findOne({ email: email })
    if (user) {
        return res.status(400).send("user already exists!");
    }

    const register = new userModel({
        fname,
        lname,
        email,
        username,
        password
    });




    register.save()
        .then(() => {
            res.status(200).json({ message: "Registration successfull" });

        })
        .catch((err) => {
            res.status(400).json({ err: 'internal err' });
            console.log(err)
        })
})

app.get('/page-account-settings', isAuthenticated, (req, res) => {
    // res.send();
    userModel.findById(req.user._id).then(data => {
        res.render('page-account-settings', { data: data });
        // console.log(data);
    }).catch((err) => console.log(err));
})





// Logout
app.get('/logout', function (req, res, next) {
    req.logout(function (err) {
        if (err) { return next(err); }
        res.redirect('/login');
    });
});



// login

app.post('/login', passport.authenticate("local", { successRedirect: '/index' }), (req, res) => {
    // app.post('/login', (req,res)=>{ 

    // const { email, password } = req.body;

    // if (!email || !password) {
    //     res.status(400).json({ Error: "invalid credintials" });
    // }

    // const user = userModel.findOne({ email: email }).exec();
    // if (!user) {
    //     return res.status(400).json({ error: "Email does not exist!" });

    // }
    // req.session.user=user;
    // res.redirect('/index');
    res.json(req.user);
})





// Chat server

// Node server will handle socet.io connection

const users = {};
io.on('connection', socket => {
    socket.on('new-user-joined', name => {
        console.log('New User:', name)
        users[socket.id] = name;
        socket.broadcast.emit('user-joined', name);
    });

    socket.on('send', message => {
        socket.broadcast.emit('receive', { message: message, name: users[socket.id] })
    });
    socket.on('disconnect', message => {
        socket.broadcast.emit('left', users[socket.id])
        delete users[socket.id];
    });
})





// End of Chat Server
// start of video Server


io.on('connection', socket => {
    socket.on('join-room', (roomId, userID) => {
        // console.log(roomId, userID)
        socket.join(roomId)
        socket.to(roomId).emit('user-conected', userID)

        socket.on('disconnected', () => {
            socket / to(roomId).emit('user-dosconnect')
        })
    })
})
// End of video Server


// GET API for  course/Program starts
app.get('/course-page', function (req, res) {

    course.find().then((data) => {
        res.render('course-page', { data: data });
        console.log(data);
    })
        .catch((error) => {
            console.log(error);
        })

})




// GET API for  program/course ENDS





// Profile update
const filter1 = (req, file, cb) => {
    const allowedFileTypes = ['image/jpeg', 'image/png', 'image/svg'];
    if (allowedFileTypes.includes(file.mimetype)) {
        cb(null, true)
    } else {
        cb(null, false)
    }
}

const storage3 = multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, './public/profile')
    },
    filename: function (req, file, callback) {
        callback(null, file.originalname)
    }
});

const upload3 = multer({ storage: storage3, fileFilter: filter1 })
app.post('/update/v1/:id', upload3.single('Photo'), async (req, res) => {
    const { id } = req.params;
    // const { password } = req.body;

    try {
        // Hash the new password
        // const hashedPassword = bcrypt.hashSync(password, 10);



        // Construct the update object
        const updatedUser = {
            // pass: hashedPassword,
            fname: req.body.fname,
            username: req.body.username,
            email: req.body.email,
            Photo: req.file.filename

        };

        // Find the user by ID and update the fields
        await userModel.findByIdAndUpdate(id, { $set: updatedUser });

        res.status(200).json({ message: 'Successfully updated!', success: true });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Server error' });
    }
});
// Profile update ends





// Course Starts

const FileFilter1 = (req, file, cb) => {
    const allowedFileTypes = ['application/pdf', 'image/jpg', 'image/jpeg', 'image/png', 'video/mp4'];
    if (allowedFileTypes.includes(file.mimetype)) {
        cb(null, true)
    } else {
        cb(null, false)
    }
}

const storage1 = multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, './public/course-list')
    },
    filename: function (req, file, callback) {
        callback(null, file.originalname);
    }
});

const upload1 = multer({ storage: storage1, fileFilter: FileFilter1 });


app.post('/course', upload1.fields([{ name: 'photo', maxCount: 1 }]), (req, res) => {
    const { file_name, price, duration } = req.body;


    // Access the uploaded files from the request object
    const files = req.files;

    // Check if the files are uploaded and available in the files object
    if (!files || !files.photo) {
        res.status(400).json({ error: 'Both video and photo are required.' });
        return;
    }

    // Access the file paths for further processing
    const photoPath = path.basename(files.photo[0].path);

    // Assuming you have a Mongoose model called `li    brary` for saving the file paths
    const courseMain = new course({
        file_name,
        price,
        duration,
        Photo: photoPath,
    });

    courseMain.save()
        .then(() => {
            console.log('Successfully added the program..');
            res.status(200).json({ message: 'program Added' });
        })
        .catch((err) => {
            console.log(err);
            res.status(500).json({ error: 'An error occurred while saving the course.' });
        });
});
// Course ends

// Chapter STarts
const Filter = (req, file, cb) => {
    const allowedFileTypes = ['image/jpeg', 'image/png', 'image/svg', 'video/mp4'];
    if (allowedFileTypes.includes(file.mimetype)) {
        cb(null, true)
    } else {
        cb(null, false)
    }
}
const storage2 = multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, './public/chapters')
    },
    filename: function (req, file, callback) {
        callback(null, file.originalname)
    }
})

const upload2 = multer({ storage: storage2, fileFilter: Filter })

app.post('/course-chapter-upload', upload2.fields([{ name: 'video' }, { name: 'Photo' }]), (req, res) => {
    const { chapter_name, program } = req.body;
    const files = req.files;
    if (!files || !files.Photo || !files.video) {
        res.send('required fields are empty');
        return;
    }
    const photoPath = path.basename(files.Photo[0].path);
    const videoPath = path.basename(files.video[0].path);

    const chpater_upload = new chapter({
        chapter_name,
        program,
        Photo: photoPath,
        video: videoPath
    })
    chpater_upload.save()
        .then(() => res.status(200).json({ message: 'successfully uploaded the chapter' }))
        .catch((err) => console.log(err));
})

// Chapter Ends


// uploading file using Multer

const FileFilter = (req, file, cb) => {
    const allowedFileTypes = ['application/pdf', 'image/jpg', 'image/jpeg', 'image/png', 'video/mp4'];
    if (allowedFileTypes.includes(file.mimetype)) {
        cb(null, true)
    } else {
        cb(null, false)
    }
}
// const allowedFileTypes = ['application/pdf', 'image/jpg', 'image/jpeg', 'image/png', 'video/mp4'];

// const storage = multer.diskStorage({
//     destination: function (req, file, cb) {
//         if (allowedFileTypes.includes(file.mimetype)) {
//             if (!fs.existsSync('public')) {
//                 fs.mkdirSync('public');
//             }
//             if (!fs.existsSync('public/videos')) {
//                 fs.mkdirSync('public/videos');
//             }
//             if (!fs.existsSync('public/photos')) {
//                 fs.mkdirSync('public/photos');
//             }

//             if (file.mimetype.startsWith('video/')) {
//                 cb(null, 'public/videos');
//             } else if (file.mimetype.startsWith('image/')) {
//                 cb(null, 'public/photos');
//             } else {
//                 cb(null, './assets/imgs');
//             }
//         } else {
//             cb(new Error('Invalid file type.'));
//         }
//     },
//     filename: function (req, file, cb) {
//         cb(null, file.originalname);
//     }
// });
const storage = multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, './public/photos')
    },
    filename: function (req, file, callback) {
        callback(null, file.originalname);
    }
});

const upload = multer({ storage, fileFilter: FileFilter });



// Liberary Starts
app.post('/library-upload', upload.fields([{ name: 'video' }, { name: 'photo' }]), (req, res) => {
    var { file_name, category } = req.body;


    // Access the uploaded files from the request object
    const files = req.files;

    // Check if the files are uploaded and available in the files object
    if (!files || !files.video || !files.photo) {
        res.status(400).json({ error: 'Both video and photo are required.' });
        return;
    }

    // Access the file paths for further processing
    const videoPath = path.basename(files.video[0].path);
    const photoPath = path.basename(files.photo[0].path);

    // Assuming you have a Mongoose model called `library` for saving the file paths
    const Library = new library({
        file_name,
        category,
        video: videoPath,
        Photo: photoPath,
    });

    Library.save()
        .then(() => {
            console.log('Successfully added the course..');
            res.status(200).json({ message: 'Course Added' });
        })
        .catch((err) => {
            console.log(err);
            res.status(500).json({ error: 'An error occurred while saving the course.' });
        });
});




// app.get('/video', (req, res) => {

//     const range = req.headers.range;

//     if (!range) {
//         res.status(400).send('err');
//     }
//     const videoPath = "./public/videos/video (2160p).mp4";
//     const videosize = fs.statSync(videoPath).size;

//     const chunkSize = 10 ** 6;
//     const start = Number(range.replace(/\D/g, ""));
//     const end = Math.min(start + chunkSize, videosize - 1);
//     const contentLength = end - start + 1;

//     const headers = {
//         "Content-Range": `bytes ${start}-${end}/${videosize}`,
//         "Accept-Ranges": 'bytes',
//         "Content-Length": contentLength,
//         "Content-Type": 'video/mp4'
//     }
//     res.writeHead(206, headers);


//     const videoStream = fs.createReadStream(videoPath, { start, end });
//     videoStream.on('open', () => {
//         videoStream.pipe(res);
//     });

//     videoStream.on('error', (err) => {
//         console.error('Error reading video stream:', err);
//         res.status(500).send('Video streaming error.');
//     });

// })

app.get('/Liberary', (req, res) => {
    library.find().then((data) => {
        res.render('Liberary', { data: data });
    })
        .catch((err) => console.log(err));
})





app.get('/library-upload', (req, res) => {
    res.render('library-upload');
})




// Library Ends




// Delete

app.get('/delete/:id', isAuthenticated, (req, res) => {

    course.findByIdAndRemove(req.params.id)
        .then(() => {
            res.send('successfully deleted');
        })
        .catch((err) => console.log(err));
})
// Delete ENDS





app.get('/course-edit', (req, res) => {
    // console.log(req.user._id);

    course.findOne()
        .then((data) => {
            res.render('course-edit', { data: data });
            // console.log(data);
        })
        .catch((error) => {
            console.log(error);
        })
})

app.get('/chapter-edit', (req, res) => {
    // console.log(req.user._id);

    chapter.find()
        .then((data) => {
            res.render('chapter-edit', { data: data });
            // console.log(data);
        })
        .catch((error) => {
            console.log(error);
        })
})


app.get('/library-edit', (req, res) => {
    library.find()
        .then((data) => {
            res.render('library-edit', { data: data });
            console.log(data);
        })
        .catch((error) => {
            console.log(error);
        })
})



// EDIT STARTS
app.post('/edit/:id', (req, res) => {
    // id = req.params.id;
    var updatedit = {
        file_name: req.body.file_name,
        // lname: req.body.lname,
        price: req.body.price,
        // duration: req.body.duration,
        Photo: req.body.Photo
    }
    // if (req.file) {
    //     updatedit.photo = {
    //         data: req.file.filename,
    //         contentType: 'image/jpg',
    //     };
    // }
    course.findByIdAndUpdate(req.params.id, updatedit).then(() => {
        // res.redirect('course-page');
        res.send('successfully updated!')
    })
        .catch((error) => {
            // res.redirect('/dashboard');
            console.log(error);
        });
});
// EDIT ENDS


// Library Edit starts

app.post('/update-selected-videos', upload.fields([
    { name: 'video', maxCount: 2 }, // 'video' field is for video file (maxCount: 1 means only one file)
    { name: 'Photo', maxCount: 2 } // 'Photo' field is for photo file (maxCount: 1 means only one file)
  ]), (req, res) => {
    const selectedVideoIds = req.body.selectedItems;
       console.log(selectedVideoIds)
    var updatedVideo = {
      file_name: req.body.file_name,
      category: req.body.category,
      video: req.files['video'][0].filename, // Access the video file name from req.files
      Photo: req.files['Photo'][0].filename // Access the photo file name from req.files
    };
//   console.log(selectedVideoIds)
    // Use the 'findOneAndUpdate' method to find and update the video by its ID
    library.findByIdAndUpdate( selectedVideoIds , updatedVideo)
      .then(() => {
        res.send('Successfully updated!');
      })
      .catch((error) => {
        console.log(error);
        res.status(500).send('Error occurred while updating the video.');
      });
  });
// Library Edit ends


// Server listening
http.listen(PORT, () => {
    console.log(`server is runinng on PORT  ${PORT}`)
});
