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
        mult = new Decimal(1);
        mult.mul(new Decimal(2).pow(getBuyableAmount(this.layer, 21)));
        return mult;
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
            title: "Quantum Input",
            description: "Celestial Essence gain is multiplied based on Celestial Particles.",
            cost: new Decimal(5),
            effect() {
                if (hasUpgrade(this.layer, 15)) {
                    return player[this.layer].points.add(new Decimal(1)).pow(new Decimal(0.4));
                } else {
                    return player[this.layer].points.add(new Decimal(1)).pow(new Decimal(0.333));
                }
            },
            effectDisplay() { return format(upgradeEffect(this.layer, this.id))+"x" } // Add formatting to the effect
        }, 
        12: {
            title: "Chain Reaction",
            description: "Celestial Essence gain is multiplied based on Celestial Essence.",
            cost: new Decimal(10),
            effect() {
                if (hasUpgrade(this.layer, 14)) {
                    return player.points.plus(1).log(4).plus(1);
                } else {
                    return player.points.plus(1).log(5).plus(1);
                }
            },
            effectDisplay() {
                return format(upgradeEffect(this.layer, this.id))+"x";
            } // Add formatting to the effect
        },
        13: {
            title: "Extended Particle Cycles",
            description: "Unlocks Particle Cycle Extenders. You get one for free :)",
            cost: new Decimal(40),
            effect() {
                if (getBuyableAmount(this.layer, 11).lte(new Decimal(0))) {
                    setBuyableAmount(this.layer, 11, new Decimal(1));
                }
            },
            effectDisplay() { 
                return "Extra cycle extensions each add " + format(buyableEffect(this.layer, 11)) + "x multiplier" 
            } // Add formatting to the effect
        },
        14: {
            title: "Violent Reaction",
            description: "Chain Reaction formula is now a lot more potent.",
            cost: new Decimal(650),
            effect() {
                
            }
        },
        15: {
            title: "BEAFY Input",
            description: "Quantum Input formula is now a lot more potent.",
            cost: new Decimal(1000),
            effect() {
                
            }
        },
        16: {
            title: "Extended Essence Condensing",
            description: "Unlocks Essense Condensation Extenders. You get one for free :)",
            cost: new Decimal(2000),
            effect() {
                if (getBuyableAmount(this.layer, 21).lte(new Decimal(0))) {
                    setBuyableAmount(this.layer, 21, new Decimal(1));
                }
            }
        
        },
        21: {
            title: "Ackermannian Condensation",
            description: "Improves the condensing rate of celestial essence to celestial particles",
            cost: new Decimal(3000),
            effect() {
                this.layer.exponent = new Decimal(0.6);
            }
        },
        22: {
            title: "Potent Cycles",
            description: "Unlocks a buyable that increases the effectiveness of Cycle Extensions. You get one for free :)",
            cost: new Decimal(20000),
            effect() {
                if (getBuyableAmount(this.layer, 12).lte(new Decimal(0))) {
                    setBuyableAmount(this.layer, 12, new Decimal(1));
                }
            }
        },
        23: {
            title: "Larger Cycles",
            description: "A buyable that allows for more complex seperators which increase the amount of buyable particles. You get one for free :)",
            cost: new Decimal(40000),
            effect() {
                if (getBuyableAmount(this.layer, 22).lte(new Decimal(0))) {
                    setBuyableAmount(this.layer, 22, new Decimal(1));
                }
            }
        }
    },
    buyables: {
        11: {
            title: "Cycle Extensions",
            cost(x) { return Decimal.floor(new Decimal(40).mul((new Decimal(2).pow((x).pow(1))))) },
            display() { return "Add a Particle Cycle Extension. \nCosts: " + this.cost(getBuyableAmount(this.layer, this.id)) + ` \n You currently have ` + getBuyableAmount(this.layer, 11) + ` Cycle Extensions` + ` \n Maximum: ` + this.purchaseLimit()},
            canAfford() { return player[this.layer].points.gte(this.cost(getBuyableAmount(this.layer, this.id))) },
            buy() {
                player[this.layer].points = player[this.layer].points.sub(this.cost(getBuyableAmount(this.layer, this.id)))
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            effect() {
                return new Decimal(new Decimal(2).add(new Decimal(0.1).mul(getBuyableAmount(this.layer, 12)))).pow(getBuyableAmount(this.layer, this.id));
            },
            unlocked() { return hasUpgrade('Celestial Particles', 13) },  
            purchaseLimit(){ return new Decimal(10).add(getBuyableAmount(this.layer, 22).mul(2))}
        },
        12: {
            title: "Extension Potency",
            cost(x) { return Decimal.floor(new Decimal(20000).mul((new Decimal(2).pow((x).pow(1.25))))) },
            display() { return "Increase cycle extension potency. \nCosts: " + this.cost(getBuyableAmount(this.layer, this.id)) + ` \n Your extension potency level is level ` + getBuyableAmount(this.layer, 12) + ` \n Maximum: ` + this.purchaseLimit},
            canAfford() { return player[this.layer].points.gte(this.cost(getBuyableAmount(this.layer, this.id))) },
            buy() {
                player[this.layer].points = player[this.layer].points.sub(this.cost(getBuyableAmount(this.layer, this.id)))
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            effect() {
            },
            unlocked() { return hasUpgrade('Celestial Particles', 22) },  
            purchaseLimit: new Decimal(10)
        },
        21: {
            title: "Essence Condenser",
            cost(x) { return Decimal.floor(new Decimal(2000).mul((new Decimal(2).pow((x).pow(1.25))))) },
            display() { return "Add a Celestial Essence Condenser. \nCosts: " + this.cost(getBuyableAmount(this.layer, this.id)) + ` \n You currently have ` + getBuyableAmount(this.layer, 21) + ` Essence Condensers` + ` \n Maximum: ` + this.purchaseLimit},
            canAfford() { return player[this.layer].points.gte(this.cost(getBuyableAmount(this.layer, this.id))) },
            buy() {
                player[this.layer].points = player[this.layer].points.sub(this.cost(getBuyableAmount(this.layer, this.id)))
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            effect() {

            },
            unlocked() { return hasUpgrade('Celestial Particles', 16) },  
            purchaseLimit: new Decimal(10)
        },
        22: {
            title: "Seperator Extensions",
            cost(x) { return Decimal.floor(new Decimal(40000).mul((new Decimal(2).pow((x).pow(1.25)))))},
            display() { return "Increases the number of buyable cycle extensions. \nCosts: " + this.cost(getBuyableAmount(this.layer, this.id)) + ` \n You currently have ` + (getBuyableAmount(this.layer, 22).mul(2)) + ` extra buyable extensions` + ` \n Maximum: ` + this.purchaseLimit},
            canAfford() { return player[this.layer].points.gte(this.cost(getBuyableAmount(this.layer, this.id))) },
            buy() {
                player[this.layer].points = player[this.layer].points.sub(this.cost(getBuyableAmount(this.layer, this.id)))
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            effect() {

            },
            unlocked() { return hasUpgrade('Celestial Particles', 23) },  
            purchaseLimit: new Decimal(10)
        }
    },
    clickables: {
        11: {
            display() {return "Generate Celestial Essence"},
            onClick() {
                player.points = player.points.add(getPointGen());
            },
            canClick() {
                return true;
            }
        }
    }
    
});