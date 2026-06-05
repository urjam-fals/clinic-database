
const doctorForm = document.getElementById('doctor-form');
const doctorList = document.getElementById('doctor-list');

const patientForm = document.getElementById('patient-form');
const patientList = document.getElementById('patient-list');

const consultationForm = document.getElementById('consultation-form');
const consultationList = document.getElementById('consultation-list');

const addDoctorForm = document.getElementById('add-doctor-form');

doctorForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    loadDoctors();   
});

patientForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    loadPatients();   
});

consultationForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    loadConsultations();   
});

addDoctorForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    //get values from inputs
    const data = {
        docFName: document.getElementById('docFname').value,
        docLName: document.getElementById('docLname').value,
        docAddress: document.getElementById('docAddr').value,
        docSpecial: document.getElementById('docSpecial').value
    };

    //send to backend
    const response = await fetch('/doctors', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    });

    const result = await response.json();
    alert(result.message);

    //reload table
    loadDoctors();

    //go back to doctor list page
    showPage('doctor-page');

    //clear form
    addDoctorForm.reset();
});
async function loadDoctors() {
    const response = await fetch('/doctors');
    const doctors = await response.json();
    doctorList.innerHTML = doctors.map(doc => 
        `<tr>
            <td>${doc.docID}</td>
            <td>${doc.docFName}</td>
            <td>${doc.docLName}</td>
            <td>${doc.docAddress}</td>
            <td>${doc.docSpecial}</td>
        </tr>`   
    ).join('');
}

async function loadPatients() {
    const response = await fetch('/patients');
    const patients = await response.json();
    patientList.innerHTML = patients.map(pat => 
        `<tr>
            <td>${pat.patID}</td>
            <td>${pat.patFName}</td>
            <td>${pat.patLName}</td>
            <td>${pat.patBDate}</td>
            <td>${pat.patTelNo}</td>
        </tr>`   
    ).join('');
}

async function loadConsultations() {
    const response = await fetch('/consult');
    const consult = await response.json();
    consultationList.innerHTML = consult.map(con => 
        `<tr>
            <td>${con.consultID}</td>
            <td>${con.patID}</td>
            <td>${con.docID}</td>
            <td>${con.consultDate}</td>
            <td>${con.diagnosis}</td>
            <td>${con.prescription}</td>
        </tr>`   
    ).join('');
}

document.getElementById('search-doctor').addEventListener('keyup', function() {
    const input = this.value.toLowerCase();
    const rows = document.querySelectorAll('#doctor-list tr');

    rows.forEach(row => {
        const text = row.innerText.toLowerCase();
        row.style.display = text.includes(input) ? '' : 'none';
    });
});


function showPage(pageId) {
    document.querySelectorAll('.page').forEach(page => {
        page.classList.remove('active');
    });

    document.getElementById(pageId).classList.add('active');
}