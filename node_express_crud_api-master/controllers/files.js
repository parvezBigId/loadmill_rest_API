import { v4 as uuid } from 'uuid';
import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { error } from 'console';
import * as child from 'child_process';
import date from 'date-and-time';

let files = [];

export const readFS = (req, res) => {
    const sourceDir = path.join("/home/smbtest")
    fs.readdir(sourceDir, (err, files) => {if (!err) {res.json({"List Of Files": files});}else{
            console.log(err)
	    res.json("Error Reading Dir")}});
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
    const targetDirectory = path.join(parentPath, generateUID())
    const sourceDump = "/home/Remediation"
    const smbSourcePath = path.join(targetDirectory)
    const smbDestinationPath = "/home/smbtest/public"
       
        //delete pre-existing directories
    //child.exec('rm -rf /home/smbtest/', (error, stdout, stderr) => {
      //     if (error) {
        //           console.error(`error: ${error.message}`);
          //         return;
           //}
   // });

	//Create SourceSMB directory
    fs.mkdirSync(smbSourcePath, {recursive: true}, err => {
        if(!err) {
            console.log("Created");
        }else{console.log(err)}
    });

      //Create Destination share with name public
    //fs.mkdirSync(smbDestinationPath, {recursive: true}, err => {
    //    if(!err) {
    //        console.log("Created");
    //    }
    //});

      //Update permissions to 777 for all directories since the data cannot be moved otherwise
    //child.exec('chmod 777 -R /home/smbtest/', (error, stdout, stderr) => {
//	   if (error) {
//		   console.error(`error: ${error.message}`);
//		   return;
//	   }
//    }); 

      //Copy content from source dump to smb source share
    fs.cp(sourceDump, smbSourcePath, {recursive: true}, err => {
        if (!err) {
            console.log("Copied");
            res.json({"clonePath": smbSourcePath, "destinationPath": smbDestinationPath})
        } else{
            console.log(err)
            res.json({"clonePath": "unable to create source file copy.","destinationDrivePath":"unable to create."})}
      });
    child.exec('chmod 777 -R /home/smbtest/', (error, stdout, stderr) => {
           if (error) {
                   console.error(`error: ${error.message}`);
                   return;
           }
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
    child.exec(`sudo chmod 777 -R ${req.body.dirName}`, (error, stdout, stderr) => {
           if (error) {
                   console.error(`error: ${error.message}`);
                   return;
           }
    });
    fs.rmdirSync(`${req.body.dirName}`, {recursive: true});
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
export const readFile = (req,res) => {
	const filePath = req.body.filePath;
	fs.readFile(filePath, 'utf8', function (err, data) {
		if (err) {
			console.log(err);
			res.json({"Error reading file": err});
		}else{
			res.json({"FileContent": data});
			console.log(data);
		}
	});
};

export const syncTime =  (req,res) => {
	const now = new Date();
	console.log(now);
        const syncDate = date.addSeconds(now, 30);
	//child.exec('date -u +"%Y-%m-%dT%H:%M:%SZ"' , (error, stdout, stderr)=> {

	const dateToCron = (date) => {
    		const seconds = date.getSeconds();
    		const minutes = date.getMinutes();
    		const hours = date.getHours();
		//res.json({"syncTime":`${seconds} ${minutes} ${hours} * * *`})
    		return `${seconds} ${minutes} ${hours} * * *`;
	};
	const dateText = syncDate.toString();
	const dateBeforeCron = new Date(dateText);
	const cron = dateToCron(dateBeforeCron);
	res.json({"syncTime":cron})
	console.log(cron); //30 5 9 5 2
};
