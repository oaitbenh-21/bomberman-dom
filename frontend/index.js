    document.querySelector(".messages").style.display = "none";
    function debounce(func, timeout = 300) {
        let timer;
        return (...args) => {
            clearTimeout(timer);
            timer = setTimeout(() => { func.apply(this, args); }, timeout);
        };
    }

    const socket = new WebSocket('ws://localhost:8080');
    let Counter = 5;
    let TimerID;
    let TimeInSecconds = 0
    let PlayersCount;
    document.querySelector(".send").addEventListener("click", sendMessage)
    document.querySelector(".chat-icon").addEventListener("click", () => {
        let div = document.querySelector(".messages");
        if (div.style.display == "none") {
            div.style.display = "flex";
        } else {
            div.style.display = "none";
        }

    })

    function sendMessage() {
        let message = document.querySelector(".create input");
        socket.send(JSON.stringify({
            type: "chat-client",
            message: message.value,
        }));
        message.value = "";
    }

    function renderPlayersCount(count) {
        document.getElementById("count").innerHTML = `${count}/4`;
    }


    socket.onmessage = (event) => {
        try {
            const data = JSON.parse(event.data);
            const board = document.getElementById('boardContainer');
            socket.send(JSON.stringify({ type: "data-client" }));
            switch (data.type) {
                case "chat-server":
                    let messages = document.querySelector(".messages");
                    let chatDiv = document.createElement("div");
                    chatDiv.className = "msg";
                    chatDiv.textContent = `${data.sender} : ${data.message}`;
                    messages.appendChild(chatDiv);
                    if (messages.style.display == "none") {
                        let fly = document.querySelector(".flyMessage");
                        clearTimeout(flyTimeout)
                        fly.textContent = `${data.sender} : ${data.message}`;
                        var flyTimeout = setTimeout(() => {
                            fly.textContent = "";
                        }, 3000)
                    }
                    break;
                case "count-server":
                    renderPlayersCount(data.count);
                    PlayersCount = data.count;
                    break;
                case "board-server":
                    renderBoard(data.board);
                    break;
                case "join-server":
                    if (TimerID) clearTimeout(TimerID)
                    Counter = 5;
                    Timer();
                    const player = document.createElement('img');
                    player.className = 'player';
                    player.src = "./assets/img/down-1.png";
                    player.style.transform = `translate(${data.pos.x}px, ${data.pos.y}px)`;
                    player.id = data.id;
                    board.appendChild(player);
                    break;
                case "move-server":
                    MovePlayer(data.player);
                    break;

                case "remove-server":
                    RemoveElement(data.y, data.x);
                    if (data.pos) {
                        const bombed = document.createElement("img");
                        console.log(bombed);
                        bombed.src = "./assets/img/bombed.gif";
                        bombed.className = "player";
                        bombed.style.top = data.pos.top + "px";
                        bombed.style.left = data.pos.left + "px";
                        board.appendChild(bombed);
                        console.log(bombed);
                        setTimeout(() => {
                            bombed.parentElement.removeChild(bombed);
                        }, 400)
                    }
                    break;
                case "kill-server":
                    const kill = document.getElementById(data.id);
                    kill.parentNode.removeChild(kill);
                case "bomb-server":
                    const bomb = document.createElement('img');
                    bomb.className = 'player';
                    bomb.src = "./assets/img/bomb.gif";
                    bomb.style.top = "0px";
                    bomb.style.left = "0px";
                    bomb.style.transform = `translate(${data.pos.x}px, ${data.pos.y}px)`;
                    board.appendChild(bomb);
                    setTimeout(() => {
                        bomb.parentElement.removeChild(bomb);
                    }, 2000);
                    break;
                case "gameover-server":
                    const popup = document.getElementById("timer");
                    popup.style.display = "flex";
                    popup.innerHTML = `Game Over<br>The Winner is ${data.winner}`;
                    console.log("there is a winner");
                    break;
                case "skill-server":
                    const skill = document.createElement('img');
                    skill.className = 'player';
                    skill.src = `../img/${data.name}.png`;
                    skill.id = data.id;
                    skill.style.top = "0px";
                    skill.style.left = "0px";
                    skill.style.transform = `translate(${data.pos.x}px, ${data.pos.y}px)`;
                    board.appendChild(skill);
                    break;
                case "data-server":
                    document.querySelector("#lifes").innerHTML = data.lifes;
                    document.querySelector("#Bombs").innerHTML = data.bombs;
                default:
                    break;
            }
        } catch (err) { }
    };

    function sendMove(direction) {
        socket.send(JSON.stringify({ type: 'move-client', direction }));
    }

    function renderBoard(board) {
        const container = document.getElementById('boardContainer');
        container.innerHTML = ''; // Clear old board
        const table = document.createElement('table');
        for (let y = 0; y < board.length; y++) {
            const row = document.createElement('tr');
            for (let x = 0; x < board[y].length; x++) {
                const cell = document.createElement('td');
                const val = board[y][x];
                if (val === 2) {
                    cell.className = 'wall';
                } else if (val === 3) {
                    cell.className = 'box';
                } else {
                    cell.className = 'empty';
                }
                row.appendChild(cell);
            }
            table.appendChild(row);
        }

        container.appendChild(table);
    }
    function Timer() {
        if (PlayersCount <= 1 || Counter == 0) {
            if (Counter == 0) {
                document.getElementById("timer").style.display = "none";
                setInterval(() => {
                    document.getElementById("time").innerHTML = formatSecondsToMinutes(TimeInSecconds);
                    TimeInSecconds++;
                }, 1000)
            }
            return;
        }
        document.getElementById("timer").innerHTML = `Waiting ${Counter}...`;
        TimerID = setTimeout(() => {
            Counter--;
            Timer()
        }, 1000);
    }
    function MovePlayer(data) {
        const target = document.getElementById(data.id);
        if (target) {
            target.style.transform = `translate(${data.pos.x}px, ${data.pos.y}px)`;
        }
    }

    document.addEventListener("keydown", (e) => {
        switch (e.key) {
            case "ArrowDown":
                sendMove("b");
                break;
            case "ArrowUp":
                sendMove("t");
                break;
            case "ArrowLeft":
                sendMove("l");
                break;
            case "ArrowRight":
                sendMove("r");
                break;
            case " ":
                socket.send(JSON.stringify({
                    type: "bomb-client",
                }));
                break;
            default:
                break;
        }
    });

    function RemoveElement(y, x) {
        const boardContainer = document.getElementById("boardContainer");
        if (!boardContainer) return;
        const rows = boardContainer.getElementsByTagName("tr");
        if (!rows || rows.length === 0 || y >= rows.length || y < 0) return;
        const colls = rows[y].getElementsByTagName("td");
        if (!colls || colls.length === 0 || x >= colls.length || x < 0) return;
        colls[x].className = "empty";
    }
    function formatSecondsToMinutes(seconds) {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;
    }
