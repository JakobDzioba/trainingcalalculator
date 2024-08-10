document.addEventListener("DOMContentLoaded", () => {
    const exercises = {
        strength: ["Leg Press", "Podciąganie", "Incline Bench Press", "Chest Butterflies", "Lateral Raises", "Bulgarian Squat", "T Bar Row", "Pullover", "Push Ups", "Machine Shoulder Raise", "Shoulder Butterflies", "Seated Biceps Curl", "OP Proste", "OP Boczne", "Reverse Nordic", "Dips", "Nordic Curl", "Barbel Shoulder Raise", "Tibialis Raise", "Barbel Twists"]
    };

    const bodyWeightExercises = ["Podciąganie", "Push Ups", "Reverse Nordic", "Dips", "Nordic Curl"];
    const bodyWeight = 100;

    const trainingSelect = document.getElementById("training");
    const exerciseSelect = document.getElementById("exercise");
    const seriesInput = document.getElementById("series");
    const setSeriesButton = document.getElementById("set-series");
    const addExerciseButton = document.getElementById("add-exercise");
    const seriesInputsContainer = document.getElementById("series-inputs-container");
    const volumeTableBody = document.querySelector("#volume-table tbody");
    const volumeResult = document.getElementById("volume-result");
    const finalVolumeTableBody = document.querySelector("#final-volume-table tbody");
    const downloadExcelButton = document.getElementById("download-excel");

    const runTimeInput = document.getElementById("run-time");
    const distanceInput = document.getElementById("distance");
    const hrAverageInput = document.getElementById("hr-average");
    const paceInput = document.getElementById("pace");
    const calculateRunButton = document.getElementById("calculate-run");

    const rowSeriesInput = document.getElementById("row-series");
    const rowSeriesInputsContainer = document.getElementById("row-series-inputs-container");
    const setRowSeriesButton = document.getElementById("set-row-series");
    const calculateRowButton = document.getElementById("calculate-row");
    
    const throwsInput = document.getElementById("throws");
    const rotationsInput = document.getElementById("rotations");
    const hammerWeightSelect = document.getElementById("hammer-weight");
    const calculateThrowButton = document.getElementById("calculate-throw");


    let totalVolume = 0;

    const dorMax = {
        1: 1,
        2: 0.97,
        3: 0.94,
        4: 0.92,
        5: 0.89,
        6: 0.86,
        7: 0.83,
        8: 0.81,
        9: 0.78,
        10: 0.75,
        11: 0.73,
        12: 0.71,
        13: 0.70,
        14: 0.68,
        15: 0.67,
        16: 0.65,
        17: 0.64,
        18: 0.63,
        19: 0.61,
        20: 0.60,
        21: 0.59,
        22: 0.58,
        23: 0.57,
        24: 0.56,
        25: 0.55,
        26: 0.54,
        27: 0.53,
        28: 0.52,
        29: 0.51,
        30: 0.50
    };

    const updateExercises = () => {
        const selectedTraining = trainingSelect.value;
        const exercisesForTraining = exercises[selectedTraining] || [];
        exerciseSelect.innerHTML = "";
        exercisesForTraining.forEach(exercise => {
            const option = document.createElement("option");
            option.value = exercise;
            option.textContent = exercise;
            exerciseSelect.appendChild(option);
        });
    };

    const addVolumeToTable = (activity, details, volume) => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${activity}</td>
            <td>${details}</td>
            <td>${volume.toFixed(1)}</td>
        `;
        volumeTableBody.appendChild(row);
    };

    const updateFinalVolumeTable = () => {
        finalVolumeTableBody.innerHTML = `
            <tr>
                <td>${trainingSelect.options[trainingSelect.selectedIndex].text}</td>
                <td>${totalVolume.toFixed(1)}</td>
            </tr>
        `;
    };

    trainingSelect.addEventListener("change", () => {
        document.querySelectorAll(".training-section").forEach(section => {
            section.style.display = "none";
        });
        document.getElementById(`${trainingSelect.value}-training`).style.display = "block";
        updateExercises();
    });

    exerciseSelect.addEventListener("change", () => {
        const selectedExercise = exerciseSelect.value;
        if (bodyWeightExercises.includes(selectedExercise)) {
            seriesInputsContainer.querySelectorAll("input[type='number']").forEach(input => {
                if (input.classList.contains("weight")) {
                    input.value = bodyWeight;
                    input.disabled = true;
                }
            });
        } else {
            seriesInputsContainer.querySelectorAll("input[type='number']").forEach(input => {
                if (input.classList.contains("weight")) {
                    input.value = "";
                    input.disabled = false;
                }
            });
        }
    });

    setSeriesButton.addEventListener("click", () => {
        seriesInputsContainer.innerHTML = "";
        const series = parseInt(seriesInput.value);
        for (let i = 0; i < series; i++) {
            const repsInput = document.createElement("input");
            repsInput.type = "number";
            repsInput.id = `reps-${i}`;
            repsInput.classList.add("reps");
            repsInput.min = "1";
            repsInput.placeholder = `Powtórzenia Seria ${i + 1}`;

            const weightInput = document.createElement("input");
            weightInput.type = "number";
            weightInput.step = "0.1";
            weightInput.id = `weight-${i}`;
            weightInput.classList.add("weight");
            weightInput.min = "0";
            weightInput.placeholder = `Ciężar Seria ${i + 1}`;

            seriesInputsContainer.appendChild(repsInput);
            seriesInputsContainer.appendChild(weightInput);
        }
        addExerciseButton.disabled = false;
    });

    addExerciseButton.addEventListener("click", () => {
        const exercise = exerciseSelect.value;
        const series = parseInt(seriesInput.value);

        let totalExerciseVolume = 0;
        for (let i = 0; i < series; i++) {
            const reps = parseInt(document.getElementById(`reps-${i}`).value);
            const weight = parseFloat(document.getElementById(`weight-${i}`).value);
            const dorMaxValue = dorMax[reps] || 1; // Default to 1 if reps > 30
            const volume = reps * weight * dorMaxValue;
            totalExerciseVolume += volume;

            const details = `Seria ${i + 1}: Powtórzenia ${reps}, Ciężar ${weight} kg, DOR ${dorMaxValue}`;
            addVolumeToTable("Trening Siłowy", details, volume);
        }

        totalVolume += totalExerciseVolume;
        volumeResult.textContent = `Objętość treningowa: ${totalVolume.toFixed(1)}`;

        updateFinalVolumeTable();
    });

    calculateRunButton.addEventListener("click", () => {
        const runTime = runTimeInput.value.split(":");
        const runSeconds = parseInt(runTime[0]) * 60 + parseInt(runTime[1]);
        const distance = parseFloat(distanceInput.value);
        const hrAverage = parseInt(hrAverageInput.value);
        const paceTime = paceInput.value.split(":");
        const paceSeconds = parseInt(paceTime[0]) * 60 + parseInt(paceTime[1]);
        const hrMax = 200;
        const volume = (runSeconds * distance * (hrMax - hrAverage)) / paceSeconds;

        totalVolume += volume;
        const details = `Czas Biegu: ${runTime.join(":")}, Dystans: ${distance} km, Średnie Tętno: ${hrAverage}, Tempo: ${paceTime.join(":")}`;
        addVolumeToTable("Bieg Zone 2 Cardio", details, volume);

        volumeResult.textContent = `Objętość treningowa: ${totalVolume.toFixed(1)}`;

        updateFinalVolumeTable();
    });

    setRowSeriesButton.addEventListener("click", () => {
        rowSeriesInputsContainer.innerHTML = "";
        const rowSeries = parseInt(rowSeriesInput.value);
        for (let i = 0; i < rowSeries; i++) {
            const rowTimeInput = document.createElement("input");
            rowTimeInput.type = "text";
            rowTimeInput.id = `row-time-${i}`;
            rowTimeInput.classList.add("row-time");
            rowTimeInput.placeholder = `Czas Seria ${i + 1} (min:sek)`;

            const rowWattsInput = document.createElement("input");
            rowWattsInput.type = "number";
            rowWattsInput.id = `row-watts-${i}`;
            rowWattsInput.classList.add("row-watts");
            rowWattsInput.placeholder = `Watty Seria ${i + 1}`;

            const rowHRInput = document.createElement("input");
            rowHRInput.type = 'number'
            rowHRInput.id = `row-hr-${i}`;
            rowHRInput.classList.add("row-hr");
            rowHRInput.placeholder = `Średnie tętno Seria ${i + 1}`;

            rowSeriesInputsContainer.appendChild(rowTimeInput);
            rowSeriesInputsContainer.appendChild(rowWattsInput);
            rowSeriesInputsContainer.appendChild(rowHRInput);
        }
        calculateRowButton.disabled = false;
    });

    calculateRowButton.addEventListener("click", () => {
        const rowSeries = parseInt(rowSeriesInput.value);
        const rowHrMax = 200;
        let totalRowVolume = 0;

        for (let i = 0; i < rowSeries; i++) {
            const rowTime = document.getElementById(`row-time-${i}`).value.split(":");
            const rowSeconds = parseInt(rowTime[0]) * 60 + parseInt(rowTime[1]);
            const rowWatts = parseInt(document.getElementById(`row-watts-${i}`).value);
            const rowHrAverage = parseInt(document.getElementById(`row-hr-${i}`).value)

            const rowVolume = (rowSeconds * rowWatts * (rowHrAverage / rowHrMax)) / 60;
            totalRowVolume += rowVolume;

            const details = `Seria ${i + 1}: Czas ${rowTime.join(":")}, Watty ${rowWatts}`;
            addVolumeToTable("VO2 Max Row", details, rowVolume);
        }

        totalVolume += totalRowVolume;
        volumeResult.textContent = `Objętość treningowa: ${totalVolume.toFixed(1)}`;

        updateFinalVolumeTable();
    });


    calculateThrowButton.addEventListener("click", () => {
        const throws = parseInt(throwsInput.value);
        const rotations = parseInt(rotationsInput.value);
        const hammerWeight = parseFloat(hammerWeightSelect.value);
        const throwVolume = throws * rotations * hammerWeight;
        totalVolume += throwVolume;
        addVolumeToTable("Trening Rzutowy", `Ilość rzutów: ${throws}, Ilość obrotów: ${rotations}, Ciężar młota: ${hammerWeight} kg`, throwVolume);
        updateFinalVolumeTable();
    });

    downloadExcelButton.addEventListener("click", () => {
        const tableHtml = document.getElementById("volume-table").outerHTML;
        const dataUri = 'data:application/vnd.ms-excel,' + encodeURIComponent(tableHtml);
        downloadExcelButton.setAttribute('href', dataUri);
        downloadExcelButton.setAttribute('download', 'volume_data.xls');
    });
});
