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

const settings = {
    filter: "all",
    sortBy: "firstname",
    sortDir: "asc"
}

let filterBy = "all";


function start( ) {
    console.log("ready");

    registerButtons();
    loadJSON();
}

function registerButtons() {
    document.querySelectorAll("[data-action='filter']")
        .forEach(button => button.addEventListener("click", selectFilter));

        document.querySelectorAll("[data-action='sort']")
        .forEach(button => button.addEventListener("click", selectSort));
}

async function loadJSON() {
    const response = await fetch("https://petlatkea.dk/2021/hogwarts/students.json");
    const jsonData = await response.json();
    
    // when loaded, prepare data objects
    prepareObjects( jsonData );
}

function prepareObjects( jsonData ) {
    jsonData.forEach( jsonObject => {
        // we use "Student" prototype to create "student"
        const student = Object.create(Student);

        //const fullName = jsonObject.fullname;
        

        const fullNameTrim = jsonObject.fullname.trim();
        const firstSpace = fullNameTrim.indexOf(" ");
        const lastSpace = fullNameTrim.lastIndexOf(" ");

        //FIRST NAME
        let firstName = fullNameTrim.substring(0,firstSpace);
        let firstNameTrim = firstName.trim();
        let firstNameFinal = firstNameTrim.charAt(0).toUpperCase() + firstNameTrim.substring(1).toLowerCase();

        //MIDDLE NAME
        let middleName = fullNameTrim.substring(firstSpace+1, lastSpace);
        let middleNameTrim = middleName.trim();
        let middleNameFinal = middleNameTrim.charAt(0).toUpperCase() + middleNameTrim.substring(1).toLowerCase();
        
        //LAST NAME
        let lastName = fullNameTrim.substring(lastSpace);
        let lastNameTrim = lastName.trim();
        let lastNameFinal = lastNameTrim.charAt(0).toUpperCase() + lastNameTrim.substring(1).toLowerCase();
       

        //FULLNAME
        /*function showFullname(firstName, middleName, lastName){
            if(middleName) {
            const fullNameFinal = `${firstNameFinal} ${middleNameFinal} ${lastNameFinal}`;
            //console.log(fullNameFinal);
            } else {
            const fullNameFinal = `${firstNameFinal} ${lastNameFinal}`;
            //console.log(fullNameFinal);
            }
        }
        showFullname();*/

        //HOUSE
        const house = jsonObject.house;
        let houseTrim = house.trim();
        let houseFinal = houseTrim.charAt(0).toUpperCase() + houseTrim.substring(1).toLowerCase();

        
        student.firstName = firstNameFinal;
        student.middleName = middleNameFinal;
        student.lastName = lastNameFinal;
        //newStudent.nickName = nickNameFinal;
        //newStudent.imageFilename = ;
        student.house = houseFinal;

        allStudents.push(student);

        
        /*
        //not sure about this
        const split = new Set([firstNameFinal, middleNameFinal, lastNameFinal]);
        let nameSplit = Array.from(split);
        */
    });

    displayList(allStudents);
}

function selectFilter(event) {
    const filter = event.target.dataset.filter;
    console.log(`User selected ${filter}`);
    //filterList(filter);
    setFilter(filter);
}

function setFilter(filter) {
    settings.filterBy = filter;
    buildList()
}

function filterList(filteredList) {
    
    ///////HOUSE FILTER///////
    if (settings.filterBy === "gryffindor") {
    //create a filtered list of only Gryffindor students
    filteredList = allStudents.filter(isGryffindor);

    } else if (settings.filterBy === "hufflepuff") {
    //create a filtered list of only Hufflepuff students
    filteredList = allStudents.filter(isHufflepuff);

    } else if (settings.filterBy === "ravenclaw") {
    //create a filtered list of only Ravenclaw students
    filteredList = allStudents.filter(isRavenclaw);

    } else if (settings.filterBy === "slytherin") {
    //create a filtered list of only Slytherin students
    filteredList = allStudents.filter(isSlytherin);
    }

    //TO DO: FILTER EXPELLED/NON-EXPELLED
    return filteredList;
}

function isGryffindor(student) {
    console.log("isGryffindor function");
    if (student.house === "Gryffindor") {
        return true;
      } else {
        return false;
      }
}

function isHufflepuff(student) {
    if (student.house === "Hufflepuff") {
        return true;
      } else {
        return false;
      }
}

function isRavenclaw(student) {
    if (student.house === "Ravenclaw") {
        return true;
      } else {
        return false;
      }
}

function isSlytherin(student) {
    if (student.house === "Slytherin") {
        return true;
      } else {
        return false;
      }
}

function selectSort(event) {
    const sortBy = event.target.dataset.sort;
    const sortDir = event.target.dataset.sortDirection;

    //find "old" sortby element and remove .sortBy
    const oldElement = document.querySelector(`[data-sort='${settings.sortBy}']`);
    oldElement.classList.remove("sortby");

    //indicate active sort
    event.target.classList.add("sortby");
    
    //toggle direction
    if (sortDir === "asc") {
        event.target.dataset.sortDirection = "desc";
    } else {
        event.target.dataset.sortDirection = "asc";
    }

    console.log(`User selected ${sortBy} - ${sortDir}`);
    setSort(sortBy, sortDir);
}

function setSort(sortBy, sortDir){
    settings.sortBy = sortBy;
    settings.sortDir = sortDir;
    buildList();
}

function sortList(sortedList) {
    let direction = 1;
    if (settings.sortDir === "desc") {
        //console.log("if statement 1");
        direction = -1;
    } else  {
        //console.log("if statement 2");
        settings.direction = 1;
    }

    sortedList = sortedList.sort(sortByProperty);

    function sortByProperty(studentA, studentB) {
        if (studentA[settings.sortBy] < studentB[settings.sortBy]) {
            //console.log("if statement 3");
            return -1 * direction;
        } else {
            //console.log("if statement 4");
            return 1 * direction;
        }
    }
    return sortedList;
}

function buildList() {
    const currentList = filterList(allStudents);
    const sortedList = sortList(currentList);

    displayList(sortedList);
}

function displayList(allStudents) {
    // clear the list
    document.querySelector("#list tbody").innerHTML = "";

    // build a new list
    allStudents.forEach(displayStudent);
}

function displayStudent(student) {
    // create clone
    const clone = document.querySelector("template#student").content.cloneNode(true);

    // set clone data
    clone.querySelector("[data-field=firstName]").textContent = student.firstName;
    clone.querySelector("[data-field=lastName]").textContent = student.lastName;
    clone.querySelector("[data-field=middleName]").textContent = student.middleName;
    //clone.querySelector("[data-field=nickName]").textContent = student.nickName;
    //clone.querySelector("[data-field=imageFilename]").textContent = student.; //imageFilename
    clone.querySelector("[data-field=house]").textContent = student.house;

    // append clone to list
    document.querySelector("#list tbody").appendChild(clone);
}