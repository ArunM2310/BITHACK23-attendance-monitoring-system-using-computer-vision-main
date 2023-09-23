console.clear();

//Registered Student Container 

const displayMonth = document.getElementById('display-month');
const months = ['January','February','March','April','May','June','July','August','September','Octomber','Novumber','December'];
const date = new Date();
const currentMonth = months[date.getMonth()];
displayMonth.textContent = currentMonth;


//search bar 
const searchInput = document.getElementById('search-input');
searchInput.addEventListener('input', ()=>{
    const studentCards = document.querySelectorAll('.student-card');
    studentCards.forEach(student => {
        console.log(student.className)
    })
})

const studentCardTemplate= document.querySelector('[data-student-card-template]');
console.log(studentCardTemplate)

function addStudentFunction(name,roll)
{
    const profileCardContainer = document.getElementById('registered-students');
    const studentCard = studentCardTemplate.content.cloneNode(true).querySelector('.student-card')
    const studentName = studentCard.querySelector('[data-student-name]');
    const rollNumber = studentCard.querySelector('[data-roll-number]');

    studentName.textContent = name;
    rollNumber.textContent = roll;

    profileCardContainer.appendChild(studentCard);
}

addStudentFunction('Ameer khan B','201EE113')

//search bar function

const studentCards = document.querySelectorAll('.student-card');
const search = document.getElementById('search-input');

search.oninput = () => {
    studentCards.forEach(studentCard => {
        studentCard.style.display = 'flex';
        const name = studentCard.querySelector('[data-student-name]');
        const rollnumber = studentCard.querySelector('[student-roll-number]');
        console.log(name + ' ' + rollnumber);
    });
};