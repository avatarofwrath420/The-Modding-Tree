addLayer("Matter", {
    name: "Matter", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "M", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 1, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    resetarray: ["upgrades"],
    startData() { return {
        unlocked: true,
		points: new Decimal(0),
    }},
    color: "#e41bac",
    requires: new Decimal(100), // Can be a function that takes requirement increases into account
    resource: "Metric Tons of Matter", // Name of prestige currency
    baseResource: "Celestial Particles", // Name of resource prestige is based on
    baseAmount() {return player["Celestial Particles"].points}, // Get the current amount of baseResource
    type: "normal", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: 0.5, // Prestige currency exponent
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new Decimal(1);
        return mult;
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        return new Decimal(1)
    },
    row: 1, // Row the layer is in on the tree (0 is the first row)
    hotkeys: [
        {key: "m", description: "M: Convert all " + this.baseResource + " Celestial Particles into " + this.points + " Metric Tons of Matter", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],
    layerShown(){return true},
    upgrades: {

    }, 
    buyables: {
        11: {
            title: "Cycle Extensions",
            cost(x) { return Decimal.floor(new Decimal(40).mul((new Decimal(2).pow((x).pow(1))))) },
            display() { return "Add a Particle Cycle Extension. \nCosts: " + this.cost(getBuyableAmount(this.layer, this.id)) + ` \n You currently have ` + getBuyableAmount(this.layer, 11) + ` Cycle Extensions` + ` \n Maximum: ` + this.purchaseLimit() + "\nEach extension adds a x" + this.effect() + " multiplier to celestial essence gain. In total, your extensions add a x" + format(buyableEffect(this.layer, 11)) + " multiplier to celestial essence generation."},
            canAfford() { return player[this.layer].points.gte(this.cost(getBuyableAmount(this.layer, this.id))) },
            buy() {
                player[this.layer].points = player[this.layer].points.sub(this.cost(getBuyableAmount(this.layer, this.id)))
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            effect() {
                return new Decimal(new Decimal(2).add(new Decimal(0.1).mul(getBuyableAmount(this.layer, 12)))).pow(getBuyableAmount(this.layer, this.id)).ceil();
            },
            purchaseLimit(){ return new Decimal(10)}
        }
    },
    clickables: {

    }

});