// ==UserScript==
// @name         Town Star Auto-Sell
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://townstar.sandbox-games.com/launch/
// @grant        GM_setValue
// @grant        GM_listValues
// @grant        GM_getValue
// @grant        GM_deleteValue
// @run-at       document-start
// ==/UserScript==

(function() {
    'use strict';
    const items = ['Pinot_Noir', 'Wood', 'Lumber', "Water_Drum", 'Gasoline', 'Pinot_Noir_Grapes']; // names of items which you want to autosell. Use underscore instead of space if more than one word. Items listed at the start of the list have priority if mutliple items could be sold at the same time.
    const minAmountForSell = [10, 20, 20, 20, 40, 40]; // minimum amount per item required to start to sell. Each number is paired with the corresponding item of the items array.
    const sellTick = 120; // Number of seconds for the script to check for sellable items. Make sure this value it at least 10s higher than your closest trade trip duration
    const depotType = 'Trade_Depot'; // Valid Options: 'Trade_Depot', 'Trade_Pier', 'Freight_Pier', 'Express_Depot'
    let sellingActive = 0; // keep at 0, enables itself after game loaded properly

    new MutationObserver(function(mutations){
        let airdropcollected = 0;
        if(document.getElementsByClassName('hud-jimmy-button')[0] && document.getElementsByClassName('hud-jimmy-button')[0].style.display != 'none'){
            document.getElementsByClassName('hud-jimmy-button')[0].click();
            document.getElementById('Deliver-Request').getElementsByClassName('yes')[0].click();
        }
        if(document.getElementsByClassName('hud-airdrop-button')[0] && document.getElementsByClassName('hud-airdrop-button')[0].style.display != 'none'){
            if(airdropcollected == 0){
                airdropcollected = 1;
                document.getElementsByClassName('hud-airdrop-button')[0].click();
                document.getElementsByClassName('air-drop')[0].getElementsByClassName('yes')[0].click();
            }
        }
        if (document.getElementById("playnow-container") && document.getElementById("playnow-container").style.visibility !== "hidden") {
            document.getElementById("playButton").click();
        }
        if(typeof Game != 'undefined' && Game.town != null) {
            if(sellingActive == 0) {
              console.log('Game loaded');
              if (items.length != minAmountForSell.length) {
                  console.log("Lists of item types and amounts are not equally long, please check script configurations")
              }
              sellingActive = 1;
              activateSelling();
            }
        }
    }).observe(document, {attributes: true, childList: true , subtree: true});

    function activateSelling() {
        let start = GM_getValue("start", Date.now());
        GM_setValue("start", start);
        setTimeout(function(){
            let tempSpawnCon = Trade.prototype.SpawnConnection;
            Trade.prototype.SpawnConnection = function(r) {tempSpawnCon.call(this, r); console.log(r.craftType); GM_setValue(Math.round((Date.now() - start)/1000).toString(), r.craftType);}
        },10000);
        let depotObj = Object.values(Game.town.objectDict).find(o => o.type.toLowerCase() === depotType.toLowerCase());
        let depotKey = "[" + depotObj.townX + ", " + "0, " + depotObj.townZ + "]";
        window.mySellTimer = setInterval(function(){
            Game.town.objectDict[depotKey].logicObject.OnTapped();
            var i;
            for (i = 0; i < items.length; i++) {
                console.log((items[i]) + ": " + Game.town.GetStoredCrafts()[items[i]])
            }

            if (Game.town.GetStoredCrafts()["Gasoline"] > 0) {
                let count;
                for (count = 0; count < items.length; count++) {
                    if (Game.town.GetStoredCrafts()[items[count]] >= minAmountForSell[count]) {
                        console.log("Selling " + [items[count]] + "!");
                        Game.app.fire("SellClicked", {x: depotObj.townX, z: depotObj.townZ});
                        setTimeout(function(){
                            let craftTarget = document.getElementById("trade-craft-target");
                            craftTarget.querySelectorAll('[Data-name="' + [items[count]] + '"]')[0].click();
                            setTimeout(function(){
                                document.getElementById("destination-target").getElementsByClassName("destination")[0].getElementsByClassName("sell-button")[0].click();
                            },1000);
                        },5000);
                        {break};
                    } 
                }
            }

        },sellTick*1000);
    }
})();