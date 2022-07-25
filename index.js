var Express = require("express");
var bodyParser = require("body-parser");
const { request, response } = require("express");

var app = Express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

var MongoClient = require("mongodb").MongoClient;
var CONNECTION_STRING = "mongodb+srv://testdb:testdb@cluster0.7bras.mongodb.net/?retryWrites=true&w=majority";

var fileUpload = require('express-fileupload');
var fs = require('fs');
app.use(fileUpload());
app.use('/Photos', Express.static(__dirname + '/Photos'));

var cors = require('cors');
app.use(cors());

var DATABASE = "testdb";
var database;

app.listen(49146, () => {
    MongoClient.connect(CONNECTION_STRING, { useNewUrlParser: true }, (error, client) => {
        database = client.db(DATABASE);
        console.log("Mongo DB Connection Successfull");
    })
});

app.get('/', (request, response) => {
    response.json('Hello World!');
})

app.get('/api/department', (request, response) => {
    database.collection("department").find({}).toArray((error, result) => {
        if (error) {
            console.log(error);
        }
        response.json(result);
    })
})

app.post('/api/department', (request, response) => {
    database.collection("department").count({}, function (error, numOfDocs) {
        if (error) {
            console.log(error);
        }
        database.collection("department").insertOne({
            DepartmentId: numOfDocs + 1,
            DepartmentName: request.body['DepartmentName']
        });
        response.json("added Successfully")
    })
})

app.put('/api/department', (request, response) => {

    database.collection("department").updateOne(
        // Filter Criteria
        {
            "DepartmentId": request.body['DepartmentId']
        },
        {
            $set: {
                "DepartmentName": request.body['DepartmentName']
            }
        }
    );
    response.json("Updated Successfully")
})

app.delete('/api/department/:id', (request, response) => {

    database.collection("department").deleteOne(
        { DepartmentId: parseInt(request.params.id) }
    );
    response.json("Deleted Successfully")
})


// Employee
app.get('/api/employee', (request, response) => {
    database.collection("Employee").find({}).toArray((error, result) => {
        if (error) {
            console.log(error);
        }
        response.json(result);
    })
})

app.post('/api/employee', (request, response) => {
    database.collection("Employee").count({}, function (error, numOfDocs) {
        if (error) {
            console.log(error);
        }
        database.collection("Employee").insertOne({
            EmployeeId: numOfDocs + 1,
            EmployeeName: request.body['EmployeeName'],
            Department: request.body['Department'],
            DateofJoining: request.body['DateofJoining'],
            PhotoFileName: request.body['PhotoFileName']
        });
        response.json("added Successfully")
    })
})

app.put('/api/employee', (request, response) => {

    database.collection("Employee").updateOne(
        // Filter Criteria
        {
            "EmployeeId": request.body['EmployeeId']
        },
        {
            $set: {
                EmployeeName: request.body['EmployeeName'],
                Department: request.body['Department'],
                DateofJoining: request.body['DateofJoining'],
                PhotoFileName: request.body['PhotoFileName']
            }
        }
    );
    response.json("Updated Successfully")
})

app.delete('/api/employee/:id', (request, response) => {

    database.collection("Employee").deleteOne(
        { EmployeeId: parseInt(request.params.id) }
    );
    response.json("Deleted Successfully")
})

app.post('/api/employee/savefile', (request, response) => {
    fs.writeFile("./Photos/" + request.files.file.name,
        request.files.file.data, function (err) {
            if (err) {
                console.log(err);
            }

            response.json(request.files.file.name);
        })
})