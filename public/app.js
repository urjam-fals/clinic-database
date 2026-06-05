let doctors =[];

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

    if(window.editingId){
        await fetch(`/doctors/${window.editingId}`, {
            method: 'PUT',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(data)
        });

        window.editingId = null;
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
        
    //reload table
    loadDoctors();

    //go back to doctor list page
    showPage('doctor-page');

    //clear form
    addDoctorForm.reset();
});

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

async function deleteDoctor(id) {
    if(!confirm("Are you sure you want to delete this doctor?")) return;

    await fetch(`/doctors/${id}`, {
        method: 'DELETE'
    });

    loadDoctors(); //refresh table
}

function editDoctor(id){
    const doc = doctors.find(d => d.docID === id);

    //fill form
    document.getElementById('docFname').value = doc.docFName;
    document.getElementById('docLname').value = doc.docLName;
    document.getElementById('docAddr').value = doc.docAddress;
    document.getElementById('docSpecial').value = doc.docSpecial;

    //store editing ID
    window.editingId = id;

    // change title BEFORE editing
    document.querySelector('#doctor-add-page h2').innerText = "Edit Doctor";
    
    //go to form page
    showPage('doctor-add-page');

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