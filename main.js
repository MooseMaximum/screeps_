var roleHarvester = require('role.harvester');
var roleUpgrader = require('role.upgrader');
var roleBuilder = require('role.builder');
var roleRepairer = require('role.repairer');


module.exports.loop = function () {
    //assigns the name of the first spawn to 'firstSpawn'.
    for(var name in Game.spawns) {
        var firstSpawn =  name;
    }
    //creates the constant: HOMEtown, that is the name of the room of the firstSpawn variable.
    const HOMEtown = Game.spawns[firstSpawn].room.name;
    const HOMEbaseX = Game.spawns[firstSpawn].pos.x ;
    const HOMEbaseY = Game.spawns[firstSpawn].pos.y ;
    
    //garbage collection: for each name in creep memory, if name of creep not found, delete creep name from memory. Reports.
    for(var name in Memory.creeps) {
        if(!Game.creeps[name]) {
            delete Memory.creeps[name];
            console.log('Clearing non-existing creep memory:', name);
        }
    }
    var tower = Game.getObjectById('5af426a17d5d506a01a1c5ab');
    
    if(tower) {
        var closestDamagedStructure = tower.pos.findClosestByRange(FIND_STRUCTURES, {
            filter: (structure) => structure.hits < (structure.hitsMax/2)
        });
        
        if(closestDamagedStructure) {
            while (closestDamagedStructure.hits < closestDamagedStructure.hitsMax) { //loop causes too much CPU usage
                tower.repair(closestDamagedStructure);
                }
        }

        var closestHostile = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
        if(closestHostile) {
            tower.attack(closestHostile);
        }
    }
    
    //assigns the number of each unit to a variable name to go with
    var workers = _.filter(Game.creeps);
    var numworkers = workers.length;
    var harvesters = _.filter(Game.creeps, (creep) => creep.memory.role == 'harvester');
    var upgraders = _.filter(Game.creeps, (creep) => creep.memory.role == 'upgrader');
    var builders = _.filter(Game.creeps, (creep) => creep.memory.role == 'builder');
    var repairers = _.filter(Game.creeps, (creep) => creep.memory.role == 'repairer');
    
    var numharvesters = harvesters.length;
    var numupgraders = upgraders.length;
    var numbuilders = builders.length;
    var numrepairers = repairers.length;
    
    //stat reporting
    console.log('----------------');

    maintain_H_U_B(numharvesters, numupgraders, numbuilders, numworkers); //mainly just does stat reporting at the moment.
    
    var buildings = _.filter(Game.structures)
    //if number of harvesters is less than 2, spawn a harvester.
    if(harvesters.length < 6) {
        var newName = 'Harvester' + Game.time;
        console.log('Spawning new harvester: ' + newName);
        Game.spawns[firstSpawn].spawnCreep([WORK,WORK,CARRY,CARRY,MOVE], newName, {memory: {role: 'harvester'}});
    }
    //if number of upgraders is less than 1, spawn an upgrader.
    if(upgraders.length < 3) {
        var newName = 'Upgrader' + Game.time;
        console.log('Spawning new upgrader: ' + newName);
        Game.spawns[firstSpawn].spawnCreep( [WORK,WORK,CARRY,MOVE], newName, {memory: {role: 'upgrader'}});
    }
    //if number of builders is less than 2, spawn a builder.
    if(builders.length < 1) {
        var newName = 'Builder' + Game.time;
        console.log('Spawning new builder: ' + newName);
        Game.spawns[firstSpawn].spawnCreep([WORK,WORK,CARRY,CARRY,MOVE], newName, {memory: {role: 'builder'}});
    }
    if(numrepairers < 1 ) {
        var newName = 'Repairer' + Game.time;
        console.log('Spawning new repairer: ' + newName);
        Game.spawns[firstSpawn].spawnCreep([WORK,WORK,CARRY,MOVE], newName, {memory: {role: 'repairer'}});
    }
    
    //build condition? building in a cross pattern around it. Range:1
    /*if(builders.length > 1) {
        Game.rooms[HOMEtown].createConstructionSite(HOMEbaseX, HOMEbaseY+1, STRUCTURE_EXTENSION); //S
        Game.rooms[HOMEtown].createConstructionSite(HOMEbaseX-1, HOMEbaseY, STRUCTURE_EXTENSION); //W
        Game.rooms[HOMEtown].createConstructionSite(HOMEbaseX, HOMEbaseY-1, STRUCTURE_EXTENSION); //N
        Game.rooms[HOMEtown].createConstructionSite(HOMEbaseX+1, HOMEbaseY, STRUCTURE_EXTENSION); //E
    }*/
    
    //adds visual effect to spawn while spawning a creep.
    if(Game.spawns[firstSpawn].spawning) { 
        var spawningCreep = Game.creeps[Game.spawns[firstSpawn].spawning.name];
        Game.spawns[firstSpawn].room.visual.text(
            '🛠️' + spawningCreep.memory.role,
            Game.spawns[firstSpawn].pos.x + 1, 
            Game.spawns[firstSpawn].pos.y, 
            {align: 'left', opacity: 0.8});
    }
    //for each name in Game.creeps, if role in memory matches up, run matched role.
    for(var name in Game.creeps) {
        var creep = Game.creeps[name];
        if(creep.memory.role == 'harvester') {
            roleHarvester.run(creep);
        }
        if(creep.memory.role == 'upgrader') {
            roleUpgrader.run(creep);
        }
        if(creep.memory.role == 'builder') {
            roleBuilder.run(creep);
        }
        if(creep.memory.role == 'repairer') {
            roleRepairer.run(creep);
        }
    }
//reporting base name and location.
    console.log(HOMEtown);
    console.log(HOMEbaseX + ':' + HOMEbaseY);
}

function maintain_H_U_B(harvester, upgrader, builder, totalWorkers) {
    console.log('H:' + harvester + '  U:' + upgrader + '  B:' + builder + ' ::: ' + totalWorkers);
    
    return 0;
}