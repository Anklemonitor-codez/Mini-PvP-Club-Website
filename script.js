const tierPoints = {
        "HT1": 60,
        "LT1": 45,
        "HT2": 30,
        "LT2": 20,
        "HT3": 10,
        "LT3": 6,
        "HT4": 4,
        "LT4": 3,
        "HT5": 2,
        "LT5": 1
    };

    const titles = [
        { minScore: 0, title: "Beginner", color: "var(--beginnerColor)"},
        { minScore: 10, title: "Intermediate", color: "var(--intermediateColor)"},
        { minScore: 25, title: "Advanced", color: "var(--advancedColor)"},
        { minScore: 50, title: "Pro", color: "var(--proColor)" },
        { minScore: 100, title: "Master", color: "var(--masterColor)"},
        { minScore: 200, title: "Grandmaster", color: "var(--grandmasterColor)"},
        { minScore: 300, title: "Champion", color: "var(--championColour)"}
        
    ];

    let players = [];

    main();

    async function main() {
        players = await fetchData();

        const leaderboard = document.querySelector('#leaderboard');

        players.forEach(player => {
            player.score = calculateScore(player);
        });

        players.sort((a, b) => b.score - a.score);

        players.forEach((player, index) => {
            player.Rank = index + 1;
        });

        renderLeaderboard(players);
    }

    async function fetchData() {
        const res = await fetch(
            `players.json?nocache=${Date.now()}`,
            {
                cache: "no-store"
            }
        );
        const data = await res.json();
        return data;
    }

    function displayInfo() {
        document.getElementById('info-floater').style.visibility = 'visible';
        document.getElementById('floater-background').style.display = 'inline';
        disableScroll();
    }

    function hideInfo() {
        document.getElementById('info-floater').style.visibility = 'hidden';
        document.getElementById('floater-background').style.display = 'none';
        document.getElementById('info-floater-points').style.visibility = 'hidden';
        enableScroll()
    }

    function switchToTitles() {
         document.getElementById('info-floater').style.visibility = 'visible';
        document.getElementById('info-floater-points').style.visibility = 'hidden';
    }

    function switchToPoints() {
        document.getElementById('info-floater-points').style.visibility = 'visible';
        document.getElementById('info-floater').style.visibility = 'hidden';
    }

    function calculateScore(player) {
        return Object.values(player.tiers)
            .reduce((total, tier) => total + (tierPoints[tier] || 0), 0);
    }

    function getTitle(score) {
        let current = titles[0];

        for (const t of titles) {
            if (score >= t.minScore) {
                current = t;
            } else {
                break;
            }
        }

        return current;
    }

    function getTierColor(tier, playerTitle) {
        if (tier == "---") return `var(--unranked)`;
        return `var(--${tier})`;
    }

    function hidePlayerStats() {
        document.getElementById('floater-background').style.display = 'none';
        document.getElementById('player-stats').remove();

        enableScroll();
    }

    function disableScroll() {
        document.body.style.overflow = "hidden";
    }

    function enableScroll() {
        document.body.style.overflow = "auto";
    }

    async function openPlayerStats(id, score, rank) {
        const json = await fetchData();
        const player = json.find(p => p.Username === id);
        document.getElementById('info-floater').style.visibility = 'hidden';
        document.getElementById('floater-background').style.display = 'inline';
        document.getElementById('info-floater-points').style.visibility = 'hidden';

        console.log(score);

        const playerTitle = getTitle(score);

        console.log(playerTitle);

        disableScroll();

        document.getElementById('floater-container').innerHTML += `<div class="floating" id="player-stats">
                <img class="player-circ-image" src="https://render.crafty.gg/3d/bust/${player.Username}" alt="${player.Username} bust">
                <div class="username-stats">${player.Username}</div>
                <div class="title-stats" style="color: ${playerTitle.color};">${playerTitle.title}</div>
                <a id="namemc-link" href="https://namemc.com/profile/${player.Username}" target="_blank">
                    <div class="namemc">
                        <img width="20" height="20" src="https://pt.minecraft.wiki/images/NameMC.png?f63c3">
                        <span id="namemc-text">NameMC</span>
                        <i style="font-size: 12px;" class="fa-solid fa-up-right-from-square"></i> 
                    </div>
                <a> 
                
                <span class="position-title">POSITION</span>
                <div class="position-on-leaderboard-wrapper">
                    <div class="overall-text">OVERALL:</div>
                    <div class="position-on-leaderboard">#${rank}</div>
                    <span style="color: grey; font-weight: normal; font-size: 1.5vw; margin-left: 0.25vw;">(${score} points)</span>
                </div>
                <div class="tiers-stats-title"><span>TIERS</span></div>
                <div class="tiers-stats">
                    <div class="gamemode-tiers-stats">
                        <div id="sword-gamemode">
                            <div class="img-border" style="border: solid 2px ${getTierColor(player.tiers.Sword)}; box-shadow: 0 0 3px ${getTierColor(player.tiers.Sword)};" data-tooltip="Sword&#10; ${player.tiers.Sword}"><img class="gamemode-image-player" src="Assets/Diamond_Sword.png" alt="diamond sword"></div>
                            <div class="gamemode-type" style="background-color: ${getTierColor(player.tiers.Sword)};">${player.tiers.Sword}</div>
                        </div>
                        <div id="axe-gamemode">
                            <div class="img-border" style="border: solid 2px ${getTierColor(player.tiers.Axe)}; box-shadow: 0 0 3px ${getTierColor(player.tiers.Axe)};" data-tooltip="Sword&#10; ${player.tiers.Axe}"><img class="gamemode-image-player" src="Assets/Diamond_Axe.png" alt="diamond axe"></div>
                            <div class="gamemode-type" style="background-color: ${getTierColor(player.tiers.Axe)};">${player.tiers.Axe}</div>
                        </div>
                        <div id="uhc-gamemode">
                            <div class="img-border" style="border: solid 2px ${getTierColor(player.tiers.UHC)}; box-shadow: 0 0 3px ${getTierColor(player.tiers.UHC)};" data-tooltip="Sword&#10; ${player.tiers.UHC}"><img class="gamemode-image-player" src="Assets/Lava_Bucket.png" alt="diamond axe"></div>
                            <div class="gamemode-type" style="background-color: ${getTierColor(player.tiers.UHC)};">${player.tiers.UHC}</div>
                        </div>
                        <div id="vanilla-gamemode">
                            <div class="img-border" style="border: solid 2px ${getTierColor(player.tiers.Vanilla)}; box-shadow: 0 0 3px ${getTierColor(player.tiers.Vanilla)};" data-tooltip="Sword&#10; ${player.tiers.Vanilla}"><img class="gamemode-image-player" src="Assets/End_Crystal.png" alt="end crystal"></div>
                            <div class="gamemode-type" style="background-color: ${getTierColor(player.tiers.Vanilla)};">${player.tiers.Vanilla}</div>
                        </div>
                        <div id="mace-gamemode">
                            <div class="img-border" style="border: solid 2px ${getTierColor(player.tiers.Mace)}; box-shadow: 0 0 3px ${getTierColor(player.tiers.Mace)};" data-tooltip="Sword&#10; ${player.tiers.Mace}"><img class="gamemode-image-player" src="Assets/Mace.png" alt="mace"></div>
                            <div class="gamemode-type" style="background-color: ${getTierColor(player.tiers.Mace)};">${player.tiers.Mace}</div>
                        </div>
                        <div id="smp-gamemode">
                            <div class="img-border" style="border: solid 2px ${getTierColor(player.tiers.SMP)}; box-shadow: 0 0 3px ${getTierColor(player.tiers.SMP)};" data-tooltip="Sword&#10; ${player.tiers.SMP}"><img class="gamemode-image-player" src="Assets/Shield.png" alt="shield"></div>
                            <div class="gamemode-type" style="background-color: ${getTierColor(player.tiers.SMP)};">${player.tiers.SMP}</div>
                        </div>
                        <div id="dia-pot-gamemode">
                            <div class="img-border" style="border: solid 2px ${getTierColor(player.tiers.Diamond_pot)}; box-shadow: 0 0 3px ${getTierColor(player.tiers.Diamond_pot)};" data-tooltip="Sword&#10; ${player.tiers.Diamond_pot}"><img class="gamemode-image-player" src="Assets/Potion_Healing.png" alt="potion"></div>
                            <div class="gamemode-type" style="background-color: ${getTierColor(player.tiers.Diamond_pot)};">${player.tiers.Diamond_pot}</div>
                        </div>
                        <div id="neth-pot-gamemode">
                            <div class="img-border" style="border: solid 2px ${getTierColor(player.tiers.Netherite_pot)}; box-shadow: 0 0 3px ${getTierColor(player.tiers.Netherite_pot)};" data-tooltip="Sword&#10; ${player.tiers.Netherite_pot}"><img class="gamemode-image-player" src="Assets/Netherite_Helmet.png" alt="netherite helmet"></div>
                            <div class="gamemode-type" style="background-color: ${getTierColor(player.tiers.Netherite_pot)};">${player.tiers.Netherite_pot}</div>
                        </div>
                    </div>
                </div>
                </div>`;
    }

    function renderLeaderboard(playerList) {

        const leaderboard = document.querySelector('#leaderboard');

        leaderboard.innerHTML = '';

        for (const player of playerList) {

            const playerScore = player.score;
            const playerTitle = getTitle(playerScore);

            if (player.Rank == 1) {
                leaderboard.innerHTML += `<div class="leaderboard-slot-1" onclick="openPlayerStats('${player.Username}', ${playerScore}, ${player.Rank})">
                <div class="leaderboard-ranking" id="leaderboard-ranking-1" style="background-color: var(--firstColor);">${player.Rank} .</div>
                <img class="player-image" src="https://render.crafty.gg/3d/bust/${player.Username}" alt="${player.Username} bust">
                <div class="points-badge-and-name">
                    <div class="username">${player.Username}</div>
                    <div class="player-title" style="color: ${playerTitle.color};">${playerTitle.title}<span style="color: rgb(153, 153, 153); font-weight: normal;">(${playerScore} points)</span></div>
                </div>
                <div class="gamemode-tiers">
                    <div id="sword-gamemode" data-tooltip="Sword&#10; ${player.tiers.Sword}">
                        <div class="img-border" style="border: solid 2px ${getTierColor(player.tiers.Sword)}; box-shadow: 0 0 3px ${getTierColor(player.tiers.Sword)};"><img class="gamemode-image-player" src="Assets/Diamond_Sword.png" alt="diamond sword"></div>
                        <div class="gamemode-type" style="background-color: ${getTierColor(player.tiers.Sword)};">${player.tiers.Sword}</div>
                    </div>
                    <div id="axe-gamemode" data-tooltip="Axe ${player.tiers.Axe}">
                        <div class="img-border" style="border: solid 2px ${getTierColor(player.tiers.Axe)}; box-shadow: 0 0 3px ${getTierColor(player.tiers.Axe)};"><img class="gamemode-image-player" src="Assets/Diamond_Axe.png" alt="diamond axe"></div>
                        <div class="gamemode-type" style="background-color: ${getTierColor(player.tiers.Axe)};">${player.tiers.Axe}</div>
                    </div>
                    <div id="uhc-gamemode" data-tooltip="UHC ${player.tiers.UHC}">
                        <div class="img-border" style="border: solid 2px ${getTierColor(player.tiers.UHC)}; box-shadow: 0 0 3px ${getTierColor(player.tiers.UHC)};"><img class="gamemode-image-player" src="Assets/Lava_Bucket.png" alt="diamond axe"></div>
                        <div class="gamemode-type" style="background-color: ${getTierColor(player.tiers.UHC)};">${player.tiers.UHC}</div>
                    </div>
                    <div id="vanilla-gamemode" data-tooltip="Vanilla ${player.tiers.Vanilla}">
                        <div class="img-border" style="border: solid 2px ${getTierColor(player.tiers.Vanilla)}; box-shadow: 0 0 3px ${getTierColor(player.tiers.Vanilla)};"><img class="gamemode-image-player" src="Assets/End_Crystal.png" alt="end crystal"></div>
                        <div class="gamemode-type" style="background-color: ${getTierColor(player.tiers.Vanilla)};">${player.tiers.Vanilla}</div>
                    </div>
                    <div id="mace-gamemode" data-tooltip="Mace ${player.tiers.Mace}">
                        <div class="img-border" style="border: solid 2px ${getTierColor(player.tiers.Mace)}; box-shadow: 0 0 3px ${getTierColor(player.tiers.Mace)};"><img class="gamemode-image-player" src="Assets/Mace.png" alt="mace"></div>
                        <div class="gamemode-type" style="background-color: ${getTierColor(player.tiers.Mace)};">${player.tiers.Mace}</div>
                    </div>
                    <div id="smp-gamemode" data-tooltip="SMP ${player.tiers.SMP}">
                        <div class="img-border" style="border: solid 2px ${getTierColor(player.tiers.SMP)}; box-shadow: 0 0 3px ${getTierColor(player.tiers.SMP)};"><img class="gamemode-image-player" src="Assets/Shield.png" alt="shield"></div>
                        <div class="gamemode-type" style="background-color: ${getTierColor(player.tiers.SMP)};">${player.tiers.SMP}</div>
                    </div>
                    <div id="dia-pot-gamemode" data-tooltip="Pot ${player.tiers.Diamond_pot}">
                        <div class="img-border" style="border: solid 2px ${getTierColor(player.tiers.Diamond_pot)}; box-shadow: 0 0 3px ${getTierColor(player.tiers.Diamond_pot)};"><img class="gamemode-image-player" src="Assets/Potion_Healing.png" alt="potion"></div>
                        <div class="gamemode-type" style="background-color: ${getTierColor(player.tiers.Diamond_pot)};">${player.tiers.Diamond_pot}</div>
                    </div>
                    <div id="neth-pot-gamemode" data-tooltip="Neth Pot ${player.tiers.Netherite_pot}">
                        <div class="img-border" style="border: solid 2px ${getTierColor(player.tiers.Netherite_pot)}; box-shadow: 0 0 3px ${getTierColor(player.tiers.Netherite_pot)};"><img class="gamemode-image-player" src="Assets/Netherite_Helmet.png" alt="netherite helmet"></div>
                        <div class="gamemode-type" style="background-color: ${getTierColor(player.tiers.Netherite_pot)};">${player.tiers.Netherite_pot}</div>
                    </div>
                </div>
            </div>`;
            }

            else if (player.Rank == 2) {
                leaderboard.innerHTML += `<div class="leaderboard-slot-2" onclick="openPlayerStats('${player.Username}', ${playerScore}, ${player.Rank})">
                <div class="leaderboard-ranking" id="leaderboard-ranking-2" style="background-color: var(--secondColor);">${player.Rank} .</div>
                <img class="player-image" src="https://render.crafty.gg/3d/bust/${player.Username}" alt="${player.Username} bust">
                <div class="points-badge-and-name">
                    <div class="username">${player.Username}</div>
                    <div class="player-title" style="color: ${playerTitle.color};">${playerTitle.title}<span style="color: rgb(153, 153, 153); font-weight: normal;">(${playerScore} points)</span></div>
                </div>
                <div class="gamemode-tiers">
                    <div id="sword-gamemode" data-tooltip="Sword&#10; ${player.tiers.Sword}">
                        <div class="img-border" style="border: solid 2px ${getTierColor(player.tiers.Sword)}; box-shadow: 0 0 3px ${getTierColor(player.tiers.Sword)};"><img class="gamemode-image-player" src="Assets/Diamond_Sword.png" alt="diamond sword"></div>
                        <div class="gamemode-type" style="background-color: ${getTierColor(player.tiers.Sword)};">${player.tiers.Sword}</div>
                    </div>
                    <div id="axe-gamemode" data-tooltip="Axe ${player.tiers.Axe}">
                        <div class="img-border" style="border: solid 2px ${getTierColor(player.tiers.Axe)}; box-shadow: 0 0 3px ${getTierColor(player.tiers.Axe)};"><img class="gamemode-image-player" src="Assets/Diamond_Axe.png" alt="diamond axe"></div>
                        <div class="gamemode-type" style="background-color: ${getTierColor(player.tiers.Axe)};">${player.tiers.Axe}</div>
                    </div>
                    <div id="uhc-gamemode" data-tooltip="UHC ${player.tiers.UHC}">
                        <div class="img-border" style="border: solid 2px ${getTierColor(player.tiers.UHC)}; box-shadow: 0 0 3px ${getTierColor(player.tiers.UHC)};"><img class="gamemode-image-player" src="Assets/Lava_Bucket.png" alt="diamond axe"></div>
                        <div class="gamemode-type" style="background-color: ${getTierColor(player.tiers.UHC)};">${player.tiers.UHC}</div>
                    </div>
                    <div id="vanilla-gamemode" data-tooltip="Vanilla ${player.tiers.Vanilla}">
                        <div class="img-border" style="border: solid 2px ${getTierColor(player.tiers.Vanilla)}; box-shadow: 0 0 3px ${getTierColor(player.tiers.Vanilla)};"><img class="gamemode-image-player" src="Assets/End_Crystal.png" alt="end crystal"></div>
                        <div class="gamemode-type" style="background-color: ${getTierColor(player.tiers.Vanilla)};">${player.tiers.Vanilla}</div>
                    </div>
                    <div id="mace-gamemode" data-tooltip="Mace ${player.tiers.Mace}">
                        <div class="img-border" style="border: solid 2px ${getTierColor(player.tiers.Mace)}; box-shadow: 0 0 3px ${getTierColor(player.tiers.Mace)};"><img class="gamemode-image-player" src="Assets/Mace.png" alt="mace"></div>
                        <div class="gamemode-type" style="background-color: ${getTierColor(player.tiers.Mace)};">${player.tiers.Mace}</div>
                    </div>
                    <div id="smp-gamemode" data-tooltip="SMP ${player.tiers.SMP}">
                        <div class="img-border" style="border: solid 2px ${getTierColor(player.tiers.SMP)}; box-shadow: 0 0 3px ${getTierColor(player.tiers.SMP)};"><img class="gamemode-image-player" src="Assets/Shield.png" alt="shield"></div>
                        <div class="gamemode-type" style="background-color: ${getTierColor(player.tiers.SMP)};">${player.tiers.SMP}</div>
                    </div>
                    <div id="dia-pot-gamemode" data-tooltip="Pot ${player.tiers.Diamond_pot}">
                        <div class="img-border" style="border: solid 2px ${getTierColor(player.tiers.Diamond_pot)}; box-shadow: 0 0 3px ${getTierColor(player.tiers.Diamond_pot)};"><img class="gamemode-image-player" src="Assets/Potion_Healing.png" alt="potion"></div>
                        <div class="gamemode-type" style="background-color: ${getTierColor(player.tiers.Diamond_pot)};">${player.tiers.Diamond_pot}</div>
                    </div>
                    <div id="neth-pot-gamemode" data-tooltip="Neth Pot ${player.tiers.Netherite_pot}">
                        <div class="img-border" style="border: solid 2px ${getTierColor(player.tiers.Netherite_pot)}; box-shadow: 0 0 3px ${getTierColor(player.tiers.Netherite_pot)};"><img class="gamemode-image-player" src="Assets/Netherite_Helmet.png" alt="netherite helmet"></div>
                        <div class="gamemode-type" style="background-color: ${getTierColor(player.tiers.Netherite_pot)};">${player.tiers.Netherite_pot}</div>
                    </div>
                </div>
            </div>`;
            }

            else if (player.Rank == 3) {
                leaderboard.innerHTML += `<div class="leaderboard-slot-3" onclick="openPlayerStats('${player.Username}', ${playerScore}, ${player.Rank})">
                <div class="leaderboard-ranking" id="leaderboard-ranking-3" style="background-color: var(--thirdColor);">${player.Rank} .</div>
                <img class="player-image" src="https://render.crafty.gg/3d/bust/${player.Username}" alt="${player.Username} bust">
                <div class="points-badge-and-name">
                    <div class="username">${player.Username}</div>
                    <div class="player-title" style="color: ${playerTitle.color};">${playerTitle.title}<span style="color: rgb(153, 153, 153); font-weight: normal;">(${playerScore} points)</span></div>
                </div>
                <div class="gamemode-tiers">
                    <div id="sword-gamemode" data-tooltip="Sword&#10; ${player.tiers.Sword}">
                        <div class="img-border" style="border: solid 2px ${getTierColor(player.tiers.Sword)}; box-shadow: 0 0 3px ${getTierColor(player.tiers.Sword)};"><img class="gamemode-image-player" src="Assets/Diamond_Sword.png" alt="diamond sword"></div>
                        <div class="gamemode-type" style="background-color: ${getTierColor(player.tiers.Sword)};">${player.tiers.Sword}</div>
                    </div>
                    <div id="axe-gamemode" data-tooltip="Axe ${player.tiers.Axe}">
                        <div class="img-border" style="border: solid 2px ${getTierColor(player.tiers.Axe)}; box-shadow: 0 0 3px ${getTierColor(player.tiers.Axe)};"><img class="gamemode-image-player" src="Assets/Diamond_Axe.png" alt="diamond axe"></div>
                        <div class="gamemode-type" style="background-color: ${getTierColor(player.tiers.Axe)};">${player.tiers.Axe}</div>
                    </div>
                    <div id="uhc-gamemode" data-tooltip="UHC ${player.tiers.UHC}">
                        <div class="img-border" style="border: solid 2px ${getTierColor(player.tiers.UHC)}; box-shadow: 0 0 3px ${getTierColor(player.tiers.UHC)};"><img class="gamemode-image-player" src="Assets/Lava_Bucket.png" alt="diamond axe"></div>
                        <div class="gamemode-type" style="background-color: ${getTierColor(player.tiers.UHC)};">${player.tiers.UHC}</div>
                    </div>
                    <div id="vanilla-gamemode" data-tooltip="Vanilla ${player.tiers.Vanilla}">
                        <div class="img-border" style="border: solid 2px ${getTierColor(player.tiers.Vanilla)}; box-shadow: 0 0 3px ${getTierColor(player.tiers.Vanilla)};"><img class="gamemode-image-player" src="Assets/End_Crystal.png" alt="end crystal"></div>
                        <div class="gamemode-type" style="background-color: ${getTierColor(player.tiers.Vanilla)};">${player.tiers.Vanilla}</div>
                    </div>
                    <div id="mace-gamemode" data-tooltip="Mace ${player.tiers.Mace}">
                        <div class="img-border" style="border: solid 2px ${getTierColor(player.tiers.Mace)}; box-shadow: 0 0 3px ${getTierColor(player.tiers.Mace)};"><img class="gamemode-image-player" src="Assets/Mace.png" alt="mace"></div>
                        <div class="gamemode-type" style="background-color: ${getTierColor(player.tiers.Mace)};">${player.tiers.Mace}</div>
                    </div>
                    <div id="smp-gamemode" data-tooltip="SMP ${player.tiers.SMP}">
                        <div class="img-border" style="border: solid 2px ${getTierColor(player.tiers.SMP)}; box-shadow: 0 0 3px ${getTierColor(player.tiers.SMP)};"><img class="gamemode-image-player" src="Assets/Shield.png" alt="shield"></div>
                        <div class="gamemode-type" style="background-color: ${getTierColor(player.tiers.SMP)};">${player.tiers.SMP}</div>
                    </div>
                    <div id="dia-pot-gamemode" data-tooltip="Pot ${player.tiers.Diamond_pot}">
                        <div class="img-border" style="border: solid 2px ${getTierColor(player.tiers.Diamond_pot)}; box-shadow: 0 0 3px ${getTierColor(player.tiers.Diamond_pot)};"><img class="gamemode-image-player" src="Assets/Potion_Healing.png" alt="potion"></div>
                        <div class="gamemode-type" style="background-color: ${getTierColor(player.tiers.Diamond_pot)};">${player.tiers.Diamond_pot}</div>
                    </div>
                    <div id="neth-pot-gamemode" data-tooltip="Neth Pot ${player.tiers.Netherite_pot}">
                        <div class="img-border" style="border: solid 2px ${getTierColor(player.tiers.Netherite_pot)}; box-shadow: 0 0 3px ${getTierColor(player.tiers.Netherite_pot)};"><img class="gamemode-image-player" src="Assets/Netherite_Helmet.png" alt="netherite helmet"></div>
                        <div class="gamemode-type" style="background-color: ${getTierColor(player.tiers.Netherite_pot)};">${player.tiers.Netherite_pot}</div>
                    </div>
                </div>
            </div>`;
            }

            else {
                leaderboard.innerHTML += `<div class="leaderboard-slot" onclick="openPlayerStats('${player.Username}', ${playerScore}, ${player.Rank})">
                <div class="leaderboard-ranking" id="leaderboard-ranking-4" style="background-color: var(--fourthColor);">${player.Rank} .</div>
                <img class="player-image" src="https://render.crafty.gg/3d/bust/${player.Username}" alt="${player.Username} bust">
                <div class="points-badge-and-name">
                    <div class="username">${player.Username}</div>
                    <div class="player-title" style="color: ${playerTitle.color};">${playerTitle.title}<span style="color: rgb(153, 153, 153); font-weight: normal;">(${playerScore} points)</span></div>
                </div>
                <div class="gamemode-tiers">
                    <div id="sword-gamemode" data-tooltip="Sword&#10; ${player.tiers.Sword}">
                        <div class="img-border" style="border: solid 2px ${getTierColor(player.tiers.Sword)}; box-shadow: 0 0 3px ${getTierColor(player.tiers.Sword)};"><img class="gamemode-image-player" src="Assets/Diamond_Sword.png" alt="diamond sword"></div>
                        <div class="gamemode-type" style="background-color: ${getTierColor(player.tiers.Sword)};">${player.tiers.Sword}</div>
                    </div>
                    <div id="axe-gamemode" data-tooltip="Axe ${player.tiers.Axe}">
                        <div class="img-border" style="border: solid 2px ${getTierColor(player.tiers.Axe)}; box-shadow: 0 0 3px ${getTierColor(player.tiers.Axe)};"><img class="gamemode-image-player" src="Assets/Diamond_Axe.png" alt="diamond axe"></div>
                        <div class="gamemode-type" style="background-color: ${getTierColor(player.tiers.Axe)};">${player.tiers.Axe}</div>
                    </div>
                    <div id="uhc-gamemode" data-tooltip="UHC ${player.tiers.UHC}">
                        <div class="img-border" style="border: solid 2px ${getTierColor(player.tiers.UHC)}; box-shadow: 0 0 3px ${getTierColor(player.tiers.UHC)};"><img class="gamemode-image-player" src="Assets/Lava_Bucket.png" alt="diamond axe"></div>
                        <div class="gamemode-type" style="background-color: ${getTierColor(player.tiers.UHC)};">${player.tiers.UHC}</div>
                    </div>
                    <div id="vanilla-gamemode" data-tooltip="Vanilla ${player.tiers.Vanilla}">
                        <div class="img-border" style="border: solid 2px ${getTierColor(player.tiers.Vanilla)}; box-shadow: 0 0 3px ${getTierColor(player.tiers.Vanilla)};"><img class="gamemode-image-player" src="Assets/End_Crystal.png" alt="end crystal"></div>
                        <div class="gamemode-type" style="background-color: ${getTierColor(player.tiers.Vanilla)};">${player.tiers.Vanilla}</div>
                    </div>
                    <div id="mace-gamemode" data-tooltip="Mace ${player.tiers.Mace}">
                        <div class="img-border" style="border: solid 2px ${getTierColor(player.tiers.Mace)}; box-shadow: 0 0 3px ${getTierColor(player.tiers.Mace)};"><img class="gamemode-image-player" src="Assets/Mace.png" alt="mace"></div>
                        <div class="gamemode-type" style="background-color: ${getTierColor(player.tiers.Mace)};">${player.tiers.Mace}</div>
                    </div>
                    <div id="smp-gamemode" data-tooltip="SMP ${player.tiers.SMP}">
                        <div class="img-border" style="border: solid 2px ${getTierColor(player.tiers.SMP)}; box-shadow: 0 0 3px ${getTierColor(player.tiers.SMP)};"><img class="gamemode-image-player" src="Assets/Shield.png" alt="shield"></div>
                        <div class="gamemode-type" style="background-color: ${getTierColor(player.tiers.SMP)};">${player.tiers.SMP}</div>
                    </div>
                    <div id="dia-pot-gamemode" data-tooltip="Pot ${player.tiers.Diamond_pot}">
                        <div class="img-border" style="border: solid 2px ${getTierColor(player.tiers.Diamond_pot)}; box-shadow: 0 0 3px ${getTierColor(player.tiers.Diamond_pot)};"><img class="gamemode-image-player" src="Assets/Potion_Healing.png" alt="potion"></div>
                        <div class="gamemode-type" style="background-color: ${getTierColor(player.tiers.Diamond_pot)};">${player.tiers.Diamond_pot}</div>
                    </div>
                    <div id="neth-pot-gamemode" data-tooltip="Neth Pot ${player.tiers.Netherite_pot}">
                        <div class="img-border" style="border: solid 2px ${getTierColor(player.tiers.Netherite_pot)}; box-shadow: 0 0 3px ${getTierColor(player.tiers.Netherite_pot)};"><img class="gamemode-image-player" src="Assets/Netherite_Helmet.png" alt="netherite helmet"></div>
                        <div class="gamemode-type" style="background-color: ${getTierColor(player.tiers.Netherite_pot)};">${player.tiers.Netherite_pot}</div>
                    </div>
                </div>
            </div>`;
            }
        }
    }

    document.getElementById('search').addEventListener('input', (e) => {

        const query = e.target.value.toLowerCase();

        const filtered = players.filter(player =>
            player.Username.toLowerCase().includes(query)
        );

        renderLeaderboard(filtered);
    });

const tooltip = document.createElement("div");
tooltip.className = "tooltip";
document.body.appendChild(tooltip);

let activeEl = null;

document.addEventListener("mouseover", (e) => {
    const el = e.target.closest("[data-tooltip]");
    if (!el) return;

    activeEl = el;
    tooltip.textContent = el.getAttribute("data-tooltip");
});

function updateTooltipPosition() {
    if (!activeEl) return;

    const rect = activeEl.getBoundingClientRect();

    tooltip.style.left = rect.left + rect.width / 2 + "px";
    tooltip.style.top = rect.top - 8 + "px";
}

document.addEventListener("mouseover", (e) => {
    const el = e.target.closest("[data-tooltip]");
    if (!el) return;

    activeEl = el;
    tooltip.textContent = el.getAttribute("data-tooltip");
   

    const rect = el.getBoundingClientRect();

    tooltip.style.left = rect.left + rect.width / 2 + "px";
    tooltip.style.top = rect.top - 4 + "px";

    tooltip.classList.add("show");
});

document.addEventListener("mouseout", (e) => {
    if (!activeEl) return;
    
    if (!e.relatedTarget || !e.relatedTarget.closest("[data-tooltip]")) {
        activeEl = null;
        tooltip.classList.remove("show")
    }
});

function tooltipLoop() {
    updateTooltipPosition();
    requestAnimationFrame(tooltipLoop);
}

tooltipLoop();
