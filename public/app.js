
const form = document.getElementById('doctor-form');

const list = document.getElementById('output');

form.addEventListener('submit', async (e) => {
    e.preventDefault();
    loadDoctors();   
});

async function loadDoctors() {
    const response = await fetch('/doctors');
    const doctors = await response.json();
    list.innerHTML = doctors.map(doc => 
        `<li>${doc.docFName} ${doc.docLName} - ${doc.docSpecial}</li>
        `).join('');
    // fetch('http://localhost:3000/doctors')
    //     .then(res => res.json())
    //     .then(data => {
    //         document.getElementById('output').textContent = 
    //         JSON.stringify(data, null, 2);
    //     });
}
