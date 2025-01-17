const API_BASE_URL = "http://localhost:3000/api";

const addStudentForm = document.getElementById("addStudentForm");
const studentsTable = document.getElementById("studentsTable");

async function fetchStudents() {
  try {
    const response = await fetch(`${API_BASE_URL}/students`);
    const students = await response.json();
    studentsTable.innerHTML = "";

    students.forEach((student) => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td class="p-4 border-b border-blue-gray-50"><p class="block font-sans text-sm antialiased font-normal leading-normal text-blue-gray-900">${
          student.name
        }</p></td>
        <td class="p-4 border-b border-blue-gray-50"><p class="block font-sans text-sm antialiased font-normal leading-normal text-blue-gray-900">${
          student.rollNumber
        }</p></td>
        <td class="p-4 border-b border-blue-gray-50"><p class="block font-sans text-sm antialiased font-normal leading-normal text-blue-gray-900">${
          student.class
        }</p></td>
        <td class="p-4 border-b border-blue-gray-50"><p class="block font-sans text-sm antialiased font-normal leading-normal text-blue-gray-900">${
          student.section
        }</p></td>
        <td class="px-4 border-b border-blue-gray-50"><p class="block font-sans text-sm antialiased font-normal leading-normal text-blue-gray-900">
        <button class="m-2 bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-500" onclick="removeStudent('${
          student._id
        }')">Remove</button>
          <button class="m-2 bg-yellow-500 text-white py-2 px-4 rounded-md hover:bg-yellow-600" onclick="showUpdateForm(JSON.parse(decodeURIComponent('${encodeURIComponent(
            JSON.stringify(student)
          )}')))">Update</button></p>
          
        </td>
`;
      studentsTable.appendChild(tr);
    });
  } catch (error) {
    console.error("Error fetching students:", error);
  }
}

addStudentForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const name = document.getElementById("studentName").value;
  const rollNumber = document.getElementById("rollNumber").value;
  const studentClass = document.getElementById("class").value;
  const section = document.getElementById("Section").value;

  try {
    const response = await fetch(`${API_BASE_URL}/students`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, rollNumber, class: studentClass, section }),
    });

    const result = await response.json();
    if (response.ok) {
      //   alert(result.message);
      fetchStudents();
    } else {
      alert(`Error: ${result.message}`);
    }
  } catch (error) {
    console.error("Error adding student:", error);
  }
});

async function removeStudent(studentId) {
  try {
    const response = await fetch(`${API_BASE_URL}/students/${studentId}`, {
      method: "DELETE",
    });

    const result = await response.json();
    if (response.ok) {
      //   alert(result.message);
      fetchStudents();
    } else {
      alert(`Error: ${result.message}`);
    }
  } catch (error) {
    console.error("Error removing student:", error);
  }
}

function showUpdateForm(student) {
  // console.log("UPDATING STUDENT");

  document.getElementById("updateStudentForm").style.display = "block";
  document.getElementById("addStudentForm").style.display = "none";

  document.getElementById("updateStudentId").value = student._id;
  document.getElementById("updateStudentName").value = student.name;
  document.getElementById("updateRollNumber").value = student.rollNumber;
  document.getElementById("updateClass").value = student.class;
  document.getElementById("updateSection").value = student.section;
}

function cancelUpdate() {
  document.getElementById("updateStudentForm").style.display = "none";
  document.getElementById("addStudentForm").style.display = "block";
}

// Handle update student form submission
document
  .getElementById("updateStudentForm")
  .addEventListener("submit", async (e) => {
    e.preventDefault();

    const id = document.getElementById("updateStudentId").value;
    const name = document.getElementById("updateStudentName").value;
    const rollNumber = document.getElementById("updateRollNumber").value;
    const studentClass = document.getElementById("updateClass").value;
    const section = document.getElementById("updateSection").value;

    try {
      const response = await fetch(`${API_BASE_URL}/students/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          rollNumber,
          class: studentClass,
          section,
        }),
      });

      const result = await response.json();
      if (response.ok) {
        // alert(result.message);
        cancelUpdate();
        fetchStudents();
      } else {
        alert(`Error: ${result.message}`);
      }
    } catch (error) {
      console.error("Error updating student:", error);
    }
  });

fetchStudents();
