var superagent = require('superagent');
var AWS = require('aws-sdk');
AWS.config.update({region: 'us-west-2'});
var request = require('request');
var s3 = new AWS.S3();
var crypto = require('crypto');
var md5 = require('md5');

exports.handler = function(event, context) {
    console.log(event.queryStringParameters);

    // This doesn't actually work, I'm not sure what's up with lambda proxy integration errors yet.
    if (event.queryStringParameters == null) {
        context.fail({
            statusCode: 400,
            headers: {},
            body: 'uri parameter is required.'
        });
    }

    request({
        url: event.queryStringParameters.uri,
        encoding: null
    }, function(err, res, body) {
        console.log(res.headers);
        console.log(err);
        console.log(body);
        if (err)
            console.log(err);

        var pieces = event.queryStringParameters.uri.split('/');
        var filename = pieces[pieces.length - 1];
        console.log(filename);

        s3.putObject({
            Bucket: 'rekognition-poc',
            Key: filename,
            ContentType: res.headers['content-type'],
            ContentLength: res.headers['content-length'],
            Body: body // buffer
        },  function(err, data) {
            if (err) {
                console.log("S3 error found.");
                console.log(err, err.stack); // an error occurred
            } else {
                console.log("S3 success.");
                console.log(data);           // successful response
            }
            context.succeed({
                statusCode: 200,
                headers: {},
                body: '{"yo": "oy"}'
            });
        });
    });

    // request(event.queryStringParameters.uri, function(err, res, body) {
    //     // console.log('body: ' + JSON.stringify(body));
    //     if (err) {
    //         console.log(err);
    //     }
    //     console.log("res.headers: " + JSON.stringify(res.headers));
    //
    //     // var hash = md5(res.body);
    //
    //     // console.log('hash: ' + JSON.stringify(hash));
    //     s3.putObject({
    //         Bucket: 'rekognition-poc',
    //         Key: 'filename',
    //         ContentType: res.headers['content-type'],
    //         ContentLength: res.headers['content-length'],
    //         Body: res.body // buffer
    //     }, function(err, res) {
    //         console.log(err, res);
    //         context.succeed({
    //             statusCode: 200,
    //             headers: {},
    //             body: '{"yo": "oy"}'
    //         });
    //     });
    // });
};
