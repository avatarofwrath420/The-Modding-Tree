addLayer("Celestial Particles", {
    name: "Celestial Particles", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "P", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: true,
		points: new Decimal(0),
    }},
    color: "#20c8df",
    requires: new Decimal(10), // Can be a function that takes requirement increases into account
    resource: "Celestial Particles", // Name of prestige currency
    baseResource: "Celestial Essence", // Name of resource prestige is based on
    baseAmount() {return player.points}, // Get the current amount of baseResource
    type: "normal", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: 0.5, // Prestige currency exponent
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new Decimal(1)
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        return new Decimal(1)
    },
    row: 0, // Row the layer is in on the tree (0 is the first row)
    hotkeys: [
        {key: "p", description: "P: Convert Celestial Particles into Celestial Essence", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],
    layerShown(){return true},
    upgrades: {
        11: {
            name: "Quantum Input",
            description: "Celestial Essence gain is multiplied based on Celestial Particles.",
            cost: new Decimal(3),
            effect() {
                return player[this.layer].points.add(1).pow(0.5)
            },
            effectDisplay() { return format(upgradeEffect(this.layer, this.id))+"x" }, // Add formatting to the effect
        }, 
        12: {
            name: "Chain Reaction",
            description: "Celestial particle gain is multiplied based on Celestial Essence.",
            cost: new Decimal(10),
            effect() {
                return player.points.plus(1).pow(0.25)
            },
            effectDisplay() { return format(upgradeEffect(this.layer, this.id))+"x" }, // Add formatting to the effect
        },
        13: {
            name: "Extended Particle Cycles",
            description: "Unlocks Particle Cycle Extenders. You get one for free :)",
            cost: new Decimal(50),
            effect() {
                setBuyableAmount(this.layer, 11, 1);
            },
            effectDisplay() { return "Extra cycle extensions each add " + format(upgradeEffect(this.layer, this.id))+"x multiplier" }, // Add formatting to the effect
        }
    },
    buyables: {
        11: {
            cost(x) { return new Decimal(50).mul(Decimal.ceil(new Decimal(2).pow(x))) },
            display() { return "Add Particle Cycle Extension. Costs :" + this.cost(getBuyableAmount(this.layer, this.id))},
            canAfford() { return player[this.layer].points.gte(this.cost(getBuyableAmount(this.layer, this.id))) },
            buy() {
                player[this.layer].points = player[this.layer].points.sub(this.cost(getBuyableAmount(this.layer, this.id)))
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            effect() {
                return new Decimal(2).pow(getBuyableAmount(this.layer, this.id));
            },
            unlocked() { return hasUpgrade('Celestial Particles', 13) },  
            purchaseLimit: 10
        }
    }
    
})
