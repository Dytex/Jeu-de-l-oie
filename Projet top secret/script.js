players = [];
numberOfPlayers = 0;
turnPlaying = false;
creatingPlayer = false;
turnNb = 0;
jet = 0;


document.addEventListener("keydown", function(event) {
    if (event.code === "Enter" && turnPlaying == false && creatingPlayer == false && players.length > 0) {
        play();
    }
});

function hexToRgb(hex) {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null;
}

function createPlayer() {
    // Get all player informations
    playerName = document.getElementById('nom').value.replace(/\|/g, '');
    playerColor = document.getElementById('couleur').value;

    if (playerName.length <= 20 && playerName.length > 0) {
        // Add the current player to the first tile
        firstTile = document.getElementsByClassName('tile')[0];

        // Si personne n'est sur la case remplacer le nom par celui du joueur
        if (firstTile.getAttribute('data-tooltip') == 'Personne ici') {
            firstTile.setAttribute('data-tooltip', playerName);
        } else {
            oldPlusPlayer = firstTile.getAttribute('data-tooltip') + ' | ' + playerName;
            firstTile.setAttribute('data-tooltip', oldPlusPlayer);
        }

        // Placer la couleur du joueur comme étant la bordure
        players.push({ Name: playerName, Color: playerColor, CurrentTile: 0 });

        // Donne la possibilité de lancer un tour
        creatingPlayer = false;
        hidePopup(0);
    } else if (playerName.length > 20) {
        alert('Ton nom est trop long, essaie en un plus court.');
    } else if (playerName.length == 0) {
        alert("Essaie avec un nom qui contient des lettres 😅");
    }
}

function displayCreatePlayerPopup() {
    // Empêche le lancement d'un tour
    creatingPlayer = true;
    document.getElementById('nom').value = '';
    document.getElementById('couleur').value = '';
    formulaire = document.getElementsByClassName('form')[0];
    formulaire.style.display = 'flex';
    formulaire.style.transform = 'translate(-50%, -50%) scale(0)';
    setTimeout(() => {
        formulaire.style.transform = 'translate(-50%, -50%) scale(1)';
    }, 10);
}

function displayDicePopup() {
    playerName = document.getElementById('playerName');
    playerName.innerHTML = 'A <span style="color: ' + currentPlayer.Color + '">' + currentPlayer.Name + '</span> de jouer !';
    formulaire = document.getElementsByClassName('form')[1];
    formulaire.style.display = 'flex';
    formulaire.style.transform = 'translate(-50%, -50%) scale(0)';
    setTimeout(() => {
        formulaire.style.transform = 'translate(-50%, -50%) scale(1)';
    }, 10);
}

function displayTilePopup(tileNb) {
    var rgbPlayerColor = hexToRgb(currentPlayer.Color);
    var rgbString = rgbPlayerColor.r + ', ' + rgbPlayerColor.g + ', ' + rgbPlayerColor.b;
    formulaire = document.getElementsByClassName('form')[2];
    formulaire.style.display = 'flex';
    formulaire.style.width = '600px';
    formulaire.style.height = '480px';
    formulaire.style.transform = 'translate(-50%, -50%) scale(0)';
    formulaire.style.backgroundImage = "url('./img/" + tileNb + ".png')";
    formulaire.style.backgroundSize = "cover";
    formulaire.style.boxShadow = "rgba(" + rgbString + ", 0.25) 0 -50px 36px -28px inset, rgba(" + rgbString + ", 0.25) 0 2px 4px, rgba(" + rgbString + ", 0.25) 0 4px 8px, rgba(" + rgbString + ", 0.25) 0 8px 16px, rgba(" + rgbString + ", 0.25) 0 16px 32px, rgba(" + rgbString + ", 0.25) 0 32px 64px";
    setTimeout(() => {
        formulaire.style.transform = 'translate(-50%, -50%) scale(1)';
    }, 10);
}

function hidePopup(formNb, bouton) {
    formulaire = document.getElementsByClassName('form')[formNb];
    formulaire.style.transform = 'translate(-50%, -50%) scale(0)';
    setTimeout(() => {
        formulaire.style.display = 'none';
        if (formNb == 1) {
            bouton.disabled = false;
        }
    }, 250);
}

function rollDice() {

    var diceOne = Math.floor((Math.random() * 6) + 1);
    var elDiceOne = document.getElementById('dice1');

    console.log('Dice One: ' + diceOne);

    for (var i = 1; i <= 6; i++) {
        elDiceOne.classList.remove('show-' + i);
        if (diceOne === i) {
            elDiceOne.classList.add('show-' + i);
        }
    }

    var bouton = document.getElementById('boutonLance');
    bouton.disabled = true;
    setTimeout(() => {
        hidePopup(1, bouton);
        endTurn(diceOne);
    }, 3000); // Réinitialise après 3 seconde
}

function onlyRollDice(number) {
    var elDiceOne = document.getElementById('dice1');

    console.log('Dice One: ' + number);

    for (var i = 1; i <= 6; i++) {
        elDiceOne.classList.remove('show-' + i);
        if (number === i) {
            elDiceOne.classList.add('show-' + i);
        }
    }
}

function deletePlayerFromCurrentTile(player) {
    // Get the current player tile
    currentTile = document.getElementById(player.CurrentTile);
    console.log(currentTile.getAttribute('data-tooltip'));

    //Remove his name from it
    regexNameBeforeOthers = new RegExp(`${player.Name} \\| `);
    regexNameAfterOthers = new RegExp(` \\| ${player.Name}`);
    regexNameOnly = new RegExp(`${player.Name}`);
    if (currentTile.getAttribute('data-tooltip').match(regexNameBeforeOthers) != null) {
        currentTile.setAttribute('data-tooltip', currentTile.getAttribute('data-tooltip').replace(regexNameBeforeOthers, ''));
    } else if (currentTile.getAttribute('data-tooltip').match(regexNameAfterOthers) != null) {
        currentTile.setAttribute('data-tooltip', currentTile.getAttribute('data-tooltip').replace(regexNameAfterOthers, ''));
    } else if (currentTile.getAttribute('data-tooltip').match(regexNameOnly) != null) {
        currentTile.setAttribute('data-tooltip', currentTile.getAttribute('data-tooltip').replace(regexNameOnly, ''));
    }
    if (currentTile.getAttribute('data-tooltip') == '') {
        currentTile.setAttribute('data-tooltip', 'Personne ici');
    }
}

function setPlayerTile(player, nombre) {
    // Get the current player tile
    oldTileNumber = player.CurrentTile;
    player.CurrentTile += nombre;
    nextTileNumber = player.CurrentTile;
    // Get next tile
    nextTile = document.getElementById(player.CurrentTile);

    // Si personne n'est sur la case remplacer le nom par celui du joueur
    if (nextTile.getAttribute('data-tooltip') == 'Personne ici') {
        nextTile.setAttribute('data-tooltip', player.Name);
    } else {
        oldPlusPlayer = nextTile.getAttribute('data-tooltip') + ' | ' + player.Name;
        nextTile.setAttribute('data-tooltip', oldPlusPlayer);
    }
    playAnimation(player.Color, oldTileNumber, nextTileNumber);
}

function apllyOldStyle(tile, oldStyle) {
    tile.style = oldStyle;
}

function playAnimation(playerColor, startTileNumber, endTileNumber) {
    let currentTileNumber = startTileNumber;

    function animateTile() {
        if (currentTileNumber > endTileNumber) {
            setTimeout(() => {
                // Display tile in full screen
                displayTilePopup(currentTileNumber);
                setTimeout(() => {
                    hidePopup(2);
                }, 3000);
            }, 1000);
            return;
        }
        const currentTile = document.getElementById(currentTileNumber);

        // Sauvegarder l'ancien style
        const oldStyle = {
            transform: currentTile.style.transform,
            boxShadow: currentTile.style.boxShadow,
        };

        // Appliquer la nouvelle transformation et l'ombre
        currentTile.style.transform = 'scale(1.2) rotate(-1deg)';
        currentTile.style.boxShadow = `${playerColor} 0 -25px 18px -14px inset, ${playerColor} 0 1px 2px, ${playerColor} 0 2px 4px, ${playerColor} 0 4px 8px, ${playerColor} 0 8px 16px, ${playerColor} 0 16px 32px`;

        // Réinitialiser l'ancien style après un délai
        setTimeout(() => {
            currentTile.style.transform = oldStyle.transform;
            currentTile.style.boxShadow = oldStyle.boxShadow;
        }, 1000); // Réinitialise après 1 seconde

        // Passer à la tuile suivante après un petit délai
        currentTileNumber++;
        setTimeout(animateTile, 150); // Délai entre chaque tuile en ms
    }

    animateTile();
}

function play() {
    turnPlaying = true;
    console.log('Le tour a commencé');
    // Locate player based on the turn
    currentPlayer = players[turnNb % players.length];

    // Affiche une popup pour lancer le dé
    displayDicePopup();
}

function endTurn(jet) {
    // Déplace le joueur du nombre de cases indiquées
    console.log('EndTurn jet : ' + jet);
    deletePlayerFromCurrentTile(currentPlayer);
    setPlayerTile(currentPlayer, jet);

    // End of the turn
    turnNb++;
    turnPlaying = false;
}