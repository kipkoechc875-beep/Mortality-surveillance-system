document.getElementById("deathForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const data = {
    name: document.getElementById("name").value,
    age: document.getElementById("age").value,
    sex: document.getElementById("sex").value,
    cause_of_death: document.getElementById("cause").value,
    location: document.getElementById("location").value,
    date_of_death: document.getElementById("date").value
  };

  await fetch("http://localhost:3000/api/deaths/add", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(data)
  });

  alert("Data submitted successfully");
});