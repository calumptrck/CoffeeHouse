'use strict';

const http = require('http'),
    express = require('express'),
    path = require('path'),
		logger = require('morgan'),
    // cookieParser = require('cookie-parser'),
    siofu = require("socketio-file-upload"),
		bodyParser = require('body-parser'),
    index = require('./routes/index'),
    fileUpload = require('./routes/fileUpload');

const app = express().use(siofu.router),
			server = http.Server(app);

app.use(logger('dev'));

app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: false }))
// app.use(cookieParser());
app.set('port', process.env.PORT || 3000);
app.set('view engine', 'ejs');

app.use('/', index);
app.use('/fileUpload', fileUpload);

/*
io.on("connection", function(socket){
    var uploader = new siofu();
    uploader.dir = "/path/to/save/uploads";
    uploader.listen(socket);
});
*/

app.get('/test/', (req, res) => {
    const PythonShell = require('python-shell')

    PythonShell.defaultOptions = {
        scriptPath: './lib'
    }

    var options = {
        mode: 'text',
        pythonOptions: ['-u'],
        args: ['']
    }


    PythonShell.run('test.py', options, (err, results) => {
        console.log(results);
        res.send(results)
    })

})

server.listen(app.get('port'), () => {
    console.log('Express server listening on port ' + app.get('port'));
});

app.use((req, res) => {
    res.status(404).send({ url: req.url });
});

module.exports = app;
