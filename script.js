"use strict";

window.addEventListener("DOMContentLoaded", start);

const allStudents = [];
//const studentsDataCleaned = []; //not sure if i need this

//This defines a template (prototype) for the data objects
const Student = {
    firstName:"",
    lastName:"",
    middleName:"",
    nickName:"",
    imageFilename:"",
    house:"",
}


function start( ) {
    console.log("ready");
    loadJSON();
}


function loadJSON() {
    fetch("https://petlatkea.dk/2021/hogwarts/students.json")
    .then( response => response.json() )
    .then( jsonData => {
        // when loaded, prepare objects
        prepareObjects( jsonData );
    });
}

function prepareObjects( jsonData ) {
    jsonData.forEach( jsonObject => {
        // we use "Student" prototype to create "newStudent"
        const newStudent = Object.create(Student);

        const fullName = jsonObject.fullname;
        const house = jsonObject.house;

        const firstSpace = fullName.indexOf(" ");
        const lastSpace = fullName.lastIndexOf(" ");

        //FIRST NAME
        let firstName = fullName.substring(0,firstSpace);
        let firstNameTrim = firstName.trim();
        let firstNameFinal = firstNameTrim.charAt(0).toUpperCase() + firstNameTrim.substring(1).toLowerCase();

        //MIDDLE NAME
        let middleName = fullName.substring(firstSpace+1, lastSpace);
        let middleNameTrim = middleName.trim();
        let middleNameFinal = middleNameTrim.charAt(0).toUpperCase() + middleNameTrim.substring(1).toLowerCase();
        
        //LAST NAME
        let lastName = fullName.substring(lastSpace);
        let lastNameTrim = lastName.trim();
        let lastNameFinal = lastNameTrim.charAt(0).toUpperCase() + lastNameTrim.substring(1).toLowerCase();
       

        //FULLNAME
        function showFullname(firstName, middleName, lastName){
            if(middleName) {
            const fullNameFinal = `${firstNameFinal} ${middleNameFinal} ${lastNameFinal}`;
            //console.log(fullNameFinal);
            } else {
            const fullNameFinal = `${firstNameFinal} ${lastNameFinal}`;
            //console.log(fullNameFinal);
            }
        }
        showFullname();

        //HOUSE
        let houseTrim = house.trim();
        let houseFinal = houseTrim.charAt(0).toUpperCase() + houseTrim.substring(1).toLowerCase();

        newStudent.firstName = firstNameFinal;
        newStudent.middleName = middleNameFinal;
        newStudent.lastName = lastNameFinal;
        //newStudent.nickName = nickNameFinal;
        //newStudent.imageFilename = ;
        newStudent.house = houseFinal;

        allStudents.push(newStudent);

        const split = new Set([firstNameFinal, middleNameFinal, lastNameFinal]);
        let nameSplit = Array.from(split);
    })

    displayList();
}


function displayList() {
    // clear the list
    document.querySelector("#list tbody").innerHTML = "";

    // build a new list
    allStudents.forEach( displayStudent );
}

function displayStudent ( newStudent ) {
    // create clone
    const clone = document.querySelector("template#student").content.cloneNode(true);

    // set clone data
    clone.querySelector("[data-field=firstName]").textContent = newStudent.firstName;
    clone.querySelector("[data-field=lastName]").textContent = newStudent.lastName;
    clone.querySelector("[data-field=middleName]").textContent = newStudent.middleName;
    clone.querySelector("[data-field=nickName]").textContent = newStudent.nickName;
    //clone.querySelector("[data-field=imageFilename]").textContent = newStudent.; //imageFilename
    clone.querySelector("[data-field=house]").textContent = newStudent.house;

    // append clone to list
    document.querySelector("#list tbody").appendChild( clone );
}