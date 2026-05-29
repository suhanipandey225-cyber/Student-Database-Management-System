async function addStudent() {
    const student = {
        name: document.getElementById("name").value,
        roll: document.getElementById("roll").value,
        department: document.getElementById("department").value,
        email: document.getElementById("email").value
    };

    await fetch("/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(student)
    });

    alert("Student Added!");
    loadStudents();
}

async function loadStudents() {
    const res = await fetch("/students");
    const data = await res.json();

    const list = document.getElementById("studentList");
    list.innerHTML = "";

    data.forEach(s => {
        const li = document.createElement("li");
        li.textContent = `${s.name} - ${s.roll} - ${s.department}`;
        list.appendChild(li);
    });
}

loadStudents();