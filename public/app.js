let doctors =[];
let patients=[];
let consult=[];

const doctorForm = document.getElementById('doctor-form');
const doctorList = document.getElementById('doctor-list');

const patientForm = document.getElementById('patient-form');
const patientList = document.getElementById('patient-list');

const consultationForm = document.getElementById('consultation-form');
const consultationList = document.getElementById('consultation-list');

const inquiryForm = document.getElementById('consultation-inquiry-form');
const specializationList = document.getElementById('specialization-list');

const addDoctorForm = document.getElementById('add-doctor-form');
const addPatientForm = document.getElementById('add-patient-form');
const addConsultForm = document.getElementById('add-consultation-form');

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

inquiryForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    openInquiry();
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

    if(window.editingDoctorId){
        await fetch(`/doctors/${window.editingDoctorId}`, {
            method: 'PUT',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(data)
        });

        window.editingDoctorId = null;
    }else{
        //send to backend
        await fetch('/doctors', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(data)
        });
    }
    
    //reset title after save
    document.querySelector('#doctor-add-page h2').innerText = "Add New Doctor";
    
    //go back to doctor list page
    showPage('doctor-page');

    //reload table
    loadDoctors();

    //clear form
    addDoctorForm.reset();
});

addPatientForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    //get values from inputs
    const data = {
        patFName: document.getElementById('patFname').value,
        patLName: document.getElementById('patLname').value,
        patBDate: document.getElementById('patBdate').value,
        patTelNo: document.getElementById('patTelno').value
    };

    if(window.editingPatientId){
        await fetch(`/patients/${window.editingPatientId}`, {
            method: 'PUT',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(data)
        });

        window.editingPatientId = null;
    }else{
        //send to backend
        await fetch('/patients', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(data)
        });
    }
    
    //reset title after save
    document.querySelector('#patient-add-page h2').innerText = "Add New Patient";
        
    //reload table
    loadPatients();

    //go back to doctor list page
    showPage('patient-page');

    //clear form
    addPatientForm.reset();
});

addConsultForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    // 👉 PUT IT HERE
    const rawDate = document.getElementById('conDate').value;
    const formattedDate = rawDate.replace('T', ' ') + ':00';

    //get values from inputs
    const data = {
        patID: document.getElementById('conPatId').value,
        docID: document.getElementById('conDocId').value,
        consultDate: formattedDate,
        diagnosis: document.getElementById('conDiagnosis').value,
        prescription: document.getElementById('conPrescription').value
    };

    if(window.editingConsultId){
        await fetch(`/consult/${window.editingConsultId}`, {
            method: 'PUT',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(data)
        });

        window.editingConsultId = null;
    }else{
        //send to backend
        await fetch('/consult', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(data)
        });
    }
    
    //reset title after save
    document.querySelector('#consultation-add-page h2').innerText = "Add New Consultation";
        
    //reload table
    loadConsultations();

    //go back to doctor list page
    showPage('consultation-page');

    //clear form
    addConsultForm.reset();
});

function openConsultForm(){
    showPage('consultation-add-page');
    loadPatientOptions();
    loadDoctorOptions();
}

function openInquiry() {
    showPage('consult-inquiry-page');
    loadInquiry(); // load ALL doctors initially
}

async function loadDoctors() {
    const response = await fetch('/doctors');
    doctors = await response.json(); //store globally

    doctorList.innerHTML = doctors.map(doc => 
        `<tr>
            <td>${doc.docID}</td>
            <td>${doc.docFName}</td>
            <td>${doc.docLName}</td>
            <td>${doc.docAddress}</td>
            <td>${doc.docSpecial}</td>
            <td>
                <button onclick="editDoctor(${doc.docID})">Edit</button>
                <button onclick="deleteDoctor(${doc.docID})">Delete</button>
            </td>
        </tr>`   
    ).join('');
}

async function loadPatients() {
    const response = await fetch('/patients');
    patients = await response.json();

    patientList.innerHTML = patients.map(pat => 
        `<tr>
            <td>${pat.patID}</td>
            <td>${pat.patFName}</td>
            <td>${pat.patLName}</td>
            <td>${pat.patBDate}</td>
            <td>${pat.patTelNo}</td>
            <td>
                <button onclick="editPatient(${pat.patID})">Edit</button>
                <button onclick="deletePatient(${pat.patID})">Delete</button>
            </td>
        </tr>`   
    ).join('');
}

async function loadConsultations() {
    const response = await fetch('/consult');
    consult = await response.json();
    
    consultationList.innerHTML = consult.map(con => 
        `<tr>
            <td>${con.consultID}</td>
            <td>${con.patID}</td>
            <td>${con.docID}</td>
            <td>${con.consultDate}</td>
            <td>${con.diagnosis}</td>
            <td>${con.prescription}</td>
            <td>
                <button onclick="editConsultationTrans(${con.consultID})">Edit</button>
                <button onclick="deleteConsultation(${con.consultID})">Delete</button>
            </td>
        </tr>`   
    ).join('');
}

async function loadInquiry(spec = "") {
    const response = await fetch(`/doctors/inquiry?specialization=${encodeURIComponent(spec)}`);
    const result = await response.json();

    // 1. render table
    specializationList.innerHTML = result.data.map(s => 
        `<tr>
            <td>${s.docID}</td>
            <td>${s.docFName}</td>
            <td>${s.docLName}</td>
            <td>${s.docSpecial}</td>
        </tr>`   
    ).join('');   

    // 2. show COUNT (IMPORTANT REQUIREMENT)
    document.getElementById('special-count').innerText =`Total Doctors: ${result.count}`;
}

async function deleteDoctor(id) {
    if(!confirm("Are you sure you want to delete this doctor?")) return;

    await fetch(`/doctors/${id}`, {
        method: 'DELETE'
    });

    loadDoctors(); //refresh table
}

async function deletePatient(id) {
    console.log("Deleting ID:", id); // 👈 DEBUG

    if(!confirm("Are you sure you want to delete this patient?")) return;

    const res = await fetch(`/patients/${id}`, {
        method: 'DELETE'
    });
    const data = await res.json()
    console.log(data); // 👈 SEE RESPONSE

    loadPatients(); //refresh table
}

async function deleteConsultation(id) {
    console.log("Deleting consult ID:", id);// 👈 check this
    if(!confirm("Are you sure you want to delete this consultation transaction?")) return;

    const res = await fetch(`/consult/${id}`, {
        method: 'DELETE'
    });

    const data = await res.json();
    console.log(data); // 👈 check response
    loadConsultations(); //refresh table
}

async function loadPatientOptions(){
    const response = await fetch('/patients');
    const patients = await response.json();

    const select = document.getElementById('conPatId');

    select.innerHTML = patients.map(p => 
        `<option value = "${p.patID}">
            ${p.patFName} ${p.patLName} (ID: ${p.patID})
        </option>`
    ).join('');
}

async function loadDoctorOptions(){
    const response = await fetch('/doctors');
    const doctors = await response.json();

    const select = document.getElementById('conDocId');

    select.innerHTML = doctors.map(d => 
        `<option value = "${d.docID}">
            ${d.docFName} ${d.docLName} (ID: ${d.docID}) - (${d.docSpecial})
        </option>`
    ).join('');
}

function editDoctor(id){
    const doc = doctors.find(d => d.docID == id);

    //fill form
    document.getElementById('docFname').value = doc.docFName;
    document.getElementById('docLname').value = doc.docLName;
    document.getElementById('docAddr').value = doc.docAddress;
    document.getElementById('docSpecial').value = doc.docSpecial;

    //store editing ID
    window.editingDoctorId = id;

    // change title BEFORE editing
    document.querySelector('#doctor-add-page h2').innerText = "Edit Doctor";
    
    //go to form page
    showPage('doctor-add-page');

}

function editPatient(id){
    const pat = patients.find(p => p.patID === id);

    //fill form
    document.getElementById('patFname').value = pat.patFName;
    document.getElementById('patLname').value = pat.patLName;
    document.getElementById('patBdate').value = pat.patBDate;
    document.getElementById('patTelno').value = pat.patTelNo;

    //store editing ID
    window.editingPatientId = id;

    // change title BEFORE editing
    document.querySelector('#patient-add-page h2').innerText = "Edit Patient";
    
    //go to form page
    showPage('patient-add-page');

}

async function editConsultationTrans(id){
    const con = consult.find(c => c.consultID === id);

    //fill form
    document.getElementById('conPatId').value = con.patID;
    document.getElementById('conDocId').value = con.docID;

    const formatted = new Date(con.consultDate).toISOString().slice(0,16);
    document.getElementById('conDate').value = formatted;

    document.getElementById('conDiagnosis').value = con.diagnosis;
    document.getElementById('conPrescription').value = con.prescription;

    //store editing ID
    window.editingConsultId = id;

    // change title BEFORE editing
    document.querySelector('#consultation-add-page h2').innerText = "Edit Consultation Transaction";
    
    //go to form page
    showPage('consultation-add-page');

}

document.getElementById('search-doctor').addEventListener('keyup', function() {
    const input = this.value.toLowerCase();
    const rows = document.querySelectorAll('#doctor-list tr');

    rows.forEach(row => {
        const text = row.innerText.toLowerCase();
        row.style.display = text.includes(input) ? '' : 'none';
    });
});

document.getElementById('search-patient').addEventListener('keyup', function() {
    const input = this.value.toLowerCase();
    const rows = document.querySelectorAll('#patient-list tr');

    rows.forEach(row => {
        const text = row.innerText.toLowerCase();
        row.style.display = text.includes(input) ? '' : 'none';
    });
});

document.getElementById('search-consultation-trans').addEventListener('keyup', function() {
    const input = this.value.toLowerCase();
    const rows = document.querySelectorAll('#consultation-list tr');

    rows.forEach(row => {
        const text = row.innerText.toLowerCase();
        row.style.display = text.includes(input) ? '' : 'none';
    });
});

window.addEventListener('DOMContentLoaded', () => {
    document.getElementById('search-special').addEventListener('input', function () {
        loadInquiry(this.value);
    });
});

document.getElementById('patTelno').addEventListener('input', function() {
    this.value = this.value.replace(/[^0-9]/g, '');//remove non-numbers
});

function showPage(pageId) {
    document.querySelectorAll('.page').forEach(page => {
        page.classList.remove('active');
    });

    document.getElementById(pageId).classList.add('active');
}
