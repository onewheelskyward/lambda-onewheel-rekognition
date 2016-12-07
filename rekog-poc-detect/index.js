var AWS = require('aws-sdk');
AWS.config.update({region: 'us-west-2'});
var request = require('request');
var rekognition = new AWS.Rekognition();

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

    var params = {
        Image: {
            S3Object: {
                Bucket: event.queryStringParameters.bucket,
                Name: event.queryStringParameters.filename
                // Version: 'STRING_VALUE'
            }
        }
        // MaxLabels: 0,
        // MinConfidence: 0.0
    };
    rekognition.detectLabels(params, function(err, data) {
        if (err) {
            console.log(err.message);
            context.succeed({
                statusCode: 200,
                headers: {},
                body: JSON.stringify(err)
            });
        }

        console.log(data);

        context.succeed({
            statusCode: 200,
            headers: {},
            body: JSON.stringify(data)
        });
        }
    );
    // }, function(err, res, body) {
    //     console.log(res.headers);
    //     console.log(err);
    //     console.log(body);
    //     if (err)
    //         console.log(err);
    //
    // });
};
