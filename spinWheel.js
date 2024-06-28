const canvas = document.getElementById('wheelCanvas');
const ctx = canvas.getContext('2d');
const spinButton = document.getElementById('spinButton');
const nameForm = document.getElementById('nameForm');
const nameInput = document.getElementById('nameInput');
const colorInput = document.getElementById('colorInput');
const nameList = document.getElementById('nameList');
const modal = document.getElementById('modal');
const modalText = document.getElementById('modalText');
const closeButton = document.querySelector('.close-button');

let segments = [
    { label: 'Rifat', color: '#FF0000' },
    { label: 'Ibrahim', color: '#00FF00' },
    { label: 'Jisan', color: '#0000FF' },
];

function updatenameList() {
    nameList.innerHTML = '';
    segments.forEach((segment, index) => {
        const li = document.createElement('li');
        li.style.display = 'flex';
        li.style.justifyContent = 'space-between';
        li.style.alignItems = 'center';
        li.style.padding = '5px 0';

        const nameSpan = document.createElement('span');
        nameSpan.textContent = segment.label;
        nameSpan.style.color = segment.color;

        const deleteButton = document.createElement('button');
        deleteButton.innerHTML = '❌';
        deleteButton.style.marginLeft = '10px';
        deleteButton.style.color = 'red';
        deleteButton.style.border = 'none';
        deleteButton.style.background = 'none';
        deleteButton.style.cursor = 'pointer';
        deleteButton.style.fontSize = '12px';
        deleteButton.addEventListener('click', () => {
            segments.splice(index, 1);
            updatenameList();
            drawWheel();
        });

        li.appendChild(nameSpan);
        li.appendChild(deleteButton);
        nameList.appendChild(li);
    });
}


const numSegments = () => segments.length;
const segmentAngle = () => (2 * Math.PI) / numSegments();
let angle = 0;
let isSpinning = false;

function drawWheel() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.save();
    ctx.translate(canvas.width / 2, canvas.height / 2);
    ctx.rotate(angle);

    for (let i = 0; i < numSegments(); i++) {
        const startAngle = i * segmentAngle();
        const endAngle = startAngle + segmentAngle();
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.arc(0, 0, canvas.width / 2, startAngle, endAngle);
        ctx.fillStyle = segments[i].color;
        ctx.fill();

        ctx.strokeStyle = '#FFFFFF';
        ctx.lineWidth = 2;
        ctx.stroke();

        ctx.save();
        ctx.rotate(startAngle + segmentAngle() / 2);
        ctx.textAlign = 'right';
        ctx.fillStyle = '#000';
        ctx.font = '16px Arial';
        ctx.fillText(segments[i].label, canvas.width / 2 - 10, 10);
        ctx.restore();
    }

    ctx.restore();
}

function spinWheel() {
    if (isSpinning) return;
    isSpinning = true;

    const spinDuration = 1000;
    const spinEndTime = Date.now() + spinDuration;
    const spinVelocity = Math.random() * 0.5 + 0.5;

    function spin() {
        if (Date.now() < spinEndTime) {
            angle += spinVelocity;
            drawWheel();
            requestAnimationFrame(spin);
        } else {
            isSpinning = false;

            const winningSegmentIndex = Math.floor(((2 * Math.PI - (angle % (2 * Math.PI))) % (2 * Math.PI)) / segmentAngle());
            showModal(`Winner: ${segments[winningSegmentIndex].label}`);
        }
    }

    spin();
}

function showModal(message) {
    modalText.textContent = message;
    modal.style.display = 'block';
}

function closeModal() {
    modal.style.display = 'none';
}

spinButton.addEventListener('click', spinWheel);
closeButton.addEventListener('click', closeModal);
window.addEventListener('click', (event) => {
    if (event.target === modal) {
        closeModal();
    }
});

nameForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const newname = nameInput.value.trim();
    const newColor = colorInput.value;
    if (newname) {
        segments.push({ label: newname, color: newColor });
        updatenameList();
        drawWheel();
        nameInput.value = '';
    }
});

updatenameList();
drawWheel();
