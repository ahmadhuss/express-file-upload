const express = require('express');
const multer = require('multer')
const cors = require('cors');



const app = express();
app.use(cors());

/**
 Data that is coming from the client side has the following shape.
 name: string
 overview: string
 status: string
 notableArtworks: File binary object
 */

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public') // Create the public folder for the local file storage.
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' +file.originalname )
    }
})




/**
 * Create an upload instance for the single file
 * Here we have to pass the field name which contain binary of client side image
 * In our case it is "notableArtworks"
 * When we pass our fieldName "notableArtworks" in the single() method
 * We can access this file in endpoint function with "req.file".
 */
const upload = multer({ storage: storage }).single('notableArtworks');


/**
 * Now in multiple file scenario we have to update the multer upload instance
 * to accept an array of files. Same scenario just like the single image
 * We have to pass the field name which contain all the client side images
 * e.g. "notableArtworks".
 * Pass this field name into an array('notableArtworks'). Now we can access
 * all these files array in endpoint function with "req.files" instead of "req.file".
 */
// const upload = multer({ storage: storage }).array('notableArtworks');


app.get('/',function(req,res){
    return res.send('Hello Server')
});

app.post('/upload',function(req, res) {

    upload(req, res, function (err) {

        console.log('req', req);
        console.log('req.body.name', req.body.name);
        console.log('req.body.overview', req.body.overview);
        console.log('req.body.status', req.body.status);
        console.log('request.file', req.file);

        if (err instanceof multer.MulterError) {
            return res.status(500).json(err)
            // A Multer error occurred when uploading.
        } else if (err) {
            return res.status(500).json(err)
            // An unknown error occurred when uploading.
        }

        return res.status(200).send({message: 'Successfully uploaded!'});
        // Everything went fine.
    });
});

app.listen(8000, function() {
    console.log('App running on port 8000');
});