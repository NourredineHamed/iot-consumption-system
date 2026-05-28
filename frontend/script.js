let hasClicked = false;

// FORCE EMPTY STATE ON LOAD
window.addEventListener("DOMContentLoaded", () => {
    document.getElementById("eau").value = "";
    document.getElementById("electricite").value = "";
});

// SINGLE CLICK HANDLER ONLY
document.getElementById("btn").addEventListener("click", async (event) => {

    event.preventDefault();

    hasClicked = true;

    const eau = document.getElementById("eau");
    const elec = document.getElementById("electricite");

    console.log("🟢 Button clicked");

    // loading state
    eau.value = "Loading...";
    elec.value = "Loading...";

    try {
        const res = await fetch("http://localhost:3000/consommation/latest", {
            cache: "no-store"
        });

        if (!res.ok) {
            throw new Error("HTTP error " + res.status);
        }

        const data = await res.json();

        console.log("Data received:", data);

        if (hasClicked) {
            eau.value = data.eau ?? "";
            elec.value = data.electricite ?? "";
        }

    } catch (err) {
        console.error("Error:", err);

        eau.value = "";
        elec.value = "";
    }
});