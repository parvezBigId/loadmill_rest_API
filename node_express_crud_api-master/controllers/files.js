import { v4 as uuid } from 'uuid';
import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { error } from 'console';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

let files = [];

export const readFS = (req, res) => {
    const sourceDir = path.join("/home/smbtest" , "Remediation")
    fs.readdir(sourceDir, (err, files) => {if (!err) {res.json(files);}else{res.json("Error Reading Dir")}});
    res.end;
};

function generateUID() {
    var firstPart = (Math.random() * 46656) | 0;
    var secondPart = (Math.random() * 46656) | 0;
    firstPart = ("000" + firstPart.toString(36)).slice(-3);
    secondPart = ("000" + secondPart.toString(36)).slice(-3);
    console.log(firstPart + secondPart)
    return firstPart + secondPart;
}

export const cloneFS = (req, res) => {
    const parentPath = req.body.dirName
    const targetDirectory = path.join(parentPath, "automation", generateUID())
    const sourceFile = path.join(parentPath, "test1.txt")
    const destinationFile = path.join(targetDirectory, "test1.txt")
    fs.mkdirSync(targetDirectory, {recursive: true}, err => {
        if(!err) {
            console.log("Created");
        }
    });
    fs.copyFile(sourceFile, destinationFile, err => {
        if (!err) {
            console.log("Copied");
            res.json({"clonePath": destinationFile})
        } else{
            console.log(err)
            res.json({"clonePath": "unable to create source file copy."})}
      });
    res.end;
}

export const fileExists = (req, res) => {
    const filePath = req.path;
    fs.accessSync(filePath, fs.constants.F_OK, err => {
        if(!err? res.json({"fileExists": true}) : res.json({"fileExists": false}));
    });
};

export const deleteDir = (req, res) => { 
    const deleteDirPath = req.body.dirName;
    fs.rmdirSync(deleteDirPath, {recursive: true});
    res.json({"deleted": req.body.dirName});
    console.log(`directory with name ${req.body.dirName} has been deleted`);
    res.end;
};

export const updateFile =  (req,res) => {
    const file = files.find((file) => file.name === req.params.name);
    file.filename = req.body.filename;
    file.name = req.body.name;
    console.log(`filename has been updated to ${req.body.filename}. Name has been updated to ${req.body.name}`)
};
