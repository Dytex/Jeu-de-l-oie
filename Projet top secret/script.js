players = [];
gameDifficulty = 'hard';
numberOfPlayers = 0;
turnPlaying = false;
gameEnded = false;
creatingPlayer = false;
turnNb = 0;
jet = 0;
actionTiles = [5, 8, 18, 19, 23, 32, 36, 38];

document.addEventListener("keydown", function(event) {
    if (event.code === "Enter" && turnPlaying == false && creatingPlayer == false && players.length > 0 && gameEnded == false) {
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
    var playerPoint = document.createElement('div');
    playerPoint.className = 'point';
    playerPoint.style.backgroundColor = playerColor;
    playerPoint.id = playerName;

    if (playerName.length <= 20 && playerName.length > 0) {
        // Add the current player to the first tile
        firstTile = document.getElementsByClassName('tile')[0];
        firstTile.appendChild(playerPoint);
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
        alert('Ton nom est trop long, essaie en un plus court 🤖');
    } else if (playerName.length == 0) {
        alert("Essaie avec un nom qui contient des lettres 😅");
    }
}

function displayCreatePlayerPopup() {
    // Empêche le lancement d'un tour
    creatingPlayer = true;
    document.getElementById('nom').value = '';
    document.getElementById('couleur').value = '#' + (Math.random() * 0xFFFFFF << 0).toString(16).padStart(6, '0');
    formulaire = document.getElementsByClassName('form')[0];
    formulaire.style.display = 'flex';
    formulaire.style.transform = 'translate(-50%, -50%) scale(0)';
    setTimeout(() => {
        formulaire.style.transform = 'translate(-50%, -50%) scale(1)';
    }, 10);
}

function displayDicePopup(turnNotPlayed, actionNb) {
    // Get the parent tile to scroll into view
    playerTile = document.getElementById(currentPlayer.Name).parentElement;
    playerTile.scrollIntoView({ behavior: "smooth", block: "center" });
    playerName = document.getElementById('playerName');
    playerName.innerHTML = 'A <span style="color: ' + currentPlayer.Color + '">' + currentPlayer.Name + '</span> de jouer !';
    formulaire = document.getElementsByClassName('form')[1];
    formulaire.style.display = 'flex';
    formulaire.style.transform = 'translate(-50%, -50%) scale(0)';
    if (turnNotPlayed != true) {
        setTimeout(() => {
            formulaire.style.transform = 'translate(-50%, -50%) scale(1)';
        }, 10);
    } else {
        launchDiceButton = document.getElementById('boutonLance');
        launchDiceButton.setAttribute('onclick', 'rollDice(true, ' + actionNb + ')');
        setTimeout(() => {
            formulaire.style.transform = 'translate(-50%, -50%) scale(1)';
        }, 10);
    }

}

function displayAction18Popup() {
    playerName = document.getElementById('chooseAction');
    playerName.innerHTML = 'Aller <span style="color: ' + currentPlayer.Color + '">' + currentPlayer.Name + '</span> à toi de choisir ! <br>';
    formulaire = document.getElementsByClassName('form')[4];
    formulaire.style.transform = 'translate(-50%, -50%) scale(0)';
    setTimeout(() => {
        formulaire.style.display = 'flex';
        setTimeout(() => {
            formulaire.style.transform = 'translate(-50%, -50%) scale(1)';
        }, 250);
    }, 250);
}

function displayChoicePopup(diceResult, actionNb) {
    playerName = document.getElementById('choice');
    if (actionNb == 19) {
        if (diceResult % 2 == 0) { // Pair
            // Safe Zone
            playerName.innerHTML = 'Tu es en safe zone <span style="color: ' + currentPlayer.Color + '">' + currentPlayer.Name + '</span>. <br> Petit chanceux 😏';
        } else {
            playerName.innerHTML = 'Et un shot pour notre cher ami <span style="color: ' + currentPlayer.Color + '">' + currentPlayer.Name + '</span> ! <br> T\'auras peut-être plus de chance la prochaine fois 😁';
        }
    } else if (actionNb == 32) {
        if (diceResult < 3) {
            // Tu bois
            playerName.innerHTML = 'À ta santé ' + currentPlayer.Color + '">' + currentPlayer.Name + '</span> ! 🥂 <br> Tu prends un shot';
        } else {
            // Tout le monde bois
            playerName.innerHTML = 'Tout le monde sauf <span style="color: ' + currentPlayer.Color + '">' + currentPlayer.Name + '</span> bois ! 🥳';
        }
    }
    formulaire = document.getElementsByClassName('form')[5];
    formulaire.style.transform = 'translate(-50%, -50%) scale(0)';
    setTimeout(() => {
        formulaire.style.display = 'flex';
        setTimeout(() => {
            formulaire.style.transform = 'translate(-50%, -50%) scale(1)';
        }, 250);
    }, 250);
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

function displayWinPopup(player) {
    formulaire = document.getElementsByClassName('form')[3];
    var divForText = document.getElementById('winPopup');
    divForText.innerHTML = '<span id="felicitation">Félicitations <span style="color: ' + player.Color + '">' + player.Name + '</span> ! 🥳</span> <br/> Tu viens de battre tes camarades de beuverie 🥂 <br> J\'espère que ce petit jeu ne vous aura pas trop amoché 😈';
    formulaire.style.transform = 'translate(-50%, -50%) scale(0)';
    setTimeout(() => {
        formulaire.style.display = 'flex';
        setTimeout(() => {
            formulaire.style.transform = 'translate(-50%, -50%) scale(1)';
            gameEnded = true;
        }, 250);
    }, 250);
}

function hidePopup(formNb, bouton, isCancel) {
    formulaire = document.getElementsByClassName('form')[formNb];
    formulaire.style.transform = 'translate(-50%, -50%) scale(0)';
    if (isCancel == true) {
        creatingPlayer = false;
    }
    setTimeout(() => {
        formulaire.style.display = 'none';
        if (formNb == 1) {
            bouton.disabled = false;
        }
    }, 250);
}

function rollDice(turnNotPlayed, actionNb) {
    console.log('Turn not played ' + turnNotPlayed);
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
    if (turnNotPlayed != true) {
        setTimeout(() => {
            hidePopup(1, bouton);
            inTurn(diceOne);
        }, 3000); // Réinitialise après 3 seconde
    } else {
        setTimeout(() => {
            hidePopup(1, bouton);
            displayChoicePopup(diceOne, actionNb);
            setTimeout(() => {
                hidePopup(5);
                launchDiceButton = document.getElementById('boutonLance');
                launchDiceButton.setAttribute('onclick', 'rollDice()');
                endTurn();
            }, 5000);
        }, 3000); // Réinitialise après 3 seconde
    }

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

    inTurn(number);
}

function deletePlayerFromCurrentTile(player) {
    // Get the current player tile
    currentTile = document.getElementById(player.CurrentTile);
    console.log(currentTile.getAttribute('data-tooltip'));

    //Remove his point from it
    var playerPoint = document.getElementById(player.Name);
    playerPoint.remove();

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
    var doExcedingAnimation = false;
    // Get next tile
    if (nextTileNumber > 38) {
        // Play end scenarios
        if (gameDifficulty == 'easy') {
            nextTile = document.getElementById(38);
            nextTileNumber = 38;
        } else {
            var exceeding = nextTileNumber - 38;
            nextTileNumber = 38 - exceeding;
            player.CurrentTile = nextTileNumber;
            nextTile = document.getElementById(player.CurrentTile);
            doExcedingAnimation = true;
        }
    } else {
        nextTile = document.getElementById(player.CurrentTile);
    }


    // Si personne n'est sur la case remplacer le nom par celui du joueur
    if (nextTile.getAttribute('data-tooltip') == 'Personne ici') {
        nextTile.setAttribute('data-tooltip', player.Name);
    } else {
        oldPlusPlayer = nextTile.getAttribute('data-tooltip') + ' | ' + player.Name;
        nextTile.setAttribute('data-tooltip', oldPlusPlayer);
    }

    // Ajouter son pion dessus
    var playerPoint = document.createElement('div');
    playerPoint.className = 'point';
    playerPoint.style.backgroundColor = player.Color;
    playerPoint.id = player.Name;
    nextTile.appendChild(playerPoint);
    nextTile.scrollIntoView({ behavior: "smooth", block: "center" });
    if (doExcedingAnimation == false) {
        playAnimation(player.Color, oldTileNumber, nextTileNumber);
    } else {
        playExceedingAnimation(player.Color, oldTileNumber, nextTileNumber);
    }

}

function setPlayerExactTile(player, nombre) {
    // Get the current player tile
    oldTileNumber = player.CurrentTile;
    player.CurrentTile = nombre;
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

    // Ajouter son pion dessus
    var playerPoint = document.createElement('div');
    playerPoint.className = 'point';
    playerPoint.style.backgroundColor = player.Color;
    playerPoint.id = player.Name;
    nextTile.appendChild(playerPoint);
    nextTile.scrollIntoView({ behavior: "smooth", block: "center" });
    playAnimation(player.Color, oldTileNumber, nextTileNumber);
}

function apllyOldStyle(tile, oldStyle) {
    tile.style = oldStyle;
}

function playActionTile(tileNb) {
    if (tileNb == 8 || tileNb == 23 || tileNb == 36) {
        // Restart
        deletePlayerFromCurrentTile(currentPlayer);
        setPlayerExactTile(currentPlayer, 0);
    } else if (tileNb == 5) {
        // Replace le joueur à la case 4
        deletePlayerFromCurrentTile(currentPlayer);
        setPlayerExactTile(currentPlayer, 4);
    } else if (tileNb == 18) {
        // Recule de deux cases ou rejoue
        displayAction18Popup();
    } else if (tileNb == 19) {
        // Paire Impaire
        setTimeout(() => {
            displayDicePopup(true, 19);
        }, 490); // Réinitialise après 3 seconde
    } else if (tileNb == 32) {
        // 1 à 3 tu bois 4 à 6 tout le monde bois
        setTimeout(() => {
            displayDicePopup(true, 32);
        }, 490); // Réinitialise après 3 seconde
    } else if (tileNb == 38) {
        // Game won Congratulations !
        displayWinPopup(currentPlayer);
    } else {
        endTurn();
    }
}

function playAnimation(playerColor, startTileNumber, endTileNumber) {
    let currentTileNumber = startTileNumber;

    if (startTileNumber < endTileNumber) {
        function animateTile() {
            if (currentTileNumber > endTileNumber) {
                // check if the last tile is an action tile
                if (actionTiles.includes(endTileNumber)) {
                    setTimeout(() => {
                        // Display tile in full screen
                        displayTilePopup(currentTileNumber);
                        setTimeout(() => {
                            hidePopup(2);
                            playActionTile(endTileNumber);
                        }, 3000);
                    }, 1000);
                } else {
                    setTimeout(() => {
                        // Display tile in full screen
                        displayTilePopup(currentTileNumber);
                        setTimeout(() => {
                            hidePopup(2);
                            endTurn();
                        }, 3000);
                    }, 1000);
                }
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
    } else {
        function animateTile() {
            if (currentTileNumber < endTileNumber) {
                setTimeout(() => {
                    // Display tile in full screen
                    pngNb = endTileNumber + 1;
                    displayTilePopup(pngNb);
                    setTimeout(() => {
                        hidePopup(2);
                        endTurn();
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
            currentTileNumber--;
            setTimeout(animateTile, 150); // Délai entre chaque tuile en ms
        }
    }


    animateTile();
}

function playExceedingAnimation(playerColor, startTileNumber, endTileNumber) {
    let currentTileNumber = startTileNumber;
    var endMet = false;
    // Was 38 met ?
    function animateTileToEnd() {
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
        console.log(currentTileNumber);
        // Passer à la tuile suivante après un petit délai
        if (currentTileNumber == 38) {
            setTimeout(animateTileForEnd, 1000); // Délai entre chaque tuile en ms
            currentTileNumber--;
        } else {
            currentTileNumber++;
            setTimeout(animateTileToEnd, 150); // Délai entre chaque tuile en ms
        }
    }

    function animateTileForEnd() {
        if (currentTileNumber < endTileNumber) {
            // check if the last tile is an action tile
            if (actionTiles.includes(endTileNumber)) {
                // Display tile in full screen
                pngNb = endTileNumber + 1;
                displayTilePopup(pngNb);
                setTimeout(() => {
                    hidePopup(2);
                    playActionTile(endTileNumber);
                }, 3000);
            } else {
                setTimeout(() => {
                    // Display tile in full screen
                    pngNb = endTileNumber + 1;
                    displayTilePopup(pngNb);
                    setTimeout(() => {
                        hidePopup(2);
                        endTurn();
                    }, 3000);
                }, 1000);
            }
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
        currentTileNumber--;
        setTimeout(animateTileForEnd, 150); // Délai entre chaque tuile en ms
    }

    animateTileToEnd();
}

function backupTiles() {
    hidePopup(4);
    setTimeout(() => {
        deletePlayerFromCurrentTile(currentPlayer);
        setPlayerExactTile(currentPlayer, currentPlayer.CurrentTile - 2);
    }, 250);
}

function replayTurn() {
    hidePopup(4);
    setTimeout(() => {
        displayDicePopup();
    }, 250);
}

function play() {
    turnPlaying = true;
    console.log('Le tour a commencé');
    // Locate player based on the turn
    if (turnNb == 0) {
        currentPlayer = players[turnNb % players.length];
    }

    // Affiche une popup pour lancer le dé
    displayDicePopup();
}

function inTurn(jet) {
    // Déplace le joueur du nombre de cases indiquées
    console.log('EndTurn jet : ' + jet);
    deletePlayerFromCurrentTile(currentPlayer);
    setPlayerTile(currentPlayer, jet);
}

function endTurn() {
    // End of the turn
    console.log('The turn has ended !');
    turnNb++;
    if (turnNb != 0) {
        currentPlayer = players[turnNb % players.length];
    }
    turnPlaying = false;
}