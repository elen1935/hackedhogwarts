"use strict";

window.addEventListener("DOMContentLoaded", start);

const allStudents = [];

//This defines a template (prototype) for the data objects
const Student = {
    firstName: "",
    lastName: "",
    middleName: null,
    nickName: null,
    gender: "",
    house: "",
    image: "",
    prefect: false
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
       

        //HOUSE
        const house = jsonObject.house;
        let houseTrim = house.trim();
        let houseFinal = houseTrim.charAt(0).toUpperCase() + houseTrim.substring(1).toLowerCase();


        //GENDER
        const gender = jsonObject.gender;
        let genderFinal = gender.charAt(0).toUpperCase() + gender.substring(1).toLowerCase();


        student.firstName = firstNameFinal;
        student.middleName = middleNameFinal;
        student.lastName = lastNameFinal;
        //newStudent.nickName = nickNameFinal;
        //newStudent.imageFilename = ;
        student.house = houseFinal;
        student.gender = genderFinal;

        allStudents.push(student);
    });

    displayList(allStudents);
    // i think this should call the buildList not the displayList
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
    
    } else {
    //create a filtered list of all the students
    filteredList = allStudents;
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
    //maybe here the parameter is the currentlist, like in the animalstars.js
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

    // defining the images
    const images = "images/" + student.lastName.toLowerCase();
    const img_path = "_" + student.firstName.substring(0, 1).toLowerCase() + ".png";
    //console.log(images + img_path);
    
    // set clone data
    clone.querySelector("[data-field=firstName]").textContent = student.firstName;
    clone.querySelector("[data-field=lastName]").textContent = student.lastName;
    clone.querySelector("[data-field=middleName]").textContent = student.middleName;
    //clone.querySelector("[data-field=nickName]").textContent = student.nickName;
    //clone.querySelector("[data-field=imageFilename]").textContent = student.; //imageFilename
    clone.querySelector("[data-field=gender]").textContent = student.gender;
    clone.querySelector("[data-field=house]").textContent = student.house;
    
    //clone.querySelector("[data-field=image]").src = images + img_path;
    clone.querySelector(".image").src = images + img_path;


    //prefects
    clone.querySelector("[data-field=prefect]").dataset.prefect = student.prefect;
    clone.querySelector("[data-field=prefect]").addEventListener("click", clickPrefect);
    function clickPrefect() {
        console.log("CLICK PREFECT");
        if (student.prefect === true) {
            console.log("CLICK PREFECT - IF STATEMENT 1");
            student.prefect = false;
        } else {
            console.log("CLICK PREFECT - IF STATEMENT 2");
            tryToMakeAPrefect(student);
            //checkHouseToMakeAPrefect(student);
        }
        buildList();
    }

    //modal button
    clone.querySelector(".image").addEventListener("click", clickModal);
    function clickModal(event) {
        showModal(student);
    }

    //append clone to list
    document.querySelector("#list tbody").appendChild(clone);
}

/*
function tryToMakeAPrefect(selectedStudent) {

    //check student's house - (do i get student or house as a parameter here?)
    function checkStudentHouse() {
    }

    //depending on the house, check state of prefects
        //if 2 prefects already in the house -> ignore or remove
        //if another prefect of the same gender -> ignore or remove
}
*/


/*
function checkHouseToMakeAPrefect(selectedStudent){
    //getting a list of all the the prefects
    const prefects = allStudents.filter(student => student.prefect);

    //getting a list of all the prefects
    const numberOfPrefects = prefects.length;
    const other = prefects.filter(student => student.house === selectedStudent.house).shift();

    console.log(`There are ${numberOfPrefects} prefects`);
    //console.log(`The other prefect of this house is ${other.firstName}`);
    console.log(other);

    //just for testing
    makePrefect(selectedStudent);


    function removePrefect(prefectStudent) {
        prefectStudent.prefect = false;
    }

    function makePrefect(student) {
        student.prefect = true;
    }
}
*/



function tryToMakeAPrefect(selectedStudent) {
    console.log("TRY TO MAKE A PREFECT");
    const prefects = allStudents.filter(student => student.prefect);
    
    const numberOfPrefects = prefects.length;
    const other = prefects.filter(student => student.gender === selectedStudent.gender).shift();
    
    //if there is another of the same gender
    if (other !== undefined) {
        console.log("IF STATEMENT 1");
        console.log("There can only be one prefect of each gender!");
        removeOther(other);
    } else if (numberOfPrefects >= 2) {
        console.log("IF STATEMENT 2");
        console.log("There can only be two prefects from the same house!");
        removeAorB(prefects[0], prefects[1]);
    } else {
        console.log("IF STATEMENT 3");
        makePrefect(selectedStudent);
    }

    function removeOther(other) {
        //ask the user to ignore or remove the "other"
        document.querySelector("#remove_other").classList.remove("hide");
        document.querySelector("#remove_other .closebutton").addEventListener("click", closeDialog);
        document.querySelector("#remove_other #removeother").addEventListener("click", clickRemoveOther);

        document.querySelector("#remove_other [data-field=otherprefect]").textContent = other.firstName;

        //if ignore - do nothing
        function closeDialog(){
            document.querySelector("#remove_other").classList.add("hide");
            document.querySelector("#remove_other .closebutton").removeEventListener("click", closeDialog);
            document.querySelector("#remove_other #removeother").removeEventListener("click", clickRemoveOther);
        }

        //if remove other:
        function clickRemoveOther() {
            removePrefect(other);
            makePrefect(selectedStudent);
            buildList();
            closeDialog();
        }
    }

    function removeAorB(prefectA, prefectB) {
        //ask the user to ignore, or remove A or B

        document.querySelector("#remove_aorb").classList.remove("hide");
        document.querySelector("#remove_aorb .closebutton").addEventListener("click", closeDialog);
        document.querySelector("#remove_aorb #removea").addEventListener("click", clickRemoveA);
        document.querySelector("#remove_aorb #removeb").addEventListener("click", clickRemoveB);

        //show names on buttons
        document.querySelector("#remove_aorb [data-field=prefectA]").textContent = prefectA.firstName;
        document.querySelector("#remove_aorb [data-field=prefectB]").textContent = prefectB.firstName;

        //if ignore - do nothing
        function closeDialog(){
            document.querySelector("#remove_aorb").classList.add("hide");
            document.querySelector("#remove_aorb .closebutton").removeEventListener("click", closeDialog);
            document.querySelector("#remove_aorb #removea").removeEventListener("click", clickRemoveA);
            document.querySelector("#remove_aorb #removeb").removeEventListener("click", clickRemoveB);
        }

        function clickRemoveA() {
            //if removeA
            removePrefect(prefectA);
            makePrefect(selectedStudent);
            buildList();
            closeDialog();
        }
        
        function clickRemoveB() {
            //else - if removeB
            removePrefect(prefectB);
            makePrefect(selectedStudent);
            buildList();
            closeDialog();
        }
    }

    function removePrefect(prefectStudent) {
        prefectStudent.prefect = false;
    }

    function makePrefect(student) {
        student.prefect = true;
    }
}


function showModal(student) {
    
    //adding details of each student to the modal

    let modalBackground = document.querySelector(".details_content");
    let houseCrest = document.querySelector(".house_crest");
    
    //house colors and crests
    if (student.house === "Gryffindor") {
    modalBackground.style.backgroundColor = "#E52C2C";
    houseCrest.src = "images/gryffindor_crest.svg";
    
    } else if (student.house === "Hufflepuff") {
    modalBackground.style.backgroundColor = "#CCB750";
    houseCrest.src = "images/hufflepuff_crest.svg";
    
    } else if (student.house === "Ravenclaw") {
    modalBackground.style.backgroundColor = "#093B54";
    houseCrest.src = "images/ravenclaw_crest.svg";
    
    } else if (student.house === "Slytherin") {
    modalBackground.style.backgroundColor = "#065B4B";
    houseCrest.src = "images/slytherin_crest.svg";
    }

    //student details

    const studentImage = document.querySelector(".student_image");
    const images = "images/" + student.lastName.toLowerCase();
    const img_path = "_" + student.firstName.substring(0, 1).toLowerCase() + ".png";
    
    studentImage.src = images + img_path;


    const firstName = document.querySelector(".modal_firstname");
    firstName.textContent = student.firstName;

    const middleName = document.querySelector(".modal_middlename");
    middleName.textContent = student.middleName;
    //add a "-" in case there's no middle name

    const lastName = document.querySelector(".modal_lastname");
    lastName.textContent = student.lastName;

    const house = document.querySelector(".modal_house");
    house.textContent = student.house;

    /*
    const bloodStatus = document.querySelector(".modal_bloodstatus");
    bloodStatus.textContent = student.bloodStatus;
    
    const activeOrExpelled = document.querySelector(".modal_expelled");
    activeOrExpelled.textContent = student.activeOrExpelled;
    
    const prefect = document.querySelector(".modal_prefect");
    prefect.textContent = student.prefect;
    
    const squadMember = document.querySelector(".modal_squad");
    squadMember.textContent = student.squadMember;
    */

    //adding event listeners to open and close modal
    document.querySelector("#details_wrapper").classList.remove("hide");
    document.querySelector("#details_wrapper .closebutton").addEventListener("click", closeModal);
    
    function closeModal() {
        document.querySelector("#details_wrapper").classList.add("hide");
        document.querySelector("#details_wrapper .closebutton").removeEventListener("click", closeModal);
    }
}