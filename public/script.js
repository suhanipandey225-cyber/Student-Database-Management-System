const studentForm = document.getElementById("studentForm");
const studentTable = document.getElementById("studentTable");
const searchInput = document.getElementById("searchInput");
const totalStudents = document.getElementById("totalStudents");

const studentId = document.getElementById("studentId");
const nameInput = document.getElementById("name");
const rollNoInput = document.getElementById("rollNo");
const emailInput = document.getElementById("email");
const courseInput = document.getElementById("course");
const semesterInput = document.getElementById("semester");

const formTitle = document.getElementById("formTitle");
const submitBtn = document.getElementById("submitBtn");

let studentsData = [];

studentForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const student = {
    name: nameInput.value.trim(),
    rollNo: rollNoInput.value.trim(),
    email: emailInput.value.trim(),
    course: courseInput.value.trim(),
    semester: semesterInput.value.trim()
  };

  try {
    let response;

    if (studentId.value) {
      response = await fetch(`/students/${studentId.value}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(student)
      });
    } else {
      response = await fetch("/students", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(student)
      });
    }

    const data = await response.json();
    alert(data.message);

    resetForm();
    fetchStudents();
  } catch (error) {
    alert("Something went wrong");
  }
});

async function fetchStudents() {
  try {
    const response = await fetch("/students");
    studentsData = await response.json();

    totalStudents.textContent = studentsData.length;
    displayStudents(studentsData);
  } catch (error) {
    studentTable.innerHTML = `
      <tr>
        <td colspan="6">Unable to fetch students</td>
      </tr>
    `;
  }
}

function displayStudents(students) {
  studentTable.innerHTML = "";

  if (students.length === 0) {
    studentTable.innerHTML = `
      <tr>
        <td colspan="6">No student records found</td>
      </tr>
    `;
    return;
  }

  students.forEach((student) => {
    const row = document.createElement("tr");

    row.innerHTML = `
      <td>${student.name}</td>
      <td>${student.rollNo}</td>
      <td>${student.email}</td>
      <td>${student.course}</td>
      <td>${student.semester}</td>
      <td>
        <button class="edit-btn" onclick="editStudent('${student._id}')">Edit</button>
        <button class="delete-btn" onclick="deleteStudent('${student._id}')">Delete</button>
      </td>
    `;

    studentTable.appendChild(row);
  });
}

function editStudent(id) {
  const student = studentsData.find((s) => s._id === id);

  studentId.value = student._id;
  nameInput.value = student.name;
  rollNoInput.value = student.rollNo;
  emailInput.value = student.email;
  courseInput.value = student.course;
  semesterInput.value = student.semester;

  formTitle.textContent = "Update Student";
  submitBtn.textContent = "Update Student";

  window.scrollTo({ top: 0, behavior: "smooth" });
}

async function deleteStudent(id) {
  const confirmDelete = confirm("Are you sure you want to delete this student?");

  if (!confirmDelete) return;

  try {
    const response = await fetch(`/students/${id}`, {
      method: "DELETE"
    });

    const data = await response.json();
    alert(data.message);

    fetchStudents();
  } catch (error) {
    alert("Error deleting student");
  }
}

function resetForm() {
  studentForm.reset();
  studentId.value = "";
  formTitle.textContent = "Add Student";
  submitBtn.textContent = "Add Student";
}

searchInput.addEventListener("input", () => {
  const searchValue = searchInput.value.toLowerCase();

  const filteredStudents = studentsData.filter((student) => {
    return (
      student.name.toLowerCase().includes(searchValue) ||
      student.rollNo.toLowerCase().includes(searchValue) ||
      student.email.toLowerCase().includes(searchValue) ||
      student.course.toLowerCase().includes(searchValue) ||
      student.semester.toLowerCase().includes(searchValue)
    );
  });

  displayStudents(filteredStudents);
});

fetchStudents();